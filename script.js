const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');
const snakeeat = document.getElementById('foodeat');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'left';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function move() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        snakeeat.play();
    } else {
        snake.pop();
    }
}

function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function handleKeyPress(event) {
    if (!gameStarted && (event.code === 'Space' || event.code === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    }
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }

    // Restart interval with new speed
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();

    // Reset all variables
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'left';
    gameSpeedDelay = 200;

    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

document.addEventListener('keydown', handleKeyPress);

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }

    highScoreText.style.display = 'block';
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}
