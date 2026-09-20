const games = [
  {
    id: "snake",
    title: "Snake Arena",
    description: "Eat the food and grow as long as possible.",
    category: "arcade",
    emoji: "🐍",
    background: "snake-bg"
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Find all matching pairs of symbols.",
    category: "puzzle",
    emoji: "🧠",
    background: "memory-bg"
  },
  {
    id: "reaction",
    title: "Reaction Rush",
    description: "Test how quickly you can react.",
    category: "arcade",
    emoji: "⚡",
    background: "reaction-bg"
  },
  {
    id: "tictactoe",
    title: "Tic-Tac-Toe",
    description: "Beat the computer in this classic game.",
    category: "casual",
    emoji: "⭕",
    background: "tictactoe-bg"
  },
  {
    id: "number",
    title: "Number Guess",
    description: "Guess the secret number from 1 to 100.",
    category: "puzzle",
    emoji: "🔢",
    background: "number-bg"
  },
  {
    id: "coin",
    title: "Coin Catcher",
    description: "Flip the coin and test your luck.",
    category: "casual",
    emoji: "🪙",
    background: "coin-bg"
  }
];

const gameGrid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const gameCount = document.getElementById("gameCount");
const modal = document.getElementById("gameModal");
const gameArea = document.getElementById("gameArea");
const modalTitle = document.getElementById("modalTitle");
const playerGameIcon = document.getElementById("playerGameIcon");
const gameStatus = document.getElementById("gameStatus");

let currentGameId = null;

function renderGames() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filteredGames = games.filter(game => {
    const matchesSearch =
      game.title.toLowerCase().includes(search) ||
      game.description.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || game.category === category;

    return matchesSearch && matchesCategory;
  });

  gameCount.textContent = filteredGames.length;

  gameGrid.innerHTML = filteredGames.map(game => `
    <article class="game-card">
      <div class="card-image ${game.background}">
        ${game.emoji}
      </div>

      <div class="card-content">
        <h3>${game.title}</h3>
        <p>${game.description}</p>

        <div class="card-bottom">
          <span class="category">${game.category.toUpperCase()}</span>
          <button class="play-button" onclick="openGame('${game.id}')">
            PLAY
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function openGame(gameId) {
  const game = games.find(item => item.id === gameId);

  currentGameId = gameId;
  modalTitle.textContent = game.title.toUpperCase();
  playerGameIcon.textContent = game.emoji;
  gameStatus.textContent = "LOADING...";
  gameArea.innerHTML = `<div class="loading-text">LOADING...</div>`;

  modal.classList.remove("hidden");

  setTimeout(() => {
    gameStatus.textContent = "PLAYING";
    startSelectedGame(gameId);
  }, 350);
}

function startSelectedGame(gameId) {
  if (gameId === "snake") createSnake();
  if (gameId === "memory") createMemory();
  if (gameId === "reaction") createReaction();
  if (gameId === "tictactoe") createTicTacToe();
  if (gameId === "number") createNumberGuess();
  if (gameId === "coin") createCoinFlip();
}

function closeGame() {
  modal.classList.add("hidden");
  gameArea.innerHTML = "";
  document.onkeydown = null;
  currentGameId = null;
  gameStatus.textContent = "READY";
}

function restartCurrentGame() {
  if (currentGameId) {
    openGame(currentGameId);
  }
}

function toggleFullscreen() {
  const player = document.querySelector(".game-player");

  if (!document.fullscreenElement) {
    player.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

document.getElementById("closeModal").addEventListener("click", closeGame);
document.getElementById("exitGame").addEventListener("click", closeGame);
document.getElementById("restartButton").addEventListener("click", restartCurrentGame);

document.getElementById("fullscreenButton").addEventListener(
  "click",
  toggleFullscreen
);

searchInput.addEventListener("input", renderGames);
categoryFilter.addEventListener("change", renderGames);

function createSnake() {
  gameArea.innerHTML = `
    <div class="play-board">
      <canvas id="snakeCanvas" width="300" height="300"></canvas>
      <p>Use the arrow keys to move.</p>
      <button id="snakeStart">START GAME</button>
      <strong id="snakeScore">Score: 0</strong>
    </div>
  `;

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");

  let snake = [];
  let food = {};
  let direction = { x: 20, y: 0 };
  let score = 0;
  let loop;

  document.getElementById("snakeStart").addEventListener("click", () => {
    snake = [{ x: 140, y: 140 }];
    food = {
      x: Math.floor(Math.random() * 15) * 20,
      y: Math.floor(Math.random() * 15) * 20
    };
    direction = { x: 20, y: 0 };
    score = 0;

    clearInterval(loop);
    loop = setInterval(updateSnake, 120);
  });

  document.onkeydown = event => {
    if (event.key === "ArrowUp" && direction.y === 0) {
      direction = { x: 0, y: -20 };
    }

    if (event.key === "ArrowDown" && direction.y === 0) {
      direction = { x: 0, y: 20 };
    }

    if (event.key === "ArrowLeft" && direction.x === 0) {
      direction = { x: -20, y: 0 };
    }

    if (event.key === "ArrowRight" && direction.x === 0) {
      direction = { x: 20, y: 0 };
    }
  };

  function updateSnake() {
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    const hitWall =
      head.x < 0 ||
      head.x >= 300 ||
      head.y < 0 ||
      head.y >= 300;

    const hitSelf = snake.some(part =>
      part.x === head.x && part.y === head.y
    );

    if (hitWall || hitSelf) {
      clearInterval(loop);
      gameStatus.textContent = "GAME OVER";
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("snakeScore").textContent = `Score: ${score}`;

      food = {
        x: Math.floor(Math.random() * 15) * 20,
        y: Math.floor(Math.random() * 15) * 20
      };
    } else {
      snake.pop();
    }

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, 300, 300);

    ctx.fillStyle = "#ffca3a";
    ctx.fillRect(food.x, food.y, 18, 18);

    ctx.fillStyle = "#43d17a";
    snake.forEach(part => {
      ctx.fillRect(part.x, part.y, 18, 18);
    });
  }
}

function createMemory() {
  const symbols = ["🍕", "🍕", "🚀", "🚀", "🐸", "🐸", "⭐", "⭐"];
  symbols.sort(() => Math.random() - 0.5);

  gameArea.innerHTML = `
    <div class="play-board">
      <div id="memoryGrid" class="memory-grid"></div>
      <p id="memoryStatus">Find all matching pairs.</p>
    </div>
  `;

  const grid = document.getElementById("memoryGrid");
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let matches = 0;

  symbols.forEach(symbol => {
    const card = document.createElement("button");

    card.className = "memory-card";
    card.textContent = "?";
    card.dataset.symbol = symbol;

    card.addEventListener("click", () => {
      if (locked || card.classList.contains("revealed")) return;

      card.textContent = symbol;
      card.classList.add("revealed");

      if (!firstCard) {
        firstCard = card;
        return;
      }

      secondCard = card;
      locked = true;

      if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        matches++;
        firstCard = null;
        secondCard = null;
        locked = false;

        if (matches === 4) {
          document.getElementById("memoryStatus").textContent =
            "You found every pair!";
          gameStatus.textContent = "COMPLETE";
        }
      } else {
        setTimeout(() => {
          firstCard.textContent = "?";
          secondCard.textContent = "?";
          firstCard.classList.remove("revealed");
          secondCard.classList.remove("revealed");
          firstCard = null;
          secondCard = null;
          locked = false;
        }, 700);
      }
    });

    grid.appendChild(card);
  });
}

function createReaction() {
  gameArea.innerHTML = `
    <div class="play-board">
      <p id="reactionStatus">Wait for green, then click.</p>
      <div id="reactionBox">WAIT</div>
    </div>
  `;

  const box = document.getElementById("reactionBox");
  const status = document.getElementById("reactionStatus");

  let canClick = false;
  let startTime;

  setTimeout(() => {
    box.classList.add("ready");
    box.textContent = "CLICK!";
    canClick = true;
    startTime = Date.now();
  }, Math.random() * 3000 + 1500);

  box.addEventListener("click", () => {
    if (!canClick) {
      status.textContent = "Too early! Press restart and try again.";
      return;
    }

    const time = Date.now() - startTime;

    status.textContent = `Your reaction time was ${time} ms.`;
    box.textContent = "NICE!";
    canClick = false;
    gameStatus.textContent = "COMPLETE";
  });
}

function createTicTacToe() {
  gameArea.innerHTML = `
    <div class="play-board">
      <div id="ticBoard" class="memory-grid"></div>
      <p id="ticStatus">Your turn: X</p>
    </div>
  `;

  const board = Array(9).fill("");
  const ticBoard = document.getElementById("ticBoard");
  const status = document.getElementById("ticStatus");

  board.forEach((_, index) => {
    const button = document.createElement("button");

    button.className = "memory-card";
    button.addEventListener("click", () => playerMove(index, button));

    ticBoard.appendChild(button);
  });

  function playerMove(index, button) {
    if (board[index] || checkWinner(board)) return;

    board[index] = "X";
    button.textContent = "X";

    if (checkWinner(board)) {
      status.textContent = "You win!";
      gameStatus.textContent = "WINNER";
      return;
    }

    const openSpaces = board
      .map((value, i) => value ? null : i)
      .filter(value => value !== null);

    if (openSpaces.length === 0) {
      status.textContent = "Draw!";
      return;
    }

    const computerIndex =
      openSpaces[Math.floor(Math.random() * openSpaces.length)];

    board[computerIndex] = "O";
    ticBoard.children[computerIndex].textContent = "O";

    if (checkWinner(board)) {
      status.textContent = "The computer wins.";
      gameStatus.textContent = "GAME OVER";
    }
  }

  function checkWinner(currentBoard) {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return wins.some(combo =>
      combo.every(index =>
        currentBoard[index] &&
        currentBoard[index] === currentBoard[combo[0]]
      )
    );
  }
}

function createNumberGuess() {
  const secret = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  gameArea.innerHTML = `
    <div class="play-board">
      <p>Guess a number from 1 to 100.</p>
      <input id="guessInput" type="number" min="1" max="100">
      <button id="guessButton">GUESS</button>
      <p id="guessStatus">Good luck!</p>
    </div>
  `;

  document.getElementById("guessButton").addEventListener("click", () => {
    const guess = Number(document.getElementById("guessInput").value);
    const status = document.getElementById("guessStatus");

    if (!guess) {
      status.textContent = "Enter a number first.";
      return;
    }

    attempts++;

    if (guess === secret) {
      status.textContent = `Correct! You won in ${attempts} attempts.`;
      gameStatus.textContent = "WINNER";
    } else if (guess < secret) {
      status.textContent = "Too low.";
    } else {
      status.textContent = "Too high.";
    }
  });
}

function createCoinFlip() {
  gameArea.innerHTML = `
    <div class="play-board">
      <div id="coinResult" style="font-size: 80px;">🪙</div>
      <p id="flipStatus">Choose heads or tails.</p>
      <button id="headsButton">HEADS</button>
      <button id="tailsButton">TAILS</button>
    </div>
  `;

  document.getElementById("headsButton").onclick = () => flipCoin("heads");
  document.getElementById("tailsButton").onclick = () => flipCoin("tails");

  function flipCoin(choice) {
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const coin = document.getElementById("coinResult");
    const status = document.getElementById("flipStatus");

    coin.textContent = result === "heads" ? "🙂" : "🪙";

    if (choice === result) {
      status.textContent = `It was ${result}. You guessed correctly!`;
      gameStatus.textContent = "WINNER";
    } else {
      status.textContent = `It was ${result}. Try again.`;
      gameStatus.textContent = "TRY AGAIN";
    }
  }
}

renderGames();
