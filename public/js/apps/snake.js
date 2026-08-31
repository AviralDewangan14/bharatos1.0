// Snake Arcade Game
let snakeCanvas, snakeCtx;
let snake = [];
let food = { x: 5, y: 5 };
let dx = 1, dy = 0;
let snakeInterval = null;
let snakeScore = 0;
let snakeHighScore = 0;

function initSnake() {
  snakeCanvas = document.getElementById('snake-canvas');
  if (!snakeCanvas) return;
  snakeCtx = snakeCanvas.getContext('2d');
  snakeHighScore = parseInt(localStorage.getItem('bharatos_snake_best') || '0');
  updateSnakeScores();
  
  window.addEventListener('keydown', (e) => {
    const win = document.getElementById('win-snake');
    if (!win || win.style.display === 'none') return;
    
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; e.preventDefault(); }
    else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; e.preventDefault(); }
    else if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; e.preventDefault(); }
    else if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; e.preventDefault(); }
  });
}

function startSnakeGame() {
  if (snakeInterval) clearInterval(snakeInterval);
  snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
  dx = 1; dy = 0;
  snakeScore = 0;
  spawnFood();
  updateSnakeScores();
  
  snakeInterval = setInterval(updateSnake, 110);
}

function spawnFood() {
  food.x = Math.floor(Math.random() * 19);
  food.y = Math.floor(Math.random() * 16);
}

function updateSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
  // Wall collision
  if (head.x < 0 || head.x >= 19 || head.y < 0 || head.y >= 16) {
    endSnakeGame();
    return;
  }
  
  // Self collision
  for (let part of snake) {
    if (part.x === head.x && part.y === head.y) {
      endSnakeGame();
      return;
    }
  }
  
  snake.unshift(head);
  
  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10;
    if (snakeScore > snakeHighScore) {
      snakeHighScore = snakeScore;
      localStorage.setItem('bharatos_snake_best', snakeHighScore);
    }
    updateSnakeScores();
    spawnFood();
  } else {
    snake.pop();
  }
  
  drawSnake();
}

function drawSnake() {
  if (!snakeCtx || !snakeCanvas) return;
  snakeCtx.fillStyle = '#020617';
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  
  // Draw Food
  snakeCtx.fillStyle = '#ef4444';
  snakeCtx.beginPath();
  snakeCtx.arc(food.x * 20 + 10, food.y * 20 + 10, 7, 0, Math.PI * 2);
  snakeCtx.fill();
  
  // Draw Snake
  snakeCtx.fillStyle = '#10b981';
  snake.forEach((part, i) => {
    if (i === 0) snakeCtx.fillStyle = '#34d399';
    else snakeCtx.fillStyle = '#10b981';
    snakeCtx.fillRect(part.x * 20 + 2, part.y * 20 + 2, 16, 16);
  });
}

function endSnakeGame() {
  clearInterval(snakeInterval);
  snakeInterval = null;
  alert('Game Over! Your Score: ' + snakeScore);
}

function updateSnakeScores() {
  const scoreEl = document.getElementById('snake-score');
  const highEl = document.getElementById('snake-high');
  if (scoreEl) scoreEl.textContent = 'Score: ' + snakeScore;
  if (highEl) highEl.textContent = 'Best: ' + snakeHighScore;
}
