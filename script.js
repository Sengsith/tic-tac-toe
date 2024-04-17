// Once you have a working console game, create an object that will handle the display/DOM logic.
// Write a function that will render the contents of the gameboard array to the webpage (for now, you can always just fill the gameboard array with "X"s and "O"s just to see what’s going on).

// Write the functions that allow players to add marks to a specific spot on the board by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker). Don’t forget the logic that keeps players from playing in spots that are already taken!

// Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end!

// Cell factory
const Cell = () => {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getToken = () => value;

  return { addToken, getToken };
};

// gameBoard factory IIFE
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

    // Check for a win
    if (checkForWin(row, col)) {
      console.log(`${activePlayer.name} wins!`);
      return;
    }

    switchActivePlayer();
    printNewRound();
  };

  const checkForWin = (row, col) => {
    return checkHorizontal(row) || checkVertical(col) || checkDiagonal();
  };

  const checkHorizontal = (row) => {
    const horizontal = gameBoard
      .getBoard()
      [row - 1].map((cell) => cell.getToken())
      .filter((value) => value === activePlayer.token);
    return horizontal.length === 3;
  };

  const checkVertical = (col) => {
    const vertical = gameBoard
      .getBoard()
      .map((row) => row[col - 1].getToken())
      .filter((value) => value === activePlayer.token);
    return vertical.length === 3;
  };

  const checkDiagonal = () => {
    const diagonal = gameBoard
      .getBoard()
      .map((row, index) => row[index].getToken())
      .filter((value) => value === activePlayer.token);
    const diagonalReverse = gameBoard
      .getBoard()
      .reverse()
      .map((row, index) => row[index].getToken())
      .filter((value) => value === activePlayer.token);

    return diagonal.length === 3 || diagonalReverse.length === 3;
  };

  // Initial print message on initialize.
  printNewRound();

  return {
    getActivePlayer,
    playRound,
  };
})(gameBoard);

// Global code ---------------------------------------
// Diagonal win
// gameController.playRound(2, 2);
// gameController.playRound(1, 2);
// gameController.playRound(1, 1);
// gameController.playRound(1, 3);
// gameController.playRound(3, 3);

// Diagonal Reverse win
gameController.playRound(2, 2);
gameController.playRound(1, 2);
gameController.playRound(1, 3);
gameController.playRound(2, 3);
gameController.playRound(3, 1);
