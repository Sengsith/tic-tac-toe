// Cell factory
const Cell = () => {
  let value = "";
  let winningTile = false;

  const addToken = (player) => {
    value = player;
  };

  const getToken = () => value;

  const setWinningTile = () => (winningTile = true);

  const getWinningTile = () => winningTile;
  return { addToken, getToken, setWinningTile, getWinningTile };
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

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Cell());
      }
    }
  };

  return { getBoard, placeToken, resetBoard };
})();

// gameController factory IIFE
const gameController = (() => {
  const players = [
    {
      name: "Player One",
      token: "x",
      wins: 0,
    },
    {
      name: "Player Two",
      token: "o",
      wins: 0,
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

  const setPlayerNames = (nameOne, nameTwo) => {
    players[0].name = nameOne;
    players[1].name = nameTwo;
  };

  const getPlayerWins = () => {
    return { playerOne: players[0].wins, playerTwo: players[1].wins };
  };

  const incrementPlayerWins = () => getActivePlayer().wins++;

  const getPlayerNames = () => {
    return { playerOne: players[0].name, playerTwo: players[1].name };
  };

  const incrementTurnCount = () => turnCount++;

  const isGameOver = () => gameOver;

  const playRound = (row, col) => {
    // console.log(`Placing an '${activePlayer.token}' on row ${row}, col ${col}.`);
    incrementTurnCount();
    board.placeToken(activePlayer.token, row, col);

    // Check for tie
    if (checkForTie()) {
      gameOver = true;
      return;
    }
    // Check for a win
    if (checkForWin(row, col)) {
      gameOver = true;
      incrementPlayerWins();
      return;
    }

    switchActivePlayer();
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
    turnCount = 0;
    gameOver = false;
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

    // Set the winning tiles to change color later
    if (horizontal.length === 3) {
      // Set winning tile to true
      board.getBoard()[row].forEach((cell) => cell.setWinningTile());
    }
    return horizontal.length === 3;
  };

  const checkVertical = (col) => {
    const vertical = board
      .getBoard()
      .map((row) => row[col].getToken())
      .filter((value) => value === activePlayer.token);

    // Set the winning tiles to change color later
    if (vertical.length === 3) {
      // Set winning tile to true
      board.getBoard().forEach((row) => row[col].setWinningTile());
    }
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

    // Set the winning tiles to change color later
    if (diagonalReverse.length === 3) {
      board.getBoard().forEach((row, index) => row[index].setWinningTile());
    }

    // Reverse is destructive, reverse it back to normal
    board.getBoard().reverse();

    // Set the winning tiles to change color later
    if (diagonal.length === 3) {
      // Set winning tile to true
      board.getBoard().forEach((row, index) => row[index].setWinningTile());
    }

    return diagonal.length === 3 || diagonalReverse.length === 3;
  };

  return {
    getActivePlayer,
    playRound,
    isGameOver,
    checkForTie,
    resetGame,
    setPlayerNames,
    getPlayerWins,
    getPlayerNames,
  };
})();

const screenController = (() => {
  const game = gameController;
  const board = gameBoard;
  const container = document.querySelector(".container");
  const activePlayerText = document.querySelector(".turn");
  const resetBtn = document.querySelector(".reset");
  const modal = document.querySelector("[data-modal]");
  const modalPlayBtn = document.querySelector(".play");
  const playerOneWinsText = document.querySelector(".player-one-wins");
  const playerTwoWinsText = document.querySelector(".player-two-wins");

  const askPlayerNames = () => {
    modal.showModal();
  };
  modalPlayBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Get data from input
    // Set input to players
    const playerOne = document.querySelector("#player-one").value;
    const playerTwo = document.querySelector("#player-two").value;

    game.setPlayerNames(playerOne, playerTwo);
    updateActivePlayerText();
    updatePlayerWinsText();

    modal.close();
  });

  const updateActivePlayerText = () => {
    if (game.checkForTie()) {
      activePlayerText.textContent = "Tie Game!";
      return;
    }
    if (!game.isGameOver())
      activePlayerText.innerHTML = `It is currently <b>${game.getActivePlayer().name}</b>'s turn!`;
    else {
      activePlayerText.innerHTML = `<b>${game.getActivePlayer().name}</b> wins!`;
      updateGameOverTiles();
    }
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

        newGrid.appendChild(newTile);
      });
    });
    container.appendChild(newGrid);
  };

  // Renders all buttons unclickable
  const updateGameOverTiles = () => {
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach((tile) => {
      if (!tile.classList.contains("active")) {
        tile.classList.add("active");
      }
    });

    // Create one array that tells us which indexes are true or false, set the true ones to a new bg color
    const winningTiles = board
      .getBoard()
      .flatMap((row) => row.map((cell) => cell.getWinningTile()));

    for (let i = 0; i < tiles.length; i++) {
      if (winningTiles[i]) {
        tiles[i].classList.add("win");
      }
    }
  };

  const updatePlayerWinsText = () => {
    const playerNames = game.getPlayerNames();
    const playerWins = game.getPlayerWins();
    playerOneWinsText.textContent = `${playerNames.playerOne}: ${playerWins.playerOne} wins`;
    playerTwoWinsText.textContent = `${playerNames.playerTwo}: ${playerWins.playerTwo} wins`;
  };

  askPlayerNames();
  updateActivePlayerText();
  updateTilesScreen();
  updatePlayerWinsText();

  // Tile click event
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("tile")) {
      const activePlayer = game.getActivePlayer();
      game.playRound(e.target.dataset.row, e.target.dataset.col);
      e.target.textContent = activePlayer.token;
      e.target.classList.add("active");

      updateActivePlayerText();
    }
  });

  // Reset game click event
  resetBtn.addEventListener("click", () => {
    game.resetGame();
    askPlayerNames();
    updateActivePlayerText();
    updateTilesScreen();
  });
})();
