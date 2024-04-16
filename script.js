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

// gameBoard factory IIFE
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

  const placeToken = (playerToken, row, col) => {
    board[row - 1][col - 1].addToken(playerToken);
  };

  const printBoard = () => {
    board.forEach((row) => {
      const rowValues = row.map((cell) => cell.getToken());
      console.log(rowValues);
    });
  };

  return { getBoard, placeToken, printBoard };
})();

// gameController factory IIFE
const gameController = (() => {
  const players = [
    {
      name: "Player One",
      token: "o",
    },
    {
      name: "Player Two",
      token: "x",
    },
  ];

  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer.name;

  const printNewRound = () => console.log(`It is now ${getActivePlayer()}'s turn!`);

  const playRound = (row, col) => {
    console.log(`Placing an '${activePlayer.token}' on row ${row}, col ${col}.`);
    gameBoard.placeToken(activePlayer.token, row, col);
    gameBoard.printBoard();

    switchActivePlayer();
    printNewRound();
  };

  // Initial print message on initialize.
  printNewRound();

  return {
    getActivePlayer,
    playRound,
  };
})(gameBoard);

// Global code ---------------------------------------
gameController.playRound(2, 2);
gameController.playRound(1, 1);
