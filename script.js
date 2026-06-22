ChatGPT




walk me through how to make a videogame step by step in github

I’ll walk you through a simple browser-based game you can build directly in GitHub, so you do not need to install anything. We’ll make a small playable HTML/CSS/JavaScript game and publish it with GitHub Pages.

Thought for a couple of seconds
We’ll make a simple pixel-style game directly in GitHub using HTML, CSS, and JavaScript.

Step 1: Make a new GitHub repository
Go to GitHub

Click the + in the top right

Click New repository

Name it something like:

pixel-game

Choose Public

Check Add a README file

Click Create repository

Step 2: Add your game files
Inside your new repo, click Add file → Create new file.

Create these 3 files:

index.html
style.css
script.js
Step 3: Create index.html
Click Create new file and name it:

index.html
Paste this:

<!DOCTYPE html>
<html>
<head>
  <title>Pixel Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Pixel Coin Collector</h1>

  <p>Use the arrow keys to move. Collect the yellow coin!</p>

  <canvas id="gameCanvas" width="400" height="400"></canvas>

  <p id="scoreText">Score: 0</p>

  <script src="script.js"></script>
</body>
</html>
Click Commit changes.

Step 4: Create style.css
Create another file named:

style.css
Paste this:

body {
  text-align: center;
  background-color: #222;
  color: white;
  font-family: Arial, sans-serif;
}

canvas {
  background-color: #111;
  border: 4px solid white;
  image-rendering: pixelated;
}

h1 {
  color: #ffcc00;
}
Click Commit changes.

Step 5: Create script.js
Create another file named:

script.js
Paste this:

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 40,
  y: 40,
  size: 20,
  speed: 20
};

let coin = {
  x: 200,
  y: 200,
  size: 20
};

let score = 0;

document.addEventListener("keydown", movePlayer);

function movePlayer(event) {
  if (event.key === "ArrowUp") {
    player.y -= player.speed;
  } else if (event.key === "ArrowDown") {
    player.y += player.speed;
  } else if (event.key === "ArrowLeft") {
    player.x -= player.speed;
  } else if (event.key === "ArrowRight") {
    player.x += player.speed;
  }

  keepPlayerInside();
  checkCoinCollision();
  drawGame();
}

function keepPlayerInside() {
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
  if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}

function checkCoinCollision() {
  if (
    player.x < coin.x + coin.size &&
    player.x + player.size > coin.x &&
    player.y < coin.y + coin.size &&
    player.y + player.size > coin.y
  ) {
    score++;
    document.getElementById("scoreText").textContent = "Score: " + score;

    coin.x = Math.floor(Math.random() * 20) * 20;
    coin.y = Math.floor(Math.random() * 20) * 20;
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.fillStyle = "#00aaff";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // coin
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(coin.x, coin.y, coin.size, coin.size);
}

drawGame();
Click Commit changes.

Step 6: Publish the game with GitHub Pages
Go to your repo

Click Settings

On the left, click Pages

Under Branch, choose:

main
Click Save

After a minute, GitHub will give you a website link. That link is your playable game.

Step 7: Test it
Open the GitHub Pages link.

You should see a game where:

Blue square = player

Yellow square = coin

Arrow keys move the player

Score increases when you collect the coin

Next, you can customize it by changing the colors, title, player size, or adding obstacles.


I want a four level game where the player has three lives throughout the whole game and if they lose all three lives they have to restart. The first level should be pacman style where the player has to collect hearts while avoiding villains. The second level should be galactica style game where the player shoots down obstacles and avoids bombs. The third level should be a platformer with some obstacles and places for them to potentially fall into. At the end of the third level there should be a boss fight which will be considered the last level. 

We can build this as one GitHub Pages game using the same 3 files: index.html, style.css, and script.js. I’ll give you a working “starter full game” with all four levels, then you can customize sprites, colors, and difficulty later.

Thought for a couple of seconds
Yes — make it as one JavaScript canvas game with 4 levels.

Create/replace these files in GitHub:

index.html
style.css
script.js
1. index.html
<!DOCTYPE html>
<html>
<head>
  <title>Four Level Hero Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Four Level Hero Game</h1>

  <p id="instructions">
    Use arrow keys to move. Spacebar shoots in Level 2 and Boss Fight.
  </p>

  <canvas id="gameCanvas" width="700" height="450"></canvas>

  <p id="gameInfo"></p>

  <script src="script.js"></script>
</body>
</html>
2. style.css
body {
  background: #1b1b1b;
  color: white;
  text-align: center;
  font-family: Arial, sans-serif;
}

canvas {
  background: #111;
  border: 4px solid white;
  image-rendering: pixelated;
}

h1 {
  color: pink;
}

#gameInfo {
  font-size: 20px;
  font-weight: bold;
}
3. script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameInfo = document.getElementById("gameInfo");

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
  lives--;

  if (lives <= 0) {
    gameOver = true;
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
  startLevel();
  gameLoop();
}

startLevel();
gameLoop();
How the game works
Level 1 is Pac-Man style. The player collects pink hearts while avoiding red villains.

Level 2 is Galaga-style. The player moves around, shoots obstacles with the spacebar, and avoids bombs.

Level 3 is a platformer. The player jumps across platforms, avoids red obstacles, and can fall.

Level 4 is the boss fight. The player shoots the boss while dodging bombs.

Controls
Arrow keys = move
Up arrow = jump in Level 3
Spacebar = shoot in Level 2 and Level 4
Enter = restart after game over
After you add the files, go to:

Settings → Pages → Branch → main → Save
Then open the GitHub Pages link to play it.


how do I add sound effects

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
}

function drawPlayer() {
  ctx.fillStyle = "#4dd2ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawText() {
  gameInfo.textContent = Level: ${level} | Lives: ${lives} | Score: ${score};
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
  bossSound.loop = true;
  bossSound.play();
  
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
      bossSound.pause();
      winSound.play();
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
  startLevel();
  gameLoop();
}

startLevel();
gameLoop();

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
  bossSound.play();
}

function drawPlayer() {
  ctx.fillStyle = "#4dd2ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawText() {
  gameInfo.textContent = Level: ${level} | Lives: ${lives} | Score: ${score};
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

      bossSound.pause();
      winSound.play();
      
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
  startLevel();
  gameLoop();
}

startLevel();
gameLoop();

This is much better. There are 2 important fixes you still need.

Fix 1: Stop win sound from repeating forever
Right now, once the boss dies, winSound.play() runs every frame.

Add this near your variables:

let gameWon = false;
Then change this part:

if (boss.health <= 0) {

  bossSound.pause();
  winSound.play();
      
  ctx.fillStyle = "white";
  ctx.font = "35px Arial";
  ctx.fillText("YOU WIN!", 270, 220);
  return;
}
To this:

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
Fix 2: Reset gameWon when restarting
In restartGame(), add:

gameWon = false;
So it becomes:

function restartGame() {
  level = 1;
  lives = 3;
  score = 0;
  gameOver = false;
  gameWon = false;
  startLevel();
  gameLoop();
}
Optional but recommended
In setupLevel4(), pause the background music so boss music is clearer:

bgMusic.pause();
So this part becomes:

bossSound.loop = true;
bossSound.currentTime = 0;
bgMusic.pause();
bossSound.play();
After those fixes, your sound effects should work correctly.


after a gameover, the background music stops

Generated image: Adding pixel-art sprites in JavaScript


Edit


Generated image: Adding pixel-art sprites in JavaScript
Generated image: Adding pixel-art sprites in JavaScript
Generated image: Adding pixel-art sprites in JavaScript

Generated image: How to add pixel art sprites
Generated image: How to add pixel art sprites
Generated image: How to add pixel art sprites

To add sprite images, you upload image files to GitHub and then replace fillRect() with drawImage().

Step 1: Make an images folder
In GitHub, click:

Add file → Create new file
Name it:

images/.gitkeep
Commit it.

Step 2: Upload your sprite images
Click:

Add file → Upload files
Upload images like:

images/player.png
images/heart.png
images/enemy.png
images/ship.png
images/bullet.png
images/obstacle.png
images/bomb.png
images/platform.png
images/boss.png
PNG files are best because they can have transparent backgrounds.

Step 3: Load the images in script.js
Near the top of your script.js, under your sounds, add:

const playerImg = new Image();
playerImg.src = "images/player.png";

const heartImg = new Image();
heartImg.src = "images/heart.png";

const enemyImg = new Image();
enemyImg.src = "images/enemy.png";

const shipImg = new Image();
shipImg.src = "images/ship.png";

const bulletImg = new Image();
bulletImg.src = "images/bullet.png";

const obstacleImg = new Image();
obstacleImg.src = "images/obstacle.png";

const bombImg = new Image();
bombImg.src = "images/bomb.png";

const platformImg = new Image();
platformImg.src = "images/platform.png";

const bossImg = new Image();
bossImg.src = "images/boss.png";
Step 4: Replace the player square
Change your drawPlayer() function from this:

function drawPlayer() {
  ctx.fillStyle = "#4dd2ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
To this:

function drawPlayer() {
  if (level === 2) {
    ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }
}
Step 5: Replace hearts
Change this:

ctx.fillStyle = "pink";
hearts.forEach(heart => {
  ctx.fillRect(heart.x, heart.y, heart.size, heart.size);
});
To this:

hearts.forEach(heart => {
  ctx.drawImage(heartImg, heart.x, heart.y, heart.size, heart.size);
});
Step 6: Replace enemies
Change this:

ctx.fillStyle = "red";
and this:

ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
To this:

ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
Step 7: Replace bullets
Change this:

ctx.fillStyle = "yellow";
bullets.forEach(bullet => {
  bullet.y -= bullet.speed;
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
});
To this:

bullets.forEach(bullet => {
  bullet.y -= bullet.speed;
  ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
});
Step 8: Replace bombs
Change this:

ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
To this:

ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);
Step 9: Replace platforms
Change this:

ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
To this:

ctx.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height);
Step 10: Replace boss
Change this:

ctx.fillStyle = "darkred";
ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
To this:

ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);
The basic pattern is:

ctx.drawImage(imageName, x, y, width, height);
That draws your uploaded image instead of a colored square.



Pasted text(6).txt
Document

I found several issues in your code that will either cause errors or prevent some sprites from appearing correctly. The code you uploaded is in 

.

1. Level 1 Enemy Error
You have:

ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
enemies.forEach(enemy => {
The first line is outside the loop, so enemy does not exist there.

Delete this line completely:

ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
Keep only:

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
2. Level 2 Obstacles Are Drawing the Wrong Image
Inside updateLevel2() you have:

obstacles.forEach(obs => {
    obs.y += obs.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);
Problems:

You're drawing bombImg

You're using bomb.x

There is no bomb variable inside this loop

Replace with:

obstacles.forEach(obs => {
    obs.y += obs.speed;
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
3. Bombs Still Use Colored Squares
You changed obstacles but not bombs.

Replace:

ctx.fillStyle = "orange";
bombs.forEach(bomb => {
    bomb.y += bomb.speed;
    ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
with:

bombs.forEach(bomb => {
    bomb.y += bomb.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);
4. Platforms Still Use Green Rectangles
Replace:

ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
with:

ctx.drawImage(
    platformImg,
    platform.x,
    platform.y,
    platform.width,
    platform.height
);
5. Level 3 Obstacles Still Use Red Rectangles
Replace:

ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
with:

ctx.drawImage(
    obstacleImg,
    obs.x,
    obs.y,
    obs.width,
    obs.height
);
6. Boss Bombs Still Use Orange Squares
In updateLevel4() replace:

ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
with:

ctx.drawImage(
    bombImg,
    bomb.x,
    bomb.y,
    bomb.width,
    bomb.height
);
7. Restart Function
You currently have:

gameLoop();
requestAnimationFrame(gameLoop);
inside restartGame().

You only need one.

Change:

startLevel();
gameLoop();
requestAnimationFrame(gameLoop);
to:

startLevel();
requestAnimationFrame(gameLoop);
8. Image Sizes
Right now your player is only:

width: 25,
height: 25
Most sprite PNGs will look tiny.

Try:

width: 50,
height: 50
for:

player

enemies

boss projectiles

hearts

You can even make the boss larger:

width: 150,
height: 120
inside setupLevel4().

The biggest issue preventing the game from running correctly is #1 and #2. Fix those first, then test the game. If the sprites still don't appear, send a screenshot of your GitHub repository's images folder and I can verify the file names match exactly.


give me the full fixed code

I’ll give you a full replacement for script.js with the sprite fixes included, plus the restart/music fixes so it does not double-start the game loop.

Thought for a few seconds
Replace your entire script.js with this fixed version. It is based on your uploaded code. 


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
let gameOver = false;
let gameWon = false;
let gameRunning = true;

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

document.addEventListener("keydown", () => {
  if (bgMusic.paused && level !== 4 && !gameOver && !gameWon) {
    bgMusic.play();
  }
}, { once: true });

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === " " && (level === 2 || level === 4) && !gameOver && !gameWon) {
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
  player.vy = 0;

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
  hitSound.currentTime = 0;
  hitSound.play();

  lives--;

  if (lives <= 0) {
    gameOver = true;
    bgMusic.pause();
    bossSound.pause();
    gameOverSound.currentTime = 0;
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
    nextLevel();
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
    nextLevel();
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
    nextLevel();
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

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
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
        width: 35,
        height: 35,
        speed: 4
      });
    }

    if (boss.health <= 0) {
      if (!gameWon) {
        gameWon = true;
        bossSound.pause();
        bgMusic.pause();
        winSound.currentTime = 0;
        winSound.play();
      }

      ctx.fillStyle = "white";
      ctx.font = "35px Arial";
      ctx.fillText("YOU WIN!", 270, 220);
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

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 260, 200);
    ctx.font = "20px Arial";
    ctx.fillText("Press Enter to Restart", 250, 240);
    drawText();
    return;
  }

  if (level === 1) updateLevel1();
  if (level === 2) updateLevel2();
  if (level === 3) updateLevel3();
  if (level === 4) updateLevel4();

  if (!gameWon) {
    drawPlayer();
  }

  drawText();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function restartGame() {
  level = 1;
  lives = 3;
  score = 0;
  gameOver = false;
  gameWon = false;

  bossSound.pause();
  bossSound.currentTime = 0;

  gameOverSound.pause();
  gameOverSound.currentTime = 0;

  winSound.pause();
  winSound.currentTime = 0;

  bgMusic.currentTime = 0;
  bgMusic.play();

  startLevel();
  requestAnimationFrame(gameLoop);
}

startLevel();
gameLoop();

image(15).png
these are my pictures so far and the sprites are not showing up

Your code is looking for 2 images you do not have yet:

images/pencil.png
images/platform.png
But your folder only has:

angryResident.png
eventProposal.png
godzilla.png
golfCart.png
phone.png
player.png
spaceShip.png
workOrder.png
So either upload:

pencil.png
platform.png
or change the code.

Quick fix
Change this:

const bulletImg = new Image();
bulletImg.src = "images/pencil.png";

const platformImg = new Image();
platformImg.src = "images/platform.png";
to this:

const bulletImg = new Image();
bulletImg.src = "images/workOrder.png";

const platformImg = new Image();
platformImg.src = "images/workOrder.png";
That will at least make all sprites show.

Also check this
Your folder must be named exactly:

images
Your code paths are case-sensitive on GitHub Pages. So:

images/golfCart.png
must match the file name exactly. It looks like yours does, which is good.

After changing the code, click Commit changes, then refresh your game page with:

Ctrl + Shift + R
That forces GitHub Pages to reload the newest files.


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
if (level === 1) {
ctx.drawImage(cartImg, player.x, player.y, player.width, player.height);
} else if (level === 2) {
ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
} else {
ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}
}

function drawText() {
gameInfo.textContent = Level: ${level} | Lives: ${lives} | Score: ${score};
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

ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
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
nextLevel();
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
ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);

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

ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);

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

bossSound.currentTime = 0;

bgMusic.currentTime = 0;
bgMusic.play();

startLevel();
gameLoop();
requestAnimationFrame(gameLoop);
}

startLevel();
gameLoop();


Close
