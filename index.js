const canvas = document.querySelector('#overworld');
const c = canvas.getContext('2d');

const gameUp = document.querySelector('#game-button-up');
const gameDown = document.querySelector('#game-button-down');
const gameLeft = document.querySelector('#game-button-left');
const gameRight = document.querySelector('#game-button-right');

let muted = false;

// find mobile size
const mobile = window.innerWidth < 1258;
// set size
// canvas.width = 1024;
// canvas.height = 576;
let offset;
let canvasScale = 1;
let playerSpeed = 6;
if (mobile) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
} else {
  canvasScale = 1.1;
  canvas.width = 1024 * canvasScale;
  canvas.height = 576 * canvasScale;
}
offset = {
  x: -500,
  y: -400,
};
// resize window event listener for canvas resize
window.addEventListener('resize', () => {
  if (mobile) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth / 0.9;
  } else {
    canvas.width = 1024 * canvasScale;
    canvas.height = 576 * canvasScale;
  }

  draw();
});

// "STATE"
let port = false;

// DRAW BATTLE ZONES

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1026) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// DRAW ENTER port BARRIER
const enterPortMap = [];
for (let i = 0; i < enterPortData.length; i += 70) {
  enterPortMap.push(enterPortData.slice(i, 70 + i));
}

const portZones = [];

enterPortMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1445) {
      portZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// DRAW ENTER HOUSE BARRIER
const enterHouseMap = [];
for (let i = 0; i < enterHouseData.length; i += 70) {
  enterHouseMap.push(enterHouseData.slice(i, 70 + i));
}

const houseZones = [];

enterHouseMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1447) {
      houseZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// DRAW BORDERS FOR COLLISIONS

const collisionsMap = [];
for (let i = 0; i < collision.length; i += 70) {
  collisionsMap.push(collision.slice(i, 70 + i));
}

const boundaries = [];

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025 || symbol === 1446) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// draw overworld
const overworld = new Image();
overworld.src = './img/overworld.png';

const overWorld = new Sprite({
  position: { x: offset.x, y: offset.y },

  image: overworld,
});

const foreground = new Image();
foreground.src = './img/overworld-fg.png';

const overWorldFG = new Sprite({
  position: { x: offset.x, y: offset.y },

  image: foreground,
});

// draw player

const playerUp = new Image();
playerUp.src = './img/playerUp.png';

const playerLeft = new Image();
playerLeft.src = './img/playerLeft.png';

const playerRight = new Image();
playerRight.src = './img/playerRight.png';

const playerDown = new Image();
playerDown.src = './img/playerDown.png';

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDown,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUp,
    left: playerLeft,
    right: playerRight,
    down: playerDown,
  },
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  x: {
    pressed: false,
  },
};

const movables = [
  overWorld,
  ...boundaries,
  overWorldFG,
  ...battleZones,
  ...houseZones,
  ...portZones,
];

function rectCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y <= rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height >= rect2.position.y
  );
}

const battle = {
  initiated: false,
};

// !!!!!!!!!!!! ANIMATION RENDERER !!!!!!!!!!!!! \\
function animate() {
  const animationID = window.requestAnimationFrame(animate);
  document.querySelector('#game-btn').style.display = 'flex';
  // DRAW OVERWORLD
  overWorld.draw();
  // DRAW BOUNDARY
  boundaries.forEach((boundary) => {
    boundary.draw();
    // test collision with bounds
  });
  // DRAW BATTLE ZONES
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  // DRAW ENTER HOUSE ZONE
  houseZones.forEach((houseZone) => {
    houseZone.draw();
  });
  // DRAW ENTER HOUSE ZONE
  portZones.forEach((portZone) => {
    portZone.draw();
  });
  // DRAW PLAYER
  player.draw();

  // DRAW FOREGROUND
  overWorldFG.draw();
  let moving = true;
  player.animate = false;

  if (battle.initiated) return;
  // BATTLE ZONE DETECTION & BATTLE ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];

      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectCollision({
          rect1: player,
          rect2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        // make it random
        Math.random() < 0.05
      ) {
        // DEACTIVATE CURRENT ANIMATION LOOP
        window.cancelAnimationFrame(animationID);
        document.querySelector('#game-btn').style.display = 'none';
        audio.Walking.stop();
        if (!muted) {
          audio.initBattle.play();
          audio.battle.play();
        }
        battle.initiated = true;
        gsap.to('#transition', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to('#transition', {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                // ACTIVE NEW ANIMATION LOOP
                initBattle();
                animateBattle();
                gsap.to('#transition', {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  // // HOUSE ZONE DETECTION & HOUSE ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < houseZones.length; i++) {
      const houseZone = houseZones[i];

      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          houseZone.position.x + houseZone.width
        ) -
          Math.max(player.position.x, houseZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          houseZone.position.y + houseZone.height
        ) -
          Math.max(player.position.y, houseZone.position.y));

      if (
        rectCollision({
          rect1: player,
          rect2: houseZone,
        }) &&
        overlappingArea > (player.width * player.height) / 4
      ) {
        // DEACTIVATE CURRENT ANIMATION LOOP
        if (keys.w.pressed) {
          window.cancelAnimationFrame(animationID);
          audio.Title.stop();
          if (!muted) audio.tackleHit.play();
          gsap.to('#transition', {
            opacity: 1,
            repeat: 1,
            yoyo: true,
            duration: 0.2,
            onComplete() {
              gsap.to('#transition', {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                  // ACTIVE NEW ANIMATION LOOP
                  if (!muted) audio.House.play();

                  animateHouse();
                  gsap.to('#transition', {
                    opacity: 0,
                    duration: 0.4,
                  });
                },
              });
            },
          });
        }

        break;
      }
    }
  }
  // // PORT ZONE DETECTION & HOUSE ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < portZones.length; i++) {
      const portZone = portZones[i];

      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          portZone.position.x + portZone.width
        ) -
          Math.max(player.position.x, portZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          portZone.position.y + portZone.height
        ) -
          Math.max(player.position.y, portZone.position.y));

      if (
        rectCollision({
          rect1: player,
          rect2: portZone,
        }) &&
        overlappingArea > (player.width * player.height) / 4
      ) {
        // DEACTIVATE CURRENT ANIMATION LOOP
        if (keys.w.pressed) {
          window.cancelAnimationFrame(animationID);
          audio.Title.stop();
          if (!muted) audio.tackleHit.play();
          gsap.to('#transition', {
            opacity: 1,
            repeat: 1,
            yoyo: true,
            duration: 0.2,
            onComplete() {
              gsap.to('#transition', {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                  // ACTIVE NEW ANIMATION LOOP
                  port = true;
                  if (!muted) audio.House.play();
                  animatePort();
                  gsap.to('#transition', {
                    opacity: 0,
                    duration: 0.4,
                  });
                },
              });
            },
          });
        }

        break;
      }
    }
  }

  // !!!!!!! MOVE MAP AND BOUNDARYS WITH COLLISION DETECTION

  if (keys.w.pressed && lastKey == 'w') {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + playerSpeed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => (movable.position.y += playerSpeed));
  } else if (keys.s.pressed && lastKey == 's') {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - playerSpeed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => (movable.position.y -= playerSpeed));
  } else if (keys.a.pressed && lastKey == 'a') {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + playerSpeed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => (movable.position.x += playerSpeed));
  } else if (keys.d.pressed && lastKey == 'd') {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - playerSpeed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => (movable.position.x -= playerSpeed));
  }
}

const tapStart = document.querySelector('#tap-start');
const startBtn = document.querySelector('#start-btn');
const loading = document.querySelector('#loading');
const startHud = document.querySelector('#start-hud');
const optionsScreen = document.querySelector('#options-screen');
const audioBtn = document.querySelector('#audio-btn');
const optionsBtn = document.querySelector('#options-btn');
const closeOpts = document.querySelector('#close-opts');
const typeEffect = document.querySelector('#type-effect-loading');
const startImg = document.querySelector('#start-hero');
const introShowcase = document.querySelector('#intro-showcase');
const swipeToMove = document.querySelector('.swipe-to-move');
const introHero = document.querySelector('#intro-hero');

let clicked = false;

window.addEventListener('click', () => {
  if (!clicked) {
    audio.Title.play();

    gsap.to(startImg, {
      opacity: 1,
      duration: 0.4,
    });
    clicked = true;
  }
});
audioBtn.classList.add('bi');
audioBtn.classList.add('bi-speaker');
optionsBtn.classList.add('bi');
optionsBtn.classList.add('bi-info-circle');
closeOpts.classList.add('bi');
closeOpts.classList.add('bi-gear');

gsap.to(optionsBtn, {
  // bounce
  opacity: 1,
  duration: 0.6,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut',
});

let tl = gsap.timeline({
  delay: 0.5,
  paused: false, // default is false
  repeat: -1, // number of repeats (-1 for infinite)
  repeatRefresh: false, // invalidates on each repeat
  yoyo: false, // if true > A-B-B-A, if false > A-B-A-B
});

const swipeToMoveAni = () => {
  tl.to(swipeToMove, { duration: 0.4, x: 0, y: -75 })
    .to(swipeToMove, { duration: 0.4, x: 0, y: 0 })
    .to(swipeToMove, { duration: 0.4, x: -75, y: 0 })
    .to(swipeToMove, { duration: 0.4, x: 0, y: 0 })
    .to(swipeToMove, { duration: 0.4, x: 0, y: 75 })
    .to(swipeToMove, { duration: 0.4, x: 0, y: 0 })
    .to(swipeToMove, { duration: 0.4, x: 75, y: 0 })
    .to(swipeToMove, { duration: 0.4, x: 0, y: 0 });
};

optionsBtn.addEventListener('click', () => {
  gsap.to(optionsBtn, {
    scale: 0.8,
    duration: 0.2,
    onComplete() {
      gsap.to(optionsBtn, {
        scale: 1.2,
        duration: 0.1,
        onComplete() {
          gsap.to(optionsBtn, {
            scale: 1,
            duration: 0.1,
          });
          gsap.to(optionsScreen, {
            opacity: 1,
            transform: 'translateY(0)',
            duration: 0.4,
            onComplete() {
              gsap.to(introShowcase, {
                opacity: 1,
                translateY: 200,
                duration: 0.4,
                onComplete() {
                  swipeToMoveAni();
                },
              });
            },
          });
        },
      });
    },
  });
});
closeOpts.addEventListener('click', () => {
  gsap.to(closeOpts, {
    scale: 0.8,
    duration: 0.2,
    onComplete() {
      gsap.to(closeOpts, {
        scale: 1.2,
        duration: 0.1,
        onComplete() {
          gsap.to(closeOpts, {
            scale: 1,
            duration: 0.1,
            onComplete() {
              gsap.to(optionsScreen, {
                opacity: 0,
                transform: 'translateY(-100%)',
                duration: 0.4,
              });
            },
          });
        },
      });
    },
  });
});

audioBtn.addEventListener('click', () => {
  // disable audio if audio button
  muted = !muted;
  if (muted) {
    audio.Title.stop();
    audioBtn.classList.remove('bi-speaker');
    audioBtn.classList.add('bi-speaker-fill');
    gsap.to(audioBtn, {
      duration: 0.1,
      scale: 0.8,
      onComplete() {
        gsap.to(audioBtn, {
          duration: 0.1,
          scale: 1,
        });
      },
    });
  } else {
    audio.Title.play();
    audioBtn.classList.remove('bi-speaker-fill');
    audioBtn.classList.add('bi-speaker');
    gsap.to(audioBtn, {
      duration: 0.1,
      scale: 0.8,
      onComplete() {
        gsap.to(audioBtn, {
          duration: 0.1,
          scale: 1,
        });
      },
    });
  }
});

introShowcase.addEventListener('click', () => {
  gsap.to(introShowcase, {
    opacity: 0,
    translateY: -100,
    duration: 0.4,
  });
  gsap.to(optionsScreen, {
    opacity: 0,
    transform: 'translateY(-100%)',
    duration: 0.4,
  });
});

// typewriter effect for typeEffect
const typeEffectText = typeEffect.innerHTML;
let typeEffectIndex = 0;

const typeEffectInterval = setInterval(() => {
  typeEffect.innerHTML = typeEffectText.slice(0, typeEffectIndex++);
  if (typeEffectIndex > typeEffectText.length) {
    clearInterval(typeEffectInterval);
  }
}, 200);

// Flash tap-start text on screen if !clicked
let tapStartTimer = setInterval(() => {
  if (!clicked) {
    tapStart.style.opacity = 1;
    setTimeout(() => {
      tapStart.style.opacity = 0;
    }, 500);
  } else {
    clearInterval(tapStartTimer);
    gsap.to(startHud, {
      translateY: '0%',
      duration: 0.4,
      opacity: 1,
    });
    gsap.to(optionsBtn, {
      translateY: '0%',
      duration: 0.4,
      opacity: 1,
    });
  }
}, 1000);

// start screen with click to start animate
function startScreen() {
  gsap.to('#start-screen', {
    opacity: 1,
    duration: 0.5,
    onComplete() {
      gsap.to('#start-screen', {
        opacity: 0,
        duration: 0.5,
        onComplete() {
          //  THIS ANIMATE STARTS THE GAME \\

          // animate();

          animatePort();

          document.querySelector('#start-screen').style.display = 'none';
        },
      });
    },
  });
}
// addevent listener for tap or click to start

tapStart.innerHTML = 'Tap to start.';
tapStart.style.fontSize = '1.5rem';
tapStart.style.cursor = 'pointer';
startBtn.style.display = 'block';
startBtn.innerHTML = 'Enter';
startBtn.addEventListener('click', startScreen);
// startBtn.addEventListener('touchstart', startScreen);

gsap.to('#progress-bar', {
  width: '0',
  ariaValueNow: '0%',
  duration: 0,

  onComplete() {
    gsap.to('#progress-bar', {
      width: '100%',
      ariaValueNow: '100%',
      duration: 2,
      onComplete() {
        setTimeout(() => {
          gsap.to('#loading', {
            opacity: 0,
            duration: 0.5,
            onComplete() {
              loading.style.display = 'none';
            },
          });
        }, 1000);
      },
    });
  },
});

// Event Listeners
let lastKey = '';
window.addEventListener('keydown', (e) => {
  // switch case for wsad movement
  switch (e.key) {
    case 'w':
      keys.w = {
        pressed: true,
      };
      lastKey = 'w';
      break;
    case 's':
      keys.s = {
        pressed: true,
      };
      lastKey = 's';
      break;
    case 'a':
      keys.a = {
        pressed: true,
      };
      lastKey = 'a';
      break;
    case 'd':
      keys.d = {
        pressed: true,
      };
      lastKey = 'd';
      break;
    case 'x':
      keys.x = {
        pressed: true,
      };
      lastKey = 'x';
      break;
    // arrow keys
    case 'ArrowUp':
      keys.w = {
        pressed: true,
      };
      lastKey = 'w';
      break;
    case 'ArrowDown':
      keys.s = {
        pressed: true,
      };
      lastKey = 's';
      break;
    case 'ArrowLeft':
      keys.a = {
        pressed: true,
      };
      lastKey = 'a';
      break;
    case 'ArrowRight':
      keys.d = {
        pressed: true,
      };
      lastKey = 'd';
      break;
  }
});

// Mobile game pad touch listeners

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* right swipe */

      keys.a = {
        pressed: true,
      };
      lastKey = 'a';
    } else {
      /* left swipe */
      keys.d = {
        pressed: true,
      };
      lastKey = 'd';
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      keys.w = {
        pressed: true,
      };
      lastKey = 'w';
    } else {
      /* up swipe */
      keys.s = {
        pressed: true,
      };
      lastKey = 's';
    }
  }
  /* reset values */

  xDown = null;
  yDown = null;
}

// handle touch end
document.addEventListener('touchend', handleTouchEnd, false);

function handleTouchEnd(evt) {
  keys.w = {
    pressed: false,
  };
  keys.s = {
    pressed: false,
  };
  keys.a = {
    pressed: false,
  };
  keys.d = {
    pressed: false,
  };
  keys.x = {
    pressed: false,
  };
}

gameLeft.addEventListener('touchstart', () => {
  keys.a.pressed = true;
  lastKey = 'a';
});
gameLeft.addEventListener('touchend', () => {
  keys.a.pressed = false;
});
gameRight.addEventListener('touchstart', () => {
  keys.d.pressed = true;
  lastKey = 'd';
});
gameRight.addEventListener('touchend', () => {
  keys.d.pressed = false;
});
gameUp.addEventListener('touchstart', () => {
  keys.w.pressed = true;
  lastKey = 'w';
});
gameUp.addEventListener('touchend', () => {
  keys.w.pressed = false;
});
gameDown.addEventListener('touchstart', () => {
  keys.s.pressed = true;
  lastKey = 's';
});
gameDown.addEventListener('touchend', () => {
  keys.s.pressed = false;
});

// key up
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w = {
        pressed: false,
      };
      break;
    case 's':
      keys.s = {
        pressed: false,
      };
      break;
    case 'a':
      keys.a = {
        pressed: false,
      };
      break;
    case 'd':
      keys.d = {
        pressed: false,
      };
      break;
    case 'x':
      keys.x = {
        pressed: false,
      };
    // arrow keys
    case 'ArrowUp':
      keys.w = {
        pressed: false,
      };
      break;
    case 'ArrowDown':
      keys.s = {
        pressed: false,
      };
      break;
    case 'ArrowLeft':
      keys.a = {
        pressed: false,
      };
      break;
    case 'ArrowRight':
      keys.d = {
        pressed: false,
      };
      break;
  }
});
