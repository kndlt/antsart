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

let numPromisers = 10000;
let expansionPixel = 5000;
let center = { x: expansionPixel / 2, y: expansionPixel / 2 };
let speed = 3;
let defaultColor = 'yellow';
let firstRatio = 0.92;

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
  // Clear existing promisers
  myPromisers.length = 0;
  
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
let targetFPS = 30;
let STEP_MS = 1000 / targetFPS;
let lastTime = performance.now();
let accumulator = 0;

function loop(currentTime) { // <-- yes, this must be here
  let delta = currentTime - lastTime;
  if (delta > 1000) delta = STEP_MS;
  lastTime = currentTime;

  accumulator += delta;

  if (accumulator >= STEP_MS) {
    act();
    if (isPainting) paint();
    accumulator -= STEP_MS;
  }

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
    case ' ': spacepressed = !spacepressed; updateURL(); break;
    case '2': lineView = !lineView; updateURL(); break;
    case '3': ovalView = !ovalView; updateURL(); break;
    case '4': rescreen = !rescreen; updateURL(); break;
    case '5': halfsize++; updateURL(); break;
    case '6': halfsize--; updateURL(); break;
    case 'h': limitPaint = !limitPaint; updateURL(); break;
  }
});

// URL Configuration System
function parseHashParams() {
  const hash = window.location.hash.substring(1);
  const params = {};
  
  if (hash) {
    hash.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value !== undefined) {
        // Try to parse as number, boolean, or keep as string
        let parsedValue = decodeURIComponent(value);
        if (parsedValue === 'true') parsedValue = true;
        else if (parsedValue === 'false') parsedValue = false;
        else if (!isNaN(parsedValue)) parsedValue = Number(parsedValue);
        
        params[key] = parsedValue;
      }
    });
  }
  
  return params;
}

function applyConfig(config) {
  // Update global variables based on hash parameters
  if (config.numPromisers !== undefined) numPromisers = Math.max(1, Math.min(50000, config.numPromisers));
  if (config.expansionPixel !== undefined) expansionPixel = Math.max(1000, Math.min(20000, config.expansionPixel));
  if (config.speed !== undefined) speed = Math.max(0.1, Math.min(20, config.speed));
  if (config.firstRatio !== undefined) firstRatio = Math.max(0, Math.min(1, config.firstRatio));
  if (config.halfsize !== undefined) halfsize = Math.max(1, Math.min(50, config.halfsize));
  if (config.zoom !== undefined) zoom = Math.max(0.1, Math.min(10, config.zoom));
  if (config.targetFPS !== undefined) {
    targetFPS = Math.max(1, Math.min(120, config.targetFPS));
    STEP_MS = 1000 / targetFPS;
  }
  if (config.lineView !== undefined) lineView = config.lineView;
  if (config.ovalView !== undefined) ovalView = config.ovalView;
  if (config.rescreen !== undefined) rescreen = config.rescreen;
  if (config.limitPaint !== undefined) limitPaint = config.limitPaint;
  if (config.paintLimit !== undefined) paintLimit = Math.max(1, Math.min(1000, config.paintLimit));
  if (config.spacepressed !== undefined) spacepressed = config.spacepressed;
  
  // Update center based on expansionPixel
  center.x = expansionPixel / 2;
  center.y = expansionPixel / 2;
  
  // Update canvas size if specified
  if (config.width !== undefined) {
    canvas.width = Math.max(200, Math.min(4000, config.width));
  }
  if (config.height !== undefined) {
    canvas.height = Math.max(200, Math.min(4000, config.height));
  }
}

function updateURL() {
  const params = [];
  
  // Only include non-default values
  if (numPromisers !== 10000) params.push(`numPromisers=${numPromisers}`);
  if (expansionPixel !== 5000) params.push(`expansionPixel=${expansionPixel}`);
  if (speed !== 3) params.push(`speed=${speed}`);
  if (firstRatio !== 0.92) params.push(`firstRatio=${firstRatio}`);
  if (halfsize !== 6) params.push(`halfsize=${halfsize}`);
  if (zoom !== 1) params.push(`zoom=${zoom}`);
  if (targetFPS !== 30) params.push(`targetFPS=${targetFPS}`);
  if (!lineView) params.push(`lineView=${lineView}`);
  if (ovalView) params.push(`ovalView=${ovalView}`);
  if (!rescreen) params.push(`rescreen=${rescreen}`);
  if (limitPaint) params.push(`limitPaint=${limitPaint}`);
  if (paintLimit !== 100) params.push(`paintLimit=${paintLimit}`);
  if (spacepressed) params.push(`spacepressed=${spacepressed}`);
  if (canvas.width !== 1024) params.push(`width=${canvas.width}`);
  if (canvas.height !== 768) params.push(`height=${canvas.height}`);
  
  const newHash = params.length > 0 ? '#' + params.join('&') : '';
  
  // Update URL without triggering reload
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, null, newHash);
  }
}

const hashParams = parseHashParams();
applyConfig(hashParams);

// Listen for hash changes
window.addEventListener('hashchange', () => {
  const oldNumPromisers = numPromisers;
  const oldExpansionPixel = expansionPixel;
  const oldSpeed = speed;
  const oldFirstRatio = firstRatio;
  
  const newParams = parseHashParams();
  applyConfig(newParams);
  
  // Regenerate simulation if needed
  const needsRegeneration = 
    newParams.numPromisers !== undefined && newParams.numPromisers !== oldNumPromisers ||
    newParams.expansionPixel !== undefined && newParams.expansionPixel !== oldExpansionPixel ||
    newParams.speed !== undefined && newParams.speed !== oldSpeed ||
    newParams.firstRatio !== undefined && newParams.firstRatio !== oldFirstRatio;
  
  if (needsRegeneration) {
    makeSecondPromisers(5);
  }
});

makeSecondPromisers(5);
requestAnimationFrame(loop);