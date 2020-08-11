// Reading the input from the user that initiated the process.
var process = require('process');
var console = require('console');
//var setInterval = require('setInterval');

var WWidth  = process.argv[2] || 30;
var WHeight = process.argv[3] || 10;

// Some snake data

var SHx = process.argv[4] || 4;   //Snake head X coordinate
var SHy = process.argv[5] || 6;   //Snake head Y coordinate
var Sl  = process.argv[6] || 3;   // Snake length in segments including the head
var Sd  = process.argv[7] || 'S'; // Snake movement direction [N,S,E,W]

// Constants defined that render the world.

var WC = '+'; // world corner
var WV = '|'; // world vertical wall (edge)
var WH = '-'; // world horizontal wall (edge)
var WS = ' '; // world space (a space character)
var SH = 'O'; // snake head
var SB = 'o'; // snake body
var SF = '$'; // snake food
var SC = '*'; // snake collision

// Define the World

var world = [];
for (var row = 0; row < WHeight; row++) {
  world[row] = [];
  for (var col = 0; col < WWidth; col++) {
    world[row][col] = WS;
  }
}

// World conners setup

world[0][0] = WC; // Top Left cell
world[WHeight - 1][0] = WC; // Bottom Left cell
world[0][WWidth - 1] = WC; // Top Right cell
world[WHeight - 1][WWidth - 1] = WC; // Bottom Right cell

// Set the world Vertical Walls (edges)
for (var row = 1; row < WHeight - 1; row++) {
    world[row][0] = world[row][WWidth - 1] = WV;
}
// Set the world Horizontal Walls (edges)
for (var col = 1; col < WWidth - 1; col++) {
    world[0][col] = world[WHeight - 1][col] = WH;
}

var snake = [[SHx, SHy]];

var Br = SHx;
var Bc = SHy;
var hasExceded = false;
for (var body = 0; body < Sl; body++) {
  switch (Sd.toUpperCase()) {
    // Column movement
    case 'W':
      Bc--;
      break;
    case 'E':
      Bc++;
      break;
    // Row movement
    case 'N':
      Br++;
      break;
    case 'S':
      Br--;
      break;
  }
  if ((0 < Br) && (Br < WHeight - 1) && (0 < Bc) && (Bc < WWidth - 1)) {
    snake.push([Br, Bc]);
  } else {
    hasExceded = true;
    break;
  }
}

function _inSnake(r, c, snakeArray) {
    for (var snakeSegmentIndex = 0; snakeSegmentIndex < snakeArray.length; snakeSegmentIndex++) {
        var snakeSegmentCoordinates = snakeArray[snakeSegmentIndex];
      if (snakeSegmentCoordinates[0] === r && snakeSegmentCoordinates[1] === c) {
        return snakeSegmentIndex;
      }
    }
    return -1;
}

// Matrix serialization

function world2string(worldMatrix, snakeArray) {
    var s = ""; // Accumulator|Aggregator
    for (var row = 0; row < worldMatrix.length; row++) {
      for (var col = 0; col < worldMatrix[row].length; col++) {
        var snakeSegmentIndex = _inSnake(row, col, snakeArray);
        if (snakeSegmentIndex < 0 || worldMatrix[row][col] === SC) {
          s += worldMatrix[row][col];
        } else {
          if (snakeSegmentIndex === 0) {
            s += SH;
          } else {
            s += SB;
          }
        }
      }
      s += '\n';
    }
    return s;
}

// Drawing the world

function drawWorld(worldMatrix, snakeArray) {
    if (hasExceded) {
      console.warn('Snake body exceeded world');
    }
    process.stdout.write('\x1Bc');
    process.stdout.write(world2string(worldMatrix, snakeArray));
}

function snakeMovement(snake, direction) {
    direction = direction || Sd;
    var head  = snake[0];
    switch (direction.toUpperCase()) {
      // Column movement
      case 'N':
        SHx = head[0] - 1;
        SHy = head[1];
        break;
      case 'S':
        SHx = head[0] + 1;
        SHy = head[1];
        break;
      // Row movement
      case 'W':
        SHx = head[0];
        SHy = head[1] - 1;
        break;
      case 'E':
        SHx = head[0];
        SHy = head[1] + 1;
        break;
    }
    // if is NOT valid (SHx, SHy) Game over
    if (isTheFieldEmpty(SHx, SHy)) {
      if (_inSnake(SHx, SHy, snake) < 0) {
        snake.unshift([SHx, SHy]);
        snake.pop();
      } else {
        world[SHx][SHy] = SC;
        drawWorld(world, snake);
        console.log('Game Over! The snake had hit itself in the body!');
        process.exit(0);
      }
    } else if (isFood(SHx, SHy)) {
      world[SHx][SHy] = WS;
      snake.unshift([SHx, SHy]);
      spawnFood();
    } else {
      world[SHx][SHy] = SC;
      drawWorld(world, snake);
      console.log('Game Over! The snake had hit a wall!');
      process.exit(0);
    }
}

function isTheFieldEmpty(r, c) {
    return world[r][c] === WS;
}
  
function isFood(r, c) {
    return world[r][c] === SF;
}
  
function getRandomNumber(min, max) {
    // Nice copy-paste, except that max is not the maximum but the supremum
    return Math.floor(Math.random() * (max - min) + min);
}
  
function spawnFood(r, c) {
    if (!r || !c) {
      do {
        r = getRandomNumber(1, WHeight - 2);
        c = getRandomNumber(1, WWidth - 2);
      } while (isTheFieldEmpty(r, c) && !_inSnake(r, c, snake));
    } // TODO: Verify that the input is sane (0<r<H-1 && 0<c<W-1)
    world[r][c] = SF;
}

//Start the game
spawnFood(4, 5);
drawWorld(world, snake);


// Reading CLI input
var readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', function (s, key) {
  switch (key.name) {
    case "up":
      Sd = 'N';
      break;
    case "down":
      Sd = 'S';
      break;
    case "left":
      Sd = 'W';
      break;
    case "right":
      Sd = 'E';
      break;
    case "c": // CTRL+C exit the game
      if (key.ctrl) {
        process.exit();
      }
      break;
  }
});

setInterval(function () {
  snakeMovement(snake);
  drawWorld(world, snake);
}, 200);