let currentGameId = null;

function openGame(gameId) {
  const game = games.find(item => item.id === gameId);

  currentGameId = gameId;

  document.getElementById("modalTitle").textContent =
    game.title.toUpperCase();

  document.getElementById("playerGameIcon").textContent = game.emoji;

  document.getElementById("gameStatus").textContent = "LOADING...";

  modal.classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("gameStatus").textContent = "PLAYING";
  }, 400);

  if (gameId === "snake") createSnake();
  if (gameId === "memory") createMemory();
  if (gameId === "reaction") createReaction();
  if (gameId === "tictactoe") createTicTacToe();
  if (gameId === "number") createNumberGuess();
  if (gameId === "coin") createCoinFlip();
}
  {
    id: "number",
    title: "Number Guess",
    description: "Guess the secret number in fewer attempts.",
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
const modalTitle = document.getElementById("modalTitle");
const gameArea = document.getElementById("gameArea");

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
        <span>${game.emoji}</span>
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

  modalTitle.textContent = game.title;
  modal.classList.remove("hidden");

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
}

document.getElementById("closeModal").addEventListener("click", closeGame);

modal.addEventListener("click", event => {
  if (event.target === modal) closeGame();
});

searchInput.addEventListener("input", renderGames);
categoryFilter.addEventListener("change", renderGames);

function createSnake() {
  gameArea.innerHTML = `
    <div class="play-board">
      <canvas id="snakeCanvas" width="300" height="300"></canvas>
      <p>Use the arrow keys to move.</p>
      <button onclick="startSnake()">START GAME</button>
      <strong id="snakeScore">Score: 0</strong>
    </div>
  `;

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");

  let snake;
  let food;
  let direction;
  let score;
  let gameLoop;

  window.startSnake = function() {
    snake = [{ x: 140, y: 140 }];
    food = { x: 80, y: 80 };
    direction = { x: 20, y: 0 };
    score = 0;

    clearInterval(gameLoop);
    gameLoop = setInterval(updateSnake, 120);
  };

  document.onkeydown = event => {
    const key = event.key;

    if (key === "ArrowUp" && direction.y === 0) {
      direction = { x: 0, y: -20 };
    }

    if (key === "ArrowDown" && direction.y === 0) {
      direction = { x: 0, y: 20 };
    }

    if (key === "ArrowLeft" && direction.x === 0) {
      direction = { x: -20, y: 0 };
    }

    if (key === "ArrowRight" && direction.x === 0) {
      direction = { x: 20, y: 0 };
    }
  };

  function updateSnake() {
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    if (
      head.x < 0 ||
      head.x >= canvas.width ||
      head.y < 0 ||
      head.y >= canvas.height ||
      snake.some(part => part.x === head.x && part.y === head.y)
    ) {
      clearInterval(gameLoop);
      alert(`Game over! Score: ${score}`);
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
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffca3a";
    ctx.fillRect(food.x, food.y, 18, 18);

    ctx.fillStyle = "#43d17a";
    snake.forEach(part => ctx.fillRect(part.x, part.y, 18, 18));
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
    const button = document.createElement("button");
    button.className = "memory-card";
    button.textContent = "?";
    button.dataset.symbol = symbol;

    button.addEventListener("click", () => {
      if (locked || button.classList.contains("revealed")) return;

      button.textContent = symbol;
      button.classList.add("revealed");

      if (!firstCard) {
        firstCard = button;
        return;
      }

      secondCard = button;
      locked = true;

      if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        matches++;
        firstCard = null;
        secondCard = null;
        locked = false;

        if (matches === 4) {
          document.getElementById("memoryStatus").textContent =
            "You found every pair!";
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

    grid.appendChild(button);
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
  let startTime;
  let canClick = false;

  const delay = Math.floor(Math.random() * 3000) + 1500;

  setTimeout(() => {
    box.classList.add("ready");
    box.textContent = "CLICK!";
    canClick = true;
    startTime = Date.now();
  }, delay);

  box.addEventListener("click", () => {
    if (!canClick) {
      status.textContent = "Too early! Refresh the game to try again.";
      return;
    }

    const reactionTime = Date.now() - startTime;
    status.textContent = `Your reaction time was ${reactionTime} ms.`;
    box.textContent = "NICE!";
    canClick = false;
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
      return;
    }

    if (board.every(Boolean)) {
      status.textContent = "Draw!";
      return;
    }

    const available = board
      .map((value, i) => value ? null : i)
      .filter(value => value !== null);

    const computerIndex =
      available[Math.floor(Math.random() * available.length)];

    board[computerIndex] = "O";
    ticBoard.children[computerIndex].textContent = "O";

    if (checkWinner(board)) {
      status.textContent = "The computer wins.";
    }
  }

  function checkWinner(currentBoard) {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
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
      <input id="guessInput" type="number" min="1" max="100" />
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
      <button id="flipButton">FLIP COIN</button>
      <p id="flipStatus">Choose heads or tails.</p>
      <button onclick="guessCoin('heads')">HEADS</button>
      <button onclick="guessCoin('tails')">TAILS</button>
    </div>
  `;

  window.guessCoin = function(choice) {
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const status = document.getElementById("flipStatus");
    const coin = document.getElementById("coinResult");

    coin.textContent = result === "heads" ? "🙂" : "🪙";

    if (choice === result) {
      status.textContent = `It was ${result}. You guessed correctly!`;
    } else {
      status.textContent = `It was ${result}. Better luck next time.`;
    }
  };
}

renderGames();
function closeGame() {
  modal.classList.add("hidden");
  gameArea.innerHTML = "";
  document.onkeydown = null;
  currentGameId = null;
}

document.getElementById("closeModal").addEventListener("click", closeGame);
document.getElementById("exitGame").addEventListener("click", closeGame);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeGame();
  }
});

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
