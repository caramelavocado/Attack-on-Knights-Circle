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
bgMusic.loop = true;
bgMusic.volume = 0.4;
let gameWon = false;

let keys = {};
let level = 1;
let lives = 3;
let score = 0;
let gameOver = false;

let player = {
  x: 50,
  y: 200,
  width: 25,
  height: 25,
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

document.addEventListener("keydown", () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
}, { once: true });

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === " " && (level === 2 || level === 4)) {
    shoot();
  }

  if (gameOver && e.key === "Enter") {
    restartGame();
  }
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function startLevel() {
  player.x = 50;
  player.y = 200;
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
  for (let i = 0; i < 8; i++) {
    hearts.push({
      x: 80 + i * 70,
      y: 80 + Math.random() * 250,
      size: 18
    });
  }

  for (let i = 0; i < 4; i++) {
    enemies.push({
      x: 150 + i * 120,
      y: 100 + Math.random() * 250,
      width: 25,
      height: 25,
      speed: 2 + Math.random() * 2
    });
  }
}

function setupLevel2() {
  player.x = 330;
  player.y = 380;

  for (let i = 0; i < 8; i++) {
    obstacles.push({
      x: 50 + i * 80,
      y: 50,
      width: 30,
      height: 30,
      speed: 1.5
    });
  }

  for (let i = 0; i < 5; i++) {
    bombs.push({
      x: Math.random() * 650,
      y: Math.random() * 200,
      width: 20,
      height: 20,
      speed: 2
    });
  }
}

function setupLevel3() {
  player.x = 40;
  player.y = 300;
  player.vy = 0;

  platforms = [
    { x: 0, y: 420, width: 160, height: 30 },
    { x: 220, y: 370, width: 120, height: 20 },
    { x: 400, y: 320, width: 120, height: 20 },
    { x: 580, y: 270, width: 120, height: 20 }
  ];

  obstacles = [
    { x: 250, y: 340, width: 25, height: 30 },
    { x: 430, y: 290, width: 25, height: 30 }
  ];
}

function setupLevel4() {
  player.x = 330;
  player.y = 380;

  boss = {
    x: 300,
    y: 60,
    width: 100,
    height: 60,
    health: 10,
    speed: 3
  };

  bombs = [];

  bossSound.loop = true;
  bossSound.currentTime = 0;
  bgMusic.pause();
  bossSound.play();
}

function drawPlayer() {
  ctx.fillStyle = "#4dd2ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
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
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function shoot() {
  
  shootSound.currentTime = 0;
  shootSound.play();

  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 12,
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
  hitSound.currentTime = 0;
  hitSound.play();
  
  lives--;

  if (lives <= 0) {
    gameOver = true;
    bgMusic.pause();
    bossSound.pause();
    gameOverSound.play();
  } else {
    startLevel();
  }
}

function nextLevel() {
  level++;
  startLevel();
}

function updateLevel1() {
  movePlayer();

  ctx.fillStyle = "pink";
  hearts.forEach(heart => {
    ctx.fillRect(heart.x, heart.y, heart.size, heart.size);
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

  ctx.fillStyle = "red";
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;

    if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
      enemy.speed *= -1;
    }

    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    if (rectsCollide(player, enemy)) {
      loseLife();
    }
  });

  if (hearts.length === 0) {
    nextLevel();
  }
}

function updateLevel2() {
  movePlayer();

  ctx.fillStyle = "yellow";
  bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  bullets = bullets.filter(bullet => bullet.y > 0);

  ctx.fillStyle = "purple";
  obstacles.forEach(obs => {
    obs.y += obs.speed;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (obs.y > canvas.height) {
      obs.y = -30;
      obs.x = Math.random() * 650;
    }

    if (rectsCollide(player, obs)) {
      loseLife();
    }
  });

  ctx.fillStyle = "orange";
  bombs.forEach(bomb => {
    bomb.y += bomb.speed;
    ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);

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
        return false;
      }
    }
    return true;
  });

  if (score >= 15) {
    nextLevel();
  }
}

function updateLevel3() {
  movePlayer();

  player.vy += 0.6;
  player.y += player.vy;
  player.onGround = false;

  ctx.fillStyle = "green";
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    if (
      rectsCollide(player, platform) &&
      player.vy >= 0 &&
      player.y + player.height <= platform.y + 15
    ) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  });

  ctx.fillStyle = "red";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (rectsCollide(player, obs)) {
      loseLife();
    }
  });

  if (player.y > canvas.height) {
    loseLife();
  }

  if (player.x > 650 && player.y < 300) {
    nextLevel();
  }
}

function updateLevel4() {

  movePlayer();

  ctx.fillStyle = "yellow";
  bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  bullets = bullets.filter(bullet => bullet.y > 0);

  if (boss) {
    boss.x += boss.speed;

    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
      boss.speed *= -1;
    }

    ctx.fillStyle = "darkred";
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

    ctx.fillStyle = "white";
    ctx.fillText("Boss HP: " + boss.health, 300, 40);

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
        width: 20,
        height: 20,
        speed: 4
      });
    }

    if (boss.health <= 0) {
      if (!gameWon) {
        gameWon = true;
        bossSound.pause();
        bgMusic.pause();
        winSound.play();
  }

      ctx.fillStyle = "white";
      ctx.font = "35px Arial";
      ctx.fillText("YOU WIN!", 270, 220);
      return;
    }
  }

  ctx.fillStyle = "orange";
  bombs.forEach(bomb => {
    bomb.y += bomb.speed;
    ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);

    if (rectsCollide(player, bomb)) {
      loseLife();
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 260, 200);
    ctx.font = "20px Arial";
    ctx.fillText("Press Enter to Restart", 250, 240);
    return;
  }

  ctx.font = "18px Arial";

  if (level === 1) updateLevel1();
  if (level === 2) updateLevel2();
  if (level === 3) updateLevel3();
  if (level === 4) updateLevel4();

  drawPlayer();
  drawText();

  requestAnimationFrame(gameLoop);
}

function restartGame() {
  level = 1;
  lives = 3;
  score = 0;
  gameOver = false;
  gameWon = false;
  startLevel();
  gameLoop();
}

startLevel();
gameLoop();
