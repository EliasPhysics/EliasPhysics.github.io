// This function will run once the window is fully loaded.
window.onload = function() {

    // --- PART 1: DYNAMICALLY CREATE THE PAGE STRUCTURE ---

    // Inject all the necessary CSS styles into the document's head
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Basic page reset */
            body, html {
                margin: 0;
                padding: 0;
                background: #222;
                display: flex;
                flex-direction: column; /* Allow text above canvas */
                justify-content: center;
                align-items: center;
                height: 100vh;
                color: #fff;
                font-family: 'Consolas', 'Courier New', monospace;
            }
            h1 {
                margin-bottom: 20px;
            }
            canvas {
                border: 2px solid #fff;
                background: #1e293b; /* A dark blue sky color */
            }
        `;
        document.head.appendChild(style);
    }

    // Create the HTML elements (h1, canvas) and add them to the body
    function createDOM() {
        // Create the main title
        const h1 = document.createElement('h1');
        h1.textContent = 'лера лера';
        document.body.appendChild(h1);

        // Create the game canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 600;
        document.body.appendChild(canvas);
    }

    // Run the setup functions
    injectStyles();
    createDOM();


    // --- PART 2: THE ORIGINAL GAME CODE (UNCHANGED) ---
    // This code is exactly as you provided it. It will now run *after* the
    // canvas with id 'gameCanvas' has been created and added to the page.

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 40;

    const GRAVITY = 0.5;
    const PLAYER_SPEED = 5;
    const JUMP_FORCE = 12;

    let gameState = 'intro';

    const level1Data = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ];
    const level2Data = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ];
    const levels = [
        { map: level1Data, enemies: [ { x: 400, y: 300 }, { x: 900, y: 200 }, { x: 1200, y: 300 } ], collectibles: [ { x: 200, y: 200 }, { x: 650, y: 360 }, { x: 1100, y: 120 } ] },
        { map: level2Data, enemies: [ { x: 300, y: 400 }, { x: 700, y: 100 }, { x: 1000, y: 400 }, { x: 1400, y: 200 } ], collectibles: [ { x: 300, y: 160 }, { x: 500, y: 120 }, { x: 900, y: 280 }, { x: 1300, y: 360 } ] }
    ];
    let currentLevelIndex = 0;
    let currentMap;
    let worldWidth;
    let gameWon = false;
    const player = { x: 100, y: 100, width: 42, height: 64, dx: 0, dy: 0, isOnGround: false, direction: 'right', health: 100, isAttacking: false, attackBox: { width: 40, height: 40 } };
    let enemies = [];
    function createEnemy(x, y) { enemies.push({ x, y, width: 64, height: 64, dx: 1, dy: 0, health: 50, patrolRange: 220, patrolStart: x }); }
    let levelCollectibles = [];
    let totalCollectiblesInLevel = 0;
    const collectibleSize = { width: 42, height: 42 };
    const camera = { x: 0, y: 0, width: canvas.width, height: canvas.height,
        update: function() {
            this.x = player.x - this.width / 2;
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > worldWidth) this.x = worldWidth - this.width;
        }
    };
    const spritePaths = ['assets/girl1.png', 'assets/girl2.png', 'assets/hase.png', 'assets/beaurocrat.png', 'assets/passport.png'];
    const playerWalkSprites = [];
    let collectibleSprite;
    let enemySprite;
    let passportSprite;
    let loadedImages = 0;
    let frameIndex = 0, frameCounter = 0;
    spritePaths.forEach((src) => {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            if (src.includes('girl')) playerWalkSprites.push(img);
            else if (src.includes('hase')) collectibleSprite = img;
            else if (src.includes('beaurocrat')) enemySprite = img;
            else if (src.includes('passport')) passportSprite = img;
            if (loadedImages === spritePaths.length) {
                loadLevel(0);
                requestAnimationFrame(gameLoop);
            }
        };
        img.onerror = () => console.error(`Failed to load sprite: ${src}`);
        img.src = src;
    });
    const keys = { ArrowUp: false, ArrowLeft: false, ArrowRight: false, ' ': false, 'x': false, 'X': false };
    document.addEventListener('keydown', e => { if (keys.hasOwnProperty(e.key)) { e.preventDefault(); keys[e.key] = true; } });
    document.addEventListener('keyup', e => { if (keys.hasOwnProperty(e.key)) { e.preventDefault(); keys[e.key] = false; } });
    function getSafeCollectiblePosition(x, y) {
        let currentY = y;
        let checkX = x + collectibleSize.width / 2;
        let gridX = Math.floor(checkX / tileSize);
        let gridY = Math.floor((currentY + collectibleSize.height) / tileSize);
        while (gridY >= 0 && gridY < currentMap.length && currentMap[gridY][gridX] > 0) {
            currentY -= tileSize;
            gridY = Math.floor((currentY + collectibleSize.height) / tileSize);
        }
        while (gridY + 1 < currentMap.length && currentMap[gridY + 1][gridX] === 0) {
            currentY += tileSize;
            gridY = Math.floor((currentY + collectibleSize.height) / tileSize);
        }
        const finalY = (gridY + 1) * tileSize - collectibleSize.height;
        return { x: x, y: finalY };
    }
    function loadLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            gameWon = true;
            return;
        }
        currentLevelIndex = levelIndex;
        currentMap = levels[currentLevelIndex].map;
        worldWidth = currentMap[0].length * tileSize;
        player.x = 100;
        player.y = 100;
        player.dx = 0;
        player.dy = 0;
        enemies = [];
        levels[currentLevelIndex].enemies.forEach(e => { createEnemy(e.x, e.y); });
        levelCollectibles = [];
        levels[currentLevelIndex].collectibles.forEach(c => {
            const safePosition = getSafeCollectiblePosition(c.x, c.y);
            levelCollectibles.push({ x: safePosition.x, y: safePosition.y, width: collectibleSize.width, height: collectibleSize.height });
        });
        totalCollectiblesInLevel = levelCollectibles.length;
    }
    function update() {
        if (player.health <= 0) { gameState = 'gameOver'; return; }
        if (gameWon) { gameState = 'gameWon'; return; }
        if (keys.ArrowLeft) { player.dx = -PLAYER_SPEED; player.direction = 'left'; }
        else if (keys.ArrowRight) { player.dx = PLAYER_SPEED; player.direction = 'right'; }
        else { player.dx = 0; }
        if ((keys.ArrowUp || keys[' ']) && player.isOnGround) { player.dy = -JUMP_FORCE; player.isOnGround = false; }
        if ((keys['x'] || keys['X']) && !player.isAttacking) { player.isAttacking = true; setTimeout(() => { player.isAttacking = false; }, 300); }
        player.dy += GRAVITY;
        player.x += player.dx;
        player.y += player.dy;
        player.isOnGround = false;
        for (let row = 0; row < currentMap.length; row++) {
            for (let col = 0; col < currentMap[row].length; col++) {
                if (currentMap[row][col] > 0) {
                    const tile = { x: col * tileSize, y: row * tileSize, width: tileSize, height: tileSize };
                    if (player.x < tile.x + tile.width && player.x + player.width > tile.x && player.y < tile.y + tile.height && player.y + player.height > tile.y) {
                        const prevOverlapY = (player.y - player.dy + player.height) - tile.y;
                        if (player.dy > 0 && prevOverlapY <= 0) { player.y = tile.y - player.height; player.dy = 0; player.isOnGround = true; }
                    }
                }
            }
        }
        enemies.forEach(enemy => {
            enemy.dy += GRAVITY;
            enemy.y += enemy.dy;
            const groundY = Math.floor((enemy.y + enemy.height) / tileSize);
            const groundX = Math.floor((enemy.x + enemy.width / 2) / tileSize);
            if (currentMap[groundY] && currentMap[groundY][groundX] > 0) {
                enemy.y = groundY * tileSize - enemy.height;
                enemy.dy = 0;
                enemy.x += enemy.dx;
                if (enemy.x < enemy.patrolStart || enemy.x > enemy.patrolStart + enemy.patrolRange) { enemy.dx *= -1; }
            }
        });
        if (player.isAttacking) {
            let attackX = player.direction === 'right' ? player.x + player.width : player.x - player.attackBox.width;
            enemies.forEach((enemy, index) => {
                if (attackX < enemy.x + enemy.width && attackX + player.attackBox.width > enemy.x && player.y < enemy.y + enemy.height && player.y + player.attackBox.height > enemy.y) {
                    enemy.health -= 20;
                    if (enemy.health <= 0) enemies.splice(index, 1);
                }
            });
        }
        enemies.forEach(enemy => {
            if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x && player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
                player.health -= 5;
            }
        });
        for (let i = levelCollectibles.length - 1; i >= 0; i--) {
            const item = levelCollectibles[i];
            if (player.x < item.x + item.width && player.x + player.width > item.x && player.y < item.y + item.height && player.y + player.height > item.y) {
                levelCollectibles.splice(i, 1);
            }
        }
        camera.update();
        if (player.dx !== 0 && player.isOnGround) {
            frameCounter++;
            if (frameCounter > 8) { frameIndex = (frameIndex + 1) % playerWalkSprites.length; frameCounter = 0; }
        } else { frameIndex = 0; }
        if (player.x > worldWidth && levelCollectibles.length === 0) {
            loadLevel(currentLevelIndex + 1);
        }
    }
    function drawIntroScreen() {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '50px Consolas';
        ctx.fillText('Лера Лера', canvas.width / 2, canvas.height / 2 - 120);
        ctx.font = '24px Consolas';
        ctx.fillText('Соберите всех кроликов, чтобы продвинуться вперед!', canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillText('остерегайтесь немецких бюрократов!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Consolas';
        ctx.fillText('Controls:', canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText('Arrow Keys = Move Left/Right', canvas.width / 2, canvas.height / 2 + 60);
        ctx.fillText('Space / Up Arrow = Jump', canvas.width / 2, canvas.height / 2 + 90);
        ctx.fillText('X = Attack', canvas.width / 2, canvas.height / 2 + 120);
        ctx.font = '30px Consolas';
        ctx.fillStyle = '#8bc34a';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 180);
    }
    function draw() {
        if (gameState === 'intro') {
            drawIntroScreen();
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        for (let y = 0; y < currentMap.length; y++) {
            for (let x = 0; x < currentMap[y].length; x++) {
                if (currentMap[y][x] > 0) {
                    ctx.fillStyle = '#6d4c41';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    const isTopTile = (y === 0 || currentMap[y - 1][x] === 0);
                    if (isTopTile) {
                        ctx.fillStyle = '#8bc34a';
                        ctx.fillRect(x * tileSize, y * tileSize, tileSize, 5);
                    }
                }
            }
        }
        if (collectibleSprite) {
            levelCollectibles.forEach(item => {
                ctx.drawImage(collectibleSprite, item.x, item.y, item.width, item.height);
            });
        }
        if (enemySprite) {
            enemies.forEach(enemy => {
                ctx.drawImage(enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);
            });
        }
        ctx.save();
        if (player.direction === 'left') { ctx.scale(-1, 1); ctx.translate(-player.x * 2 - player.width, 0); }
        if (playerWalkSprites[frameIndex]) { ctx.drawImage(playerWalkSprites[frameIndex], player.x, player.y, player.width, player.height); }
        ctx.restore();
        if (player.isAttacking) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            let attackX = player.direction === 'right' ? player.x + player.width : player.x - player.attackBox.width;
            ctx.fillRect(attackX, player.y, player.attackBox.width, player.attackBox.height);
        }
        ctx.restore();
        ctx.fillStyle = 'red'; ctx.fillRect(10, 10, 200, 20);
        ctx.fillStyle = 'green'; ctx.fillRect(10, 10, player.health * 2, 20);
        ctx.strokeStyle = 'white'; ctx.strokeRect(10, 10, 200, 20);
        ctx.fillStyle = 'white'; ctx.font = '16px Consolas';
        ctx.fillText('HEALTH', 15, 26);
        ctx.fillText(`Level: ${currentLevelIndex + 1}`, 10, 50);
        const collectedCount = totalCollectiblesInLevel - levelCollectibles.length;
        ctx.fillText(`кролики: ${collectedCount} / ${totalCollectiblesInLevel}`, 10, 70);
        ctx.font = '30px Consolas'; ctx.textAlign = 'center';
        if (gameState === 'gameOver') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = 'red'; ctx.fillText('You are Great, try again', canvas.width / 2, canvas.height / 2);
        } else if (gameState === 'gameWon') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'gold';
            ctx.fillText('Ура! Tы получилa немецкий паспорт!', canvas.width / 2, canvas.height / 2 - 100);
            if (passportSprite) {
                const imgWidth = 250;
                const imgHeight = passportSprite.height * (imgWidth / passportSprite.width);
                const imgX = (canvas.width - imgWidth) / 2;
                const imgY = canvas.height / 2 - 60;
                ctx.drawImage(passportSprite, imgX, imgY, imgWidth, imgHeight);
            }
        } else if (levelCollectibles.length === 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = 'cyan';
            ctx.fillText('Все кролики собраны!', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Consolas';
            ctx.fillText('перейдите вправо, чтобы продолжить...', canvas.width/2, canvas.height/2 + 40);
        }
    }
    function gameLoop() {
        if (gameState === 'intro') {
            if (keys[' ']) {
                gameState = 'playing';
                keys[' '] = false;
            }
        } else if (gameState === 'playing') {
            update();
        }
        draw();
        requestAnimationFrame(gameLoop);
    }
};