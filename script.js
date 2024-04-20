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
    board[row][col].addToken(playerToken);
  };

  return { getBoard, placeToken };
})();

// gameController factory IIFE
const gameController = (() => {
  const players = [
    {
      name: "Player One",
      token: "x",
    },
    {
      name: "Player Two",
      token: "o",
    },
  ];

  const board = gameBoard;

  let activePlayer = players[0];
  let gameOver = false;
  let turnCount = 0;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const incrementTurnCount = () => turnCount++;

  const isGameOver = () => gameOver;

  const playRound = (row, col) => {
    // console.log(`Placing an '${activePlayer.token}' on row ${row}, col ${col}.`);
    incrementTurnCount();
    board.placeToken(activePlayer.token, row, col);

    console.log(turnCount);
    // Check for tie
    if (checkForTie()) {
      console.log("Tie Game!");
      gameOver = true;
      return;
    }
    // Check for a win
    if (checkForWin(row, col)) {
      console.log(`${activePlayer.name} wins!`);
      gameOver = true;
      return;
    }

    switchActivePlayer();
  };

  const checkForTie = () => turnCount >= 9;

  const checkForWin = (row, col) => {
    return checkHorizontal(row) || checkVertical(col) || checkDiagonal();
  };

  const checkHorizontal = (row) => {
    const horizontal = board
      .getBoard()
      [row].map((cell) => cell.getToken())
      .filter((value) => value === activePlayer.token);
    return horizontal.length === 3;
  };

  const checkVertical = (col) => {
    const vertical = board
      .getBoard()
      .map((row) => row[col].getToken())
      .filter((value) => value === activePlayer.token);
    return vertical.length === 3;
  };

  const checkDiagonal = () => {
    const diagonal = board
      .getBoard()
      .map((row, index) => row[index].getToken())
      .filter((value) => value === activePlayer.token);
    const diagonalReverse = board
      .getBoard()
      .reverse()
      .map((row, index) => row[index].getToken())
      .filter((value) => value === activePlayer.token);

    // Reverse is destructive
    board.getBoard().reverse();

    return diagonal.length === 3 || diagonalReverse.length === 3;
  };

  return {
    getActivePlayer,
    playRound,
    isGameOver,
    checkForTie,
  };
})();

const screenController = (() => {
  const game = gameController;
  const board = gameBoard;
  const container = document.querySelector(".container");
  const activePlayer = document.querySelector(".turn");

  const updateActivePlayerText = () => {
    if (game.checkForTie()) {
      activePlayer.textContent = "Tie Game!";
      return;
    }
    if (!game.isGameOver())
      activePlayer.innerHTML = `It is currently <b>${game.getActivePlayer().name}</b>'s turn!`;
    else activePlayer.innerHTML = `<b>${game.getActivePlayer().name}</b> wins!`;
  };

  const updateTilesScreen = () => {
    container.textContent = "";
    const newGrid = document.createElement("div");
    newGrid.classList.add("grid");

    board.getBoard().forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const newTile = document.createElement("button");
        newTile.classList.add("tile");
        newTile.dataset.row = rowIndex;
        newTile.dataset.col = colIndex;

        newTile.textContent = cell.getToken();
        newGrid.appendChild(newTile);
      });
    });
    container.appendChild(newGrid);
  };

  updateActivePlayerText();
  updateTilesScreen();

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("tile")) {
      const activePlayer = game.getActivePlayer();
      game.playRound(e.target.dataset.row, e.target.dataset.col);
      e.target.textContent = activePlayer.token;
      // TODO: add a click class where it disables ability to click on a taken tile

      updateActivePlayerText();
    }
  });
})();
