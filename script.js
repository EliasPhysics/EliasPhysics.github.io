// Maze Runner with Pixel-Art Sprite
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;
const cols = Math.floor(canvas.width / tileSize);
const rows = Math.floor(canvas.height / tileSize);

// Maze data (1 = wall, 0 = path)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,1,1],
    [1,0,1,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Player object
const player = {
    x: 1,
    y: 1,
    spriteSize: 32 // Adjusted to better fit tileSize
};

// Sprite management
const spriteFrames = [];
let loadedImages = 0;
const spritePaths = ['assets/girl1.png', 'assets/girl2.png'];
let frameIndex = 0;

// Load sprite frames with error handling
spritePaths.forEach((src, index) => {
    const img = new Image();
    img.onload = () => {
        loadedImages++;
        if (loadedImages === spritePaths.length) {
            draw(); // Initial draw when all images are loaded
        }
    };
    img.onerror = () => {
        console.error(`Failed to load sprite: ${src}`);
        // Create a placeholder if image fails to load
        spriteFrames[index] = createPlaceholderSprite();
        loadedImages++;
    };
    img.src = src;
    spriteFrames.push(img);
});

function createPlaceholderSprite() {
    const placeholder = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = player.spriteSize;
    canvas.height = player.spriteSize;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, player.spriteSize, player.spriteSize);
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.fillText('P', player.spriteSize/2 - 3, player.spriteSize/2 + 3);
    placeholder.src = canvas.toDataURL();
    return placeholder;
}

// Animation control
let lastFrameTime = 0;
const frameDelay = 200; // milliseconds between frames

function nextFrame(timestamp) {
    if (timestamp - lastFrameTime > frameDelay) {
        frameIndex = (frameIndex + 1) % spriteFrames.length;
        lastFrameTime = timestamp;
    }
}

// Movement handling
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        tryMove();
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

function tryMove() {
    let dx = 0, dy = 0;
    if (keys.ArrowUp) dy = -1;
    if (keys.ArrowDown) dy = 1;
    if (keys.ArrowLeft) dx = -1;
    if (keys.ArrowRight) dx = 1;

    // Only move if one direction is pressed (no diagonal)
    if ((dx !== 0 && dy !== 0) || (dx === 0 && dy === 0)) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    // Check bounds and wall collision
    if (ny >= 0 && ny < maze.length && nx >= 0 && nx < maze[ny].length && maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
        requestAnimationFrame(nextFrame);
        draw();
    }
}

// Rendering
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls and paths
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? '#444' : '#eee';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

            // Add grid lines
            ctx.strokeStyle = '#999';
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // Draw player sprite centered in tile
    const img = spriteFrames[frameIndex];
    const px = player.x * tileSize + (tileSize - player.spriteSize) / 2;
    const py = player.y * tileSize + (tileSize - player.spriteSize) / 2;

    if (img.complete) {
        ctx.drawImage(img, px, py, player.spriteSize, player.spriteSize);
    }
}

// Game loop for smoother animation
function gameLoop(timestamp) {
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
requestAnimationFrame(gameLoop);