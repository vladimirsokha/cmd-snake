"use strict"

// Reading the input from the user that initiated the process.

let WWidth  = process.argv[2] || 30;
let WHeight = process.argv[3] || 10;

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