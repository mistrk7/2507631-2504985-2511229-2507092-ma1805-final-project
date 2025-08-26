class Entity {
  constructor(sprite, x, y, size) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  update(){}
  
  draw() {
    image(this.sprite, this.x, this.y, this.size, this.size);
  }
}

class Player extends Entity {
  constructor(sprite, x, y, size) {
    super(sprite, x, y, size);
    this.dirX = 0;
    this.dirY = 0;
    this.isMoving = false;
  }

  // check if a player is pressing one of the WSAD keys
  // set two variables to either 1 or -1 depending on which direction of the key held down.
  update(){
    let up = 87;
    let down = 83;
    let left = 65;
    let right = 68;

    this.isMoving = false
    if (!this.isMoving){
      this.isMoving = true;
      
      if (keyIsDown(up)){
        this.dirY = -1;
        this.dirX = 0;
      }
      if (keyIsDown(down)){
        this.dirY = 1;
        this.dirX = 0;
      }
      if (keyIsDown(left)){
        this.dirX = -1;
        this.dirY = 0;
      }
      if (keyIsDown(right)){
        this.dirX = 1;
        this.dirY = 0;
      }
    }
    // move the player using defined directions
    if (this.dirX !== 0 || this.dirY !== 0) {
      this.x += this.dirX * 3; // speed
      this.y += this.dirY * 3;
    }
  }
}

// TODO: Add a sprite sheet to animate the player or other entities

class initWorld {
  constructor(bkgrnd, x, y, size) {
    this.bgImage = bkgrnd;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  draw() {
    image(this.bgImage, this.x, this.y, this.size, this.size);
  }
}

let bgImage = p5.Image;

function preload() {
  bgImage = loadImage('/images/background/Biggergrass_bg.png');
  plyrImage = loadImage('/images/enemies/enemy3_frame1.png')
}

function setup() {
  createCanvas(672, 672);
  initialWorld = new initWorld(bgImage, 0, 0, 672);
  plyr = new Player(plyrImage, width/2, height/2, 100);
  print(width/2);
}


function draw() {
  background(220);
  initialWorld.draw();
  plyr.update();
  plyr.draw();
}
