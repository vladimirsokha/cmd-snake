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