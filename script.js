// Simple Maze Game Demo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;
const cols = canvas.width / tileSize;
const rows = canvas.height / tileSize;

// 0 = path, 1 = wall
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
  [1,1,1,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let player = { x:1, y:1 };

document.addEventListener('keydown', e => {
  let dx = 0, dy = 0;
  if (e.key === 'ArrowUp') dy = -1;
  if (e.key === 'ArrowDown') dy = 1;
  if (e.key === 'ArrowLeft') dx = -1;
  if (e.key === 'ArrowRight') dx = 1;
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (maze[ny] && maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
  }
  draw();
});

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Draw maze
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = '#444';
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
  // Draw player
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x*tileSize+5, player.y*tileSize+5, tileSize-10, tileSize-10);
}

// Initial render
draw();
