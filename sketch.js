let currentScene = "intro";

function draw() {
  if (currentScene === "intro") {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      "Place doesn’t even feel like home anymore…\n" +
      "streets filled with strangers, flags I don’t recognise,\n" +
      "words I can’t understand.\n\n" +
      "They say it’s all part of change, but it feels more like\n" +
      "we’ve been pushed aside.\n\n" +
      "Sometimes I wonder if we’re the last ones left actually\n" +
      "fighting for this place.",
      width / 2,
      height / 2 - 60
    );
   textSize(16);
    fill(200);
    text("\n\nPress ENTER to continue", width / 2, height - 100);
    return;
  }

}

class Entity {
  constructor(x, y, width, height, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
  }
  draw() {
    image(this.sprite, this.x, this.y, this.width, this.height);
  }
}

class Player extends Entity {
  constructor(x, y, sprite) {
    super(x, y, 125, 125, sprite);
    this.speed = 5;
    this.dirX = 0;
    this.dirY = 0;
  }
  setDirection() {
    this.dirX = 0;
    this.dirY = 0;
    if (keyIsDown(87)) this.dirY = -1; // W
    if (keyIsDown(83)) this.dirY = 1;  // S
    if (keyIsDown(65)) this.dirX = -1; // A
    if (keyIsDown(68)) this.dirX = 1;  // D
  }
  move() {
    this.x += this.dirX * this.speed;
    this.y += this.dirY * this.speed;
    this.x = constrain(this.x, 0, width - this.width);
    this.y = constrain(this.y, 0, height - this.height);
  }
}

class WorldTile extends Entity {
  constructor(sprite, x, y, size) {
    super(x, y, size, size, sprite);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.speed = 7;
  }
  update() {
    this.y -= this.speed;
  }
  draw() {
    fill(240,235,210);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Enemy extends Entity {
  constructor(x, y, sprite, speed) {
    super(x, y, 110, 120, sprite);
    this.speed = speed;
  }
  update(player) {
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let mag = sqrt(dx*dx + dy*dy);
    this.x += (dx / mag) * this.speed;
    this.y += (dy / mag) * this.speed;
  }
}

class Coin {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.speed = 3;
  }
  update() {
    this.y += this.speed;
  }
  draw() {
    image(this.sprite, this.x, this.y, 40, 40);
  }
}

let bg1, bg2;
let playerSprites = [];
let enemySprites = [];
let coinSprite;
let coinSound, shootSound, walkSound;

let world;
let player;
let bullets = [];
let enemies = [];
let coins = [];

let score = 0;
let coinCount = 0;
let gameState = "intro"; // instructions, playing, gameover, 
let level = 1;
let spriteTimer = 0;

function preload() {
  bg1 = loadImage("images/background/blackandwhitebg.JPEG");
  bg2 = loadImage("images/background/colorbg.jpeg");

  
  playerSprites[0] = loadImage("images/characters/character1_frame3.png");
  playerSprites[1] = loadImage("images/characters/character1_frame2.png");

  enemySprites[0] = loadImage("images/enemiess/enemy1_frame5.png");
  enemySprites[1] = loadImage("images/enemiess/enemy1_frame6.png");
  enemySprites[2] = loadImage("images/enemiess/enemy1_frame7.png");
  enemySprites[3] = loadImage("images/enemiess/enemy1_frame8.png");
  enemySprites[4] = loadImage("images/enemiess/enemy2_frame3.png");
  enemySprites[5] = loadImage("images/enemiess/enemy2_frame4.png");
  enemySprites[6] = loadImage("images/enemiess/enemy2_frame5.png");
  enemySprites[7] = loadImage("images/enemiess/enemy2_frame6.png");
  enemySprites[8] = loadImage("images/enemiess/enemy2_frame7.png");

  coinSprite = loadImage("images/coin/coin_falling.png");

  coinSound = loadSound("sounds/Coins jingling.mp3");
  shootSound = loadSound("sounds/Plop Shooting .mp3");
  walkSound = loadSound("sounds/Walking 1.mp3");
}

function setup() {
  createCanvas(672, 672);
  world = new WorldTile(bg1, 0, 0, 672);
  player = new Player(width/2, height-150, playerSprites[0]);
  spawnEnemies();
}

function draw() {
    if (gameState === "intro") {
      background(0);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text(
        "This place doesn’t even feel like home anymore…\n" +
        "streets filled with strangers, flags I don’t recognise,\n" +
        "words I can’t understand.\n\n" +
        "They say it’s all part of change, but it feels more like\n" +
        "we’ve been pushed aside.\n\n" +
        "Sometimes I wonder if we’re the last ones left actually\n" +
        "fighting for this place. BREXIT MEANS EXIT!",
        width / 2,
        height / 2 - 60
    );
   textSize(16);
    fill(200);
    text("\n\nPress ENTER to continue", width / 2, height - 100);
    image(playerSprites[0], width-750, height/2)
    return;
  }

  if (gameState === "instructions") {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Welcome to BRIT of the CASTLE\n\nUse W A S D to move your character\nPress SPACEBAR to shoot\nReach 100 to go to next level", width/2, height/2);
    text("\nPress SPACE to start", width/2, height/2 + 150);
    return;
  }

  if (gameState === "gameover") {
    background(0);
    fill(255,0,0);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("GAME OVER", width/2, height/2);
    textSize(20);
    text("Press SPACE to restart", width/2, height/2 + 60);
    return;
  }

  // PLAYING
  world.draw();

  // animate player sprite every 7s
  if (millis() - spriteTimer > 7000) {
    spriteTimer = millis();
    let idx = playerSprites.indexOf(player.sprite);
    player.sprite = playerSprites[(idx+1) % playerSprites.length];
  }

  player.setDirection();
  player.move();
  player.draw();

  // update bullets
  for (let i = bullets.length-1; i>=0; i--) {
    bullets[i].update();
    bullets[i].draw();
    if (bullets[i].y < 0) bullets.splice(i,1);
  }

  // update enemies
  for (let i=enemies.length-1; i>=0; i--) {
    enemies[i].update(player);
    enemies[i].draw();

    // collision with player
    if (collides(player, enemies[i])) {
      gameState = "gameover";
    }

    // collision with bullets
    for (let j=bullets.length-1; j>=0; j--) {
      if (dist(bullets[j].x, bullets[j].y, enemies[i].x+40, enemies[i].y+45) < 40) {
        score += 10;
        enemies[i].x = random(width);
        enemies[i].y = random(100);
        bullets.splice(j,1);
        break;
      }
    }
  }

  // level up
  if (level===1 && score>=100) {
    level = 2;
    world.sprite = bg2;
    enemies.forEach(e => e.speed *= 2);
  }

  // coins (only in level 2)
  if (level===2) {
    if (random(1)<0.01) {
      coins.push(new Coin(random(width-40), 0, coinSprite));
    }
    for (let i=coins.length-1; i>=0; i--) {
      coins[i].update();
      coins[i].draw();
      if (collides(player, coins[i])) {
        coinCount+=5;
        if (coinSound.isLoaded()) coinSound.play();
        coins.splice(i,1);
      } else if (coins[i].y>height) {
        coins.splice(i,1);
      }
    }
  }

  // UI
  fill(255);
  textSize(16);
  text("Score: "+score, 60, 20);
  text("Coins: "+coinCount, 60, 40);
}

function keyPressed() {
   if (gameState === "intro" && keyCode === ENTER) {
    gameState = "instructions";
    return;
  }
  if (gameState==="instructions" && key===" ") {
    gameState="playing";
    return;
  }
  if (gameState==="gameover" && key===" ") {
    restartGame();
    return;
  }
  if (gameState==="playing" && key===" ") {
    bullets.push(new Bullet(player.x+player.width/2, player.y));
    if (shootSound.isLoaded()) shootSound.play();
  }
}

function collides(a, b) {
  return !(a.x+a.width < b.x || a.x > b.x+b.width || a.y+a.height < b.y || a.y > b.y+b.height);
}

function spawnEnemies() {
  enemies=[];
  for (let i=0;i<3;i++) {
    let randomSprite = random(enemySprites);
    enemies.push(new Enemy(random(width), random(100), randomSprite, 2));
  }
}

function restartGame() {
  score=0;
  coinCount=0;
  level=1;
  world.sprite=bg1;
  player.sprite=playerSprites[0];
  spriteTimer=millis();
  bullets=[];
  coins=[];
  spawnEnemies();
  gameState="playing";
}
