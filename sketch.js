class Entity {
  constructor(x,y,width,height,sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
  }

  draw() {
    image(this.bgImage, this.x, this.y, this.size, this.size);
  }
}

class Player extends Entity {
  constructor() {
    this.x = x;
    this.y = y;
    this.size = 36;
  }

  display(){
    image(this.sprite, this.xPos, this.yPos, this.tileSize, this.tileSize);
  }

    // check if a player is pressing one of the WSAD keys
  // set two variables to either 1 or -1 depending on which direction of the key held down.
  setDirection(dir){
    let up = 87;
    let down = 83;
    let left = 65;
    let right = 68;

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
      
      this.checkTargetTile();
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

let bgImage=p5.Image;

function preload() {
  bgImage = loadImage('/images/background/Biggergrass_bg.png');
}

function setup() {
  createCanvas(672, 672);
  // hey
}

function draw() {
  background(220);
  initialWorld = new initWorld(bgImage, 0,0,672);
  initialWorld.draw(bgImage, 0, 0);
}
