// Classic Snake Game for BharatOS
let snakeCanvas = null;
let snakeCtx = null;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 1;
let dy = 0;
let snakeScore = 0;
let snakeHighscore = 0;
let gameInterval = null;
const gridSize = 20;

function initSnake() {
  snakeCanvas = document.getElementById('snake-canvas');
  if (!snakeCanvas) return;
  snakeCtx = snakeCanvas.getContext('2d');
  
  window.addEventListener('keydown', (e) => {
    const win = document.getElementById('win-snake');
    if (!win || win.style.display === 'none') return;
    
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    else if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    else if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
  });
}

function startSnakeGame() {
  clearInterval(gameInterval);
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dx = 1;
  dy = 0;
  snakeScore = 0;
  document.getElementById('snake-score').textContent = 'Score: 0';
  spawnFood();
  gameInterval = setInterval(updateSnake, 100);
}

function spawnFood() {
  food.x = Math.floor(Math.random() * (snakeCanvas.width / gridSize));
  food.y = Math.floor(Math.random() * (snakeCanvas.height / gridSize));
}

function updateSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
  if (head.x < 0 || head.x >= snakeCanvas.width / gridSize || head.y < 0 || head.y >= snakeCanvas.height / gridSize) {
    gameOver();
    return;
  }
  
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }
  
  snake.unshift(head);
  
  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10;
    document.getElementById('snake-score').textContent = `Score: ${snakeScore}`;
    if (snakeScore > snakeHighscore) {
      snakeHighscore = snakeScore;
      document.getElementById('snake-high').textContent = `Best: ${snakeHighscore}`;
    }
    spawnFood();
  } else {
    snake.pop();
  }
  
  drawSnake();
}

function drawSnake() {
  snakeCtx.fillStyle = '#020617';
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  
  snakeCtx.fillStyle = '#ef4444';
  snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  
  snake.forEach((seg, i) => {
    if (i === 0) snakeCtx.fillStyle = '#38bdf8';
    else snakeCtx.fillStyle = '#06b6d4';
    snakeCtx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your Score: ${snakeScore}`);
}
