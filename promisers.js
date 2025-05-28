class Promiser {
    constructor(x = 1, y = 1, speed = 0.2) {
        this.state = new Float32Array([x, y, x, y]);
        this.speed = speed;
        this.currentTarget = null;
    }

    get x() { return this.state[0]; }
    set x(val) { this.state[0] = val; }

    get y() { return this.state[1]; }
    set y(val) { this.state[1] = val; }

    get lastX() { return this.state[2]; }
    set lastX(val) { this.state[2] = val; }

    get lastY() { return this.state[3]; }
    set lastY(val) { this.state[3] = val; }

    act() {
        const target = this.currentTarget;
        if (target instanceof Promiser) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.hypot(dx, dy);
            if (distance !== 0) {
                const ratio = this.speed / distance;
                this.lastX = this.x;
                this.lastY = this.y;
                this.x += dx * ratio;
                this.y += dy * ratio;
            }
        }
    }
}

class FirstPromiser extends Promiser {
    constructor(x = 1, y = 1, speed = 0.2, isStatic = false) {
        super(x, y, speed);
        this.isStatic = isStatic;
        this.hitDistance = Math.floor(speed);
        this.numPromises = 100;
        this.myPromises = new Array(this.numPromises).fill(null);
        this.size = 0;
    }

    addPromise(target) {
        if (this.size >= this.numPromises) {
            const index = Math.floor(Math.random() * this.numPromises);
            this.myPromises[index] = target;
            this.currentTarget = this.myPromises[this.numPromises - 1];
        } else {
            this.myPromises[this.size] = target;
            this.currentTarget = target;
            this.size++;
        }
    }

    act() {
        if (this.isStatic) return;

        const target = this.currentTarget;
        if (target instanceof Promiser) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < this.hitDistance) {
                this.size--;
                this.currentTarget = this.size > 0 ? this.myPromises[this.size - 1] : null;
            }

            if (distance !== 0) {
                const ratio = this.speed / distance;
                this.lastX = this.x;
                this.lastY = this.y;
                this.x += dx * ratio;
                this.y += dy * ratio;
            }
        }
    }
}

class SecondPromiser extends FirstPromiser {
    constructor(x = 1, y = 1, speed = 0.2, isStatic = false) {
        super(x, y, speed, isStatic);
        this.askingRatio = 0.1;
        this.tm = null;
    }

    getColor() {
        switch (this.size) {
            case 0: return 'lightgray';
            case 1: return 'green';
            case 2: return 'cyan';
            case 3: return 'red';
            case 4: return 'orange';
            default: return 'yellow';
        }
    }

    act() {
        if (this.isStatic) return;

        const target = this.currentTarget;
        if (target instanceof Promiser) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < this.hitDistance) {
                this.size--;

                if (Math.random() < this.askingRatio && target instanceof FirstPromiser) {
                    do {
                        this.tm = this.myPromises[Math.floor(Math.random() * this.numPromises)];
                    } while (this.tm === target || this.tm == null);

                    if (target instanceof SecondPromiser) {
                        target.addPromise(this.tm);
                    }
                }

                this.currentTarget = this.size > 0 ? this.myPromises[this.size - 1] : null;
            }

            if (distance !== 0) {
                const ratio = this.speed / distance;
                this.lastX = this.x;
                this.lastY = this.y;
                this.x += dx * ratio;
                this.y += dy * ratio;
            }
        }
    }
}

class SimpleFollowers extends Promiser {
    constructor(x = 1, y = 1, speed = 0.2) {
        super(x, y, speed);
    }
}

class ColoredPromiser extends FirstPromiser {
    constructor(x = 1, y = 1, speed = 0.2, isStatic = false) {
        super(x, y, speed, isStatic);
    }
}

const canvas = document.getElementById('promised-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 768;

let isPainting = true;
let limitPaint = false;
let paintLimit = 100;
let mouseLastX = -1;
let mouseLastY = -1;
let zoom = 1;
let spacepressed = false;
let paused = false;
let dragged = false;
let lineView = true;
let rescreen = true;
let ovalView = false;
let halfsize = 6;

const numPromisers = 10000;
const expansionPixel = 5000;
const center = { x: expansionPixel / 2, y: expansionPixel / 2 };
const speed = 3;
const defaultColor = 'yellow';
const firstRatio = 0.92;

const myPromisers = [];

function fix(num) {
  return Math.floor(num * zoom);
}

function fixX(x) {
  return Math.floor((x - center.x + canvas.width / 2) * zoom);
}

function fixY(y) {
  return Math.floor((y - center.y + canvas.height / 2) * zoom);
}

function makeSecondPromisers(numOfPromises) {
  for (let i = 0; i < numPromisers; i++) {
    const isStatic = Math.random() >= firstRatio;
    const p = new SecondPromiser(Math.random() * expansionPixel, Math.random() * expansionPixel, speed, isStatic);
    myPromisers.push(p);
  }
  for (let i = 0; i < numPromisers; i++) {
    for (let j = 0; j < numOfPromises; j++) {
      const randomIndex = Math.floor(Math.random() * numPromisers);
      myPromisers[i].addPromise(myPromisers[randomIndex]);
    }
  }
}

function act() {
  if (!paused && !spacepressed) {
    for (const p of myPromisers) {
      p.act();
    }
  }
}

function paint() {
  if (rescreen && !spacepressed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (dragged) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dragged = false;
  }

  const limit = limitPaint && paintLimit <= numPromisers ? paintLimit : numPromisers;

  if (lineView) {
    for (let i = 0; i < limit; i++) {
      const p = myPromisers[i];
      ctx.strokeStyle = p instanceof SecondPromiser ? p.getColor() : defaultColor;
      ctx.beginPath();
      ctx.moveTo(fixX(p.lastX), fixY(p.lastY));
      ctx.lineTo(fixX(p.x), fixY(p.y));
      ctx.stroke();
    }
  }

  if (ovalView) {
    for (let i = 0; i < limit; i++) {
      const p = myPromisers[i];
      ctx.fillStyle = (p instanceof FirstPromiser && p.isStatic) ? 'darkgray' : defaultColor;
      ctx.beginPath();
      ctx.ellipse(fixX(p.x), fixY(p.y), halfsize, halfsize, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function loop() {
  act();
  if (isPainting) paint();
  requestAnimationFrame(loop);
}

let isDragging = false;

canvas.addEventListener('mousedown', () => {
  isDragging = true;
  dragged = true;
  paused = true;
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  mouseLastX = -1;
  mouseLastY = -1;
  paused = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const currX = e.offsetX;
  const currY = e.offsetY;

  if (mouseLastX !== -1 && mouseLastY !== -1) {
    center.x += (mouseLastX - currX) / zoom;
    center.y += (mouseLastY - currY) / zoom;
    dragged = true;
  }

  mouseLastX = currX;
  mouseLastY = currY;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoom *= e.deltaY > 0 ? 0.9 : 1.1;
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case ' ': spacepressed = !spacepressed; break;
    case '2': lineView = !lineView; break;
    case '3': ovalView = !ovalView; break;
    case '4': rescreen = !rescreen; break;
    case '5': halfsize++; break;
    case '6': halfsize--; break;
    case 'h': limitPaint = !limitPaint; break;
  }
});

makeSecondPromisers(5);
loop();
