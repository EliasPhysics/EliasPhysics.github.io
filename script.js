// Maze Runner with Pixel‑Art Sprite
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;
const cols = canvas.width / tileSize;
const rows = canvas.height / tileSize;

// Maze data (unchanged)
const maze = [
  /* same 13×15 array as before */
];

// Player object
let player = { x:1, y:1 };

// Load sprite frames
const spriteFrames = [];
['assets/girl1.png', 'assets/girl2.png'].forEach(src => {
  const img = new Image();
  img.src = src;
  spriteFrames.push(img);
});
let frameIndex = 0;

// Animate sprite: flip frame on each move
function nextFrame() {
  frameIndex = (frameIndex + 1) % spriteFrames.length;
}

document.addEventListener('keydown', e => {
  let dx = 0, dy = 0;
  if (e.key === 'ArrowUp') dy = -1;
  if (e.key === 'ArrowDown') dy = 1;
  if (e.key === 'ArrowLeft') dx = -1;
  if (e.key === 'ArrowRight') dx = 1;
  const nx = player.x + dx;
  const ny = player.y + dy;
  // Check bounds and wall collision
  if (maze[ny] && maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    nextFrame();
  }
  draw();
});

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Draw walls
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = '#444';
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
  // Draw player sprite centered in tile
  const img = spriteFrames[frameIndex];
  const px = player.x * tileSize + (tileSize - 32) / 2;
  const py = player.y * tileSize + (tileSize - 32) / 2;
  if (img.complete) {
    ctx.drawImage(img, px, py, 32, 32);
  }
}

// Initial render
draw();