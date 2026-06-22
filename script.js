const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameInfo = document.getElementById("gameInfo");

const collectSound = new Audio("sounds/collect.mp3");
const hitSound = new Audio("sounds/hit.mp3");
const shootSound = new Audio("sounds/shoot.mp3");
const bossSound = new Audio("sounds/boss.mp3");
const winSound = new Audio("sounds/win.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const bgMusic = new Audio("sounds/background.mp3");

const playerImg = new Image();
playerImg.src = "images/player.png";

const heartImg = new Image();
heartImg.src = "images/eventProposal.png";

const cartImg = new Image();
cartImg.src = "images/golfCart.png";

const enemyImg = new Image();
enemyImg.src = "images/angryResident.png";

const shipImg = new Image();
shipImg.src = "images/spaceShip.png";

const bulletImg = new Image();
bulletImg.src = "images/pencil.png";

const obstacleImg = new Image();
obstacleImg.src = "images/workOrder.png";

const bombImg = new Image();
bombImg.src = "images/phone.png";

const platformImg = new Image();
platformImg.src = "images/platform.png";

const bossImg = new Image();
bossImg.src = "images/godzilla.png";

bgMusic.loop = true;
bgMusic.volume = 0.4;

let keys = {};
let level = 1;
let lives = 3;
let score = 0;

let gameState = "start";

let fadeAlpha = 0;
let fadingIn = false;

let player = {
  x: 50,
  y: 200,
  width: 45,
  height: 45,
  speed: 4,
  vy: 0,
  onGround: false
};

let hearts = [];
let enemies = [];
let bullets = [];
let obstacles = [];
let bombs = [];
let platforms = [];
let boss = null;

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (gameState === "start" && e.key === "Enter") {
    gameState = "levelIntro";
    startFadeIn();
  }

  else if (gameState === "levelIntro" && e.key === "Enter") {
    gameState = "playing";

    if (level !== 4 && bgMusic.paused) {
      bgMusic.play();
    }

    startLevel();
    startFadeIn();
  }

  else if (gameState === "levelComplete" && e.key === "Enter") {
    level++;
    gameState = "levelIntro";
    startFadeIn();
  }

  else if (gameState === "gameOver" && e.key === "Enter") {
    restartGame();
    startFadeIn();
  }

  else if (gameState === "win" && e.key === "Enter") {
    restartGame();
    startFadeIn();
  }

  if (e.key === " " && gameState === "playing" && (level === 2 || level === 4)) {
    shoot();
  }
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function startFadeIn() {
  fadeAlpha = 1;
  fadingIn = true;
}

function drawFadeIn() {
  if (fadingIn) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fadeAlpha -= 0.03;

    if (fadeAlpha <= 0) {
      fadeAlpha = 0;
      fadingIn = false;
    }
  }
}

function centerText(text, y, size = 20) {
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, canvas.width / 2, y);
  ctx.textAlign = "left";
}

function drawScreen(title, subtitle, instructions) {
  centerText(title, 140, 36);
  centerText(subtitle, 200, 22);
  centerText(instructions, 260, 18);
}

function drawLevelIntro() {
  if (level === 1) {
    drawScreen(
      "Phase 1: EVENT RUN",
      "Collect all the event proposals while avoiding angry residents.",
      "Press Enter to Begin"
    );
  }

  if (level === 2) {
    drawScreen(
      "Phase 2: SPACE OFFICE",
      "Complete work orders and dodge incoming phones calls.",
      "Press Enter to Begin"
    );
  }

  if (level === 3) {
    drawScreen(
      "Phase 3: APARTMENT ESCAPE",
      "Give an apartment tour and dodge the leases.",
      "Press Enter to Begin"
    );
  }

  if (level === 4) {
    drawScreen(
      "Phase 4: FINAL FIGHT",
      "Show them who's boss.",
      "Press Enter to Begin"
    );
  }
}

function startLevel() {
  player.x = 50;
  player.y = 200;
  player.vy = 0;
  player.onGround = false;

  bullets = [];
  hearts = [];
  enemies = [];
  obstacles = [];
  bombs = [];
  platforms = [];
  boss = null;

  if (level === 1) setupLevel1();
  if (level === 2) setupLevel2();
  if (level === 3) setupLevel3();
  if (level === 4) setupLevel4();
}

function setupLevel1() {
  player.width = 45;
  player.height = 45;

  for (let i = 0; i < 8; i++) {
    hearts.push({
      x: 80 + i * 70,
      y: 80 + Math.random() * 250,
      size: 35
    });
  }

  for (let i = 0; i < 4; i++) {
    enemies.push({
      x: 150 + i * 120,
      y: 100 + Math.random() * 250,
      width: 45,
      height: 45,
      speed: 2 + Math.random() * 2
    });
  }
}

function setupLevel2() {
  player.x = 330;
  player.y = 380;
  player.width = 45;
  player.height = 45;

  for (let i = 0; i < 8; i++) {
    obstacles.push({
      x: 50 + i * 80,
      y: 50,
      width: 45,
      height: 45,
      speed: 1.5
    });
  }

  for (let i = 0; i < 5; i++) {
    bombs.push({
      x: Math.random() * 650,
      y: Math.random() * 200,
      width: 35,
      height: 35,
      speed: 2
    });
  }
}

function setupLevel3() {
  player.x = 40;
  player.y = 300;
  player.width = 45;
  player.height = 45;

  platforms = [
    { x: 0, y: 420, width: 160, height: 30 },
    { x: 220, y: 370, width: 120, height: 25 },
    { x: 400, y: 320, width: 120, height: 25 },
    { x: 580, y: 270, width: 120, height: 25 }
  ];

  obstacles = [
    { x: 250, y: 330, width: 45, height: 45 },
    { x: 430, y: 280, width: 45, height: 45 }
  ];
}

function setupLevel4() {
  player.x = 330;
  player.y = 380;
  player.width = 45;
  player.height = 45;

  boss = {
    x: 275,
    y: 50,
    width: 150,
    height: 120,
    health: 10,
    speed: 3
  };

  bombs = [];

  bgMusic.pause();
  bossSound.loop = true;
  bossSound.currentTime = 0;
  bossSound.play();
}

function drawPlayer() {
  if (level === 1) {
    ctx.drawImage(cartImg, player.x, player.y, player.width, player.height);
  } else if (level === 2) {
    ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }
}

function drawText() {
  gameInfo.textContent = `Level: ${level} | Lives: ${lives} | Score: ${score}`;
}

function movePlayer() {
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  if (level !== 3) {
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
  }

  if (level === 3 && keys["ArrowUp"] && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  if (level !== 3) {
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
  }
}

function shoot() {
  shootSound.currentTime = 0;
  shootSound.play();

  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 18,
    height: 28,
    speed: 7
  });
}

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function loseLife() {
  if (gameState !== "playing") return;

  hitSound.currentTime = 0;
  hitSound.play();

  lives--;

  if (lives <= 0) {
    gameState = "gameOver";
    bgMusic.pause();
    bossSound.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    startFadeIn();
  } else {
    gameState = "levelIntro";
    startFadeIn();
  }
}

function completeLevel() {
  bossSound.pause();

  if (level === 4) {
    gameState = "win";
    winSound.currentTime = 0;
    winSound.play();
  } else {
    gameState = "levelComplete";
  }

  startFadeIn();
}

function updateLevel1() {
  movePlayer();

  hearts.forEach(heart => {
    ctx.drawImage(heartImg, heart.x, heart.y, heart.size, heart.size);
  });

  hearts = hearts.filter(heart => {
    let heartBox = {
      x: heart.x,
      y: heart.y,
      width: heart.size,
      height: heart.size
    };

    if (rectsCollide(player, heartBox)) {
      score++;
      collectSound.currentTime = 0;
      collectSound.play();
      return false;
    }

    return true;
  });

  enemies.forEach(enemy => {
    enemy.y += enemy.speed;

    if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
      enemy.speed *= -1;
    }

    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

    if (rectsCollide(player, enemy)) {
      loseLife();
    }
  });

  if (hearts.length === 0) {
    completeLevel();
  }
}

function updateLevel2() {
  movePlayer();

  bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });

  bullets = bullets.filter(bullet => bullet.y > 0);

  obstacles.forEach(obs => {
    obs.y += obs.speed;
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

    if (obs.y > canvas.height) {
      obs.y = -30;
      obs.x = Math.random() * 650;
    }

    if (rectsCollide(player, obs)) {
      loseLife();
    }
  });

  bombs.forEach(bomb => {
    bomb.y += bomb.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);

    if (bomb.y > canvas.height) {
      bomb.y = -20;
      bomb.x = Math.random() * 650;
    }

    if (rectsCollide(player, bomb)) {
      loseLife();
    }
  });

  obstacles = obstacles.filter(obs => {
    for (let bullet of bullets) {
      if (rectsCollide(obs, bullet)) {
        score++;
        bullet.y = -100;
        return false;
      }
    }
    return true;
  });

  if (score >= 15) {
    completeLevel();
  }
}

function updateLevel3() {
  movePlayer();

  player.vy += 0.6;
  player.y += player.vy;
  player.onGround = false;

  platforms.forEach(platform => {
    ctx.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height);

    if (
      rectsCollide(player, platform) &&
      player.vy >= 0 &&
      player.y + player.height <= platform.y + 20
    ) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  });

  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

    if (rectsCollide(player, obs)) {
      loseLife();
    }
  });

  if (player.y > canvas.height) {
    loseLife();
  }

  if (player.x > 650 && player.y < 300) {
    completeLevel();
  }
}

function updateLevel4() {
  movePlayer();

  bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });

  bullets = bullets.filter(bullet => bullet.y > 0);

  if (boss) {
    boss.x += boss.speed;

    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
      boss.speed *= -1;
    }

    ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);

    centerText("Boss HP: " + boss.health, 40, 18);

    bullets.forEach(bullet => {
      if (rectsCollide(bullet, boss)) {
        boss.health--;
        bullet.y = -100;
      }
    });

    if (Math.random() < 0.03) {
      bombs.push({
        x: boss.x + boss.width / 2,
        y: boss.y + boss.height,
        width: 35,
        height: 35,
        speed: 4
      });
    }

    if (boss.health <= 0) {
      completeLevel();
      return;
    }
  }

  bombs.forEach(bomb => {
    bomb.y += bomb.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);

    if (rectsCollide(player, bomb)) {
      loseLife();
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "start") {
    drawScreen(
      "PROPERTY QUEST",
      "Complete all 4 levels with only 3 lives.",
      "Press Enter to Start"
    );
    drawText();
    drawFadeIn();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameState === "levelIntro") {
    drawLevelIntro();
    drawText();
    drawFadeIn();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameState === "levelComplete") {
    drawScreen(
      `LEVEL ${level} COMPLETE!`,
      `Lives left: ${lives} | Score: ${score}`,
      "Press Enter to Continue"
    );
    drawText();
    drawFadeIn();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameState === "gameOver") {
    drawScreen(
      "GAME OVER",
      "You lost all 3 lives.",
      "Press Enter to Restart"
    );
    drawText();
    drawFadeIn();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameState === "win") {
    drawScreen(
      "YOU WIN!",
      "You defeated the final boss!",
      "Press Enter to Play Again"
    );
    drawText();
    drawFadeIn();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (level === 1) updateLevel1();
  if (level === 2) updateLevel2();
  if (level === 3) updateLevel3();
  if (level === 4) updateLevel4();

  drawPlayer();
  drawText();
  drawFadeIn();

  requestAnimationFrame(gameLoop);
}

function restartGame() {
  level = 1;
  lives = 3;
  score = 0;
  gameState = "start";

  bossSound.pause();
  bossSound.currentTime = 0;

  gameOverSound.pause();
  gameOverSound.currentTime = 0;

  winSound.pause();
  winSound.currentTime = 0;

  bgMusic.pause();
  bgMusic.currentTime = 0;
}

gameLoop();
