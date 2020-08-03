"use strict"

// Reading the input from the user that initiated the process.

let WWidth  = process.argv[2] || 30;
let WHeight = process.argv[3] || 10;

// Some snake data

let SHx = process.argv[4] || 4;   //Snake head X coordinate
let SHy = process.argv[5] || 6;   //Snake head Y coordinate
let Sl  = process.argv[6] || 3;   // Snake length in segments including the head
let Sd  = process.argv[7] || 'S'; // Snake movement direction [N,S,E,W]

// Constants defined that render the world.

const WC = '+'; // world corner
const WV = '|'; // world vertical wall (edge)
const WH = '-'; // world horizontal wall (edge)
const WS = ' '; // world space (a space character)
const SH = 'O'; // snake head
const SB = 'o'; // snake body
const SF = '$'; // snake food
const SC = '*'; // snake collision

// Define the World

let world = [];
for (let row = 0; row < WHeight; row++) {
  world[row] = [];
  for (let col = 0; col < WWidth; col++) {
    world[row][col] = WS;
  }
}

// World conners setup

world[0][0] = WC; // Top Left cell
world[WHeight - 1][0] = WC; // Bottom Left cell
world[0][WWidth - 1] = WC; // Top Right cell
world[WHeight - 1][WWidth - 1] = WC; // Bottom Right cell

// Set the world Vertical Walls (edges)
for (let row = 1; row < WHeight - 1; row++) {
    world[row][0] = world[row][WWidth - 1] = WV;
}
// Set the world Horizontal Walls (edges)
for (let col = 1; col < WWidth - 1; col++) {
    world[0][col] = world[WHeight - 1][col] = WH;
}

let snake = [[SHx, SHy]];

let Br = SHx;
let Bc = SHy;
let hasExceded = false;
for (let body = 0; body < Sl; body++) {
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
    for (let snakeSegmentIndex = 0; snakeSegmentIndex < snakeArray.length; snakeSegmentIndex++) {
      let snakeSegmentCoordinates = snakeArray[snakeSegmentIndex];
      if (snakeSegmentCoordinates[0] === r && snakeSegmentCoordinates[1] === c) {
        return snakeSegmentIndex;
      }
    }
    return -1;
}

// Matrix serialization

function world2string(worldMatrix, snakeArray) {
    let s = ""; // Accumulator|Aggregator
    for (let row = 0; row < worldMatrix.length; row++) {
      for (let col = 0; col < worldMatrix[row].length; col++) {
        let snakeSegmentIndex = _inSnake(row, col, snakeArray);
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
    let head  = snake[0];
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