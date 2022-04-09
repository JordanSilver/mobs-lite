const canvas = document.querySelector('#overworld');
const c = canvas.getContext('2d');

const gameUp = document.querySelector('#game-button-up');
const gameDown = document.querySelector('#game-button-down');
const gameLeft = document.querySelector('#game-button-left');
const gameRight = document.querySelector('#game-button-right');
// find mobile size
const mobile = window.innerWidth < 600;
// set size
// canvas.width = 1024;
// canvas.height = 576;
let offset;
let canvasScale = 1;

if (mobile) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth / 0.9;
  offset = {
    x: -700,
    y: -800,
  };
} else {
  canvasScale = 1.1;
  canvas.width = 1024 * canvasScale;
  canvas.height = 576 * canvasScale;

  offset = {
    x: -450,
    y: -900,
  };
}

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
    if (symbol === 1025 || symbol === 1610613761 || symbol === 1446) {
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
};

const playerSpeed = 6;
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
        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();
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
          audio.Map.stop();
          audio.tackleHit.play();
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

                  audio.House.play();
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
          audio.Map.stop();
          audio.tackleHit.play();
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

                  audio.House.play();
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
// animate();

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
  }
});

// Mobile game pad touch listeners
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
  }
});

let clicked = false;
window.addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});
