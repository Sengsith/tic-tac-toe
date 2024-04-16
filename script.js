// gameboard is an array inside of Gameboard object
// players are stored in objects
// an object will control flow of game

// minimize global code and utilize factories
// if you only need a single instance of something (e.g. the gameboard, the displayController etc.) then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances.
// Each little piece of functionality should be able to fit in the game, player or gameboard objects.
// Try to avoid thinking about the DOM and your HTML/CSS until your game is working.

// Once you have a working console game, create an object that will handle the display/DOM logic.
// Write a function that will render the contents of the gameboard array to the webpage (for now, you can always just fill the gameboard array with "X"s and "O"s just to see what’s going on).

// Write the functions that allow players to add marks to a specific spot on the board by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker). Don’t forget the logic that keeps players from playing in spots that are already taken!

// Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end!

// Single gameboard using IIFE
// Single displayController using IIFE
// Factory to create players since we have 2

// Cell factory
// empty - no player space
// o - player1
// x - player2
const Cell = () => {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getToken = () => value;

  return { addToken, getToken };
};

// Player factory
// Inputs: shape
// Outputs: shape
const Player = (token) => {
  const getToken = () => token;

  return { getToken };
};

// GameBoard factory
// Inputs: player1, player2
// Outputs: gameBoard.board
// private: gamestate enum,
const gameBoard = (() => {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (player, row, col) => {
    board[row - 1][col - 1].addToken(player.getToken());
  };

  const printBoard = () => {
    board.forEach((row) => {
      const rowValues = row.map((cell) => cell.getToken());
      console.log(rowValues);
    });
  };

  return { getBoard, placeToken, printBoard };
})();

// displayController factory
// Inputs: GameBoard.board
// Outputs: GameBoard.board
// private: any DOM elements

// Global code----------------------------------
const player1 = Player("o");
const player2 = Player("x");

// Test player.getToken()
//console.log(player1.getToken());
//PASS

// Test Cell.addToken()
// const testCell = Cell();
// const testCell2 = Cell();
// testCell.addToken(player1);
// console.log(testCell.isTaken());
// console.log(testCell2.isTaken());
//PASS

// Test gameBoard.getToken
// gameBoard.placeToken(player1, 2, 2);
// gameBoard.getBoard().forEach((row) => {
//   row.forEach((cell) => {
//     console.log(cell.getToken());
//   });
// });
//PASS

// Test gameboard.printBoard
// gameBoard.placeToken(player1, 2, 2);
// gameBoard.placeToken(player2, 1, 1);
// gameBoard.placeToken(player1, 3, 1);
// gameBoard.placeToken(player2, 1, 3);
// gameBoard.printBoard();
//PASS
