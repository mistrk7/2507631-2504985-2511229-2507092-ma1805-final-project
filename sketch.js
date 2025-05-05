class Player {
  constructor(x=0, y=0, size=0) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
}

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
}

function draw() {
  background(220);
  initialWorld = new initWorld(bgImage, 0,0,672);
  initialWorld.draw(bgImage, 0, 0);
}
