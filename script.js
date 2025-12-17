const player = document.getElementById("player");
const sushi = document.getElementById("sushi");
const obstacle2 = document.getElementById("obstacle2");
const scoreEl = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
let obstacleInterval = null;
let collisionInterval = null;
let isJumping = false;
let currentObstacle = sushi;
let score = 0;
let scoredThisObstacle = false;

/* START / RESTART */
startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  gameRunning = true;
  isJumping = false;
  score = 0;
  scoreEl.textContent = "Score: 0";

  resetObstacles();

  clearInterval(obstacleInterval);
  clearInterval(collisionInterval);

  moveObstacle();
  collisionInterval = setInterval(checkCollision, 20);
}

/* SALTO */
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping && gameRunning) {
    jump();
  }
});

function jump() {
  isJumping = true;
  player.classList.add("jump");

  setTimeout(() => {
    player.classList.remove("jump");
    isJumping = false;
  }, 600);
}

/* RESET */
function resetObstacles() {
  sushi.style.display = "none";
  obstacle2.style.display = "none";
  sushi.style.right = "-120px";
  obstacle2.style.right = "-120px";
}

/* MOVIMIENTO + SCORE */
function moveObstacle() {
  let position = -120;
  scoredThisObstacle = false;

  currentObstacle = Math.random() < 0.5 ? sushi : obstacle2;

  resetObstacles();
  currentObstacle.style.display = "block";

  obstacleInterval = setInterval(() => {
    if (!gameRunning) return;

    position += 6;
    currentObstacle.style.right = position + "px";

    // 👉 SCORE cuando lo PASAS
    const obstacleRect = currentObstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (!scoredThisObstacle && obstacleRect.right < playerRect.left) {
      score++;
      scoreEl.textContent = "Score: " + score;
      scoredThisObstacle = true;
    }

    if (position > 920) {
      clearInterval(obstacleInterval);
      moveObstacle();
    }
  }, 20);
}

/* COLISIÓN REAL */
function checkCollision() {
  const p = player.getBoundingClientRect();
  const o = currentObstacle.getBoundingClientRect();

  const horizontalHit = p.right > o.left + 15 && p.left < o.right - 15;

  const verticalHit = p.bottom > o.top + 15 && p.top < o.bottom;

  if (horizontalHit && verticalHit && !isJumping) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(obstacleInterval);
  clearInterval(collisionInterval);
  gameOverScreen.classList.remove("hidden");
}
