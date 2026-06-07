// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddle = {
    width: 10,
    height: 80,
    speed: 6,
    x: 10,
    y: canvas.height / 2 - 40,
    dy: 0
};

const computerPaddle = {
    width: 10,
    height: 80,
    speed: 4.5,
    x: canvas.width - 20,
    y: canvas.height / 2 - 40
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 5,
    dy: 5,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
let mouseY = canvas.height / 2;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update paddle position
function updatePaddle() {
    // Arrow keys
    if (keys['ArrowUp'] && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (keys['ArrowDown'] && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }

    // Mouse control
    const targetY = mouseY - paddle.height / 2;
    const diff = targetY - paddle.y;
    if (Math.abs(diff) > 5) {
        paddle.y += diff * 0.1;
    }

    // Boundary check for player paddle
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

// Computer AI
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    const ballCenter = ball.y;

    // AI logic: move towards the ball with some difficulty scaling
    const difference = ballCenter - computerCenter;

    if (difference < -10) {
        computerPaddle.y = Math.max(0, computerPaddle.y - computerPaddle.speed);
    } else if (difference > 10) {
        computerPaddle.y = Math.min(
            canvas.height - computerPaddle.height,
            computerPaddle.y + computerPaddle.speed
        );
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Paddle collision detection
    if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = paddle.x + paddle.width + ball.radius;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        ball.dy += hitPos * 3;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
        ball.dy += hitPos * 3;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Update score display
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCenterLine() {
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles
    drawPaddle(paddle.x, paddle.y, paddle.width, paddle.height, '#00ff88');
    drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, '#ff0088');

    // Draw ball
    drawBall(ball.x, ball.y, ball.radius, '#ffff00');
}

// Game loop
function gameLoop() {
    updatePaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
