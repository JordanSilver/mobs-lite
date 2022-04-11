const houseworld = new Image();
houseworld.src = './img/houseworld.png';

const houseWorldBg = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: houseworld,
});

const houseNPC = new Image();
houseNPC.src = './img/playerDown.png';

const houseNPCS = new Sprite({
  position: {
    // keep position fixed to background
    x: -offset.x / 2 - houseNPC.width / 2 + 375,
    y: -offset.y / 2 - houseNPC.height / 2 - 490,

    // x: 329,
    // y: 77.5,
  },
  image: houseNPC,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    // up: playerUp,
    // left: playerLeft,
    // right: playerRight,
    down: houseNPC,
  },
});
if (mobile) {
  houseNPCS.position.x = -offset.x / 2 - houseNPC.width / 2;
  houseNPCS.position.y = -offset.y / 2 - houseNPC.height / 2 - 375;
}

let playersSpeed = 6;
let npcQue;
console.log(houseNPCS);
// DRAW EXIT HOUSE BARRIER
const exitHouseMap = [];
for (let i = 0; i < exitHouseData.length; i += 70) {
  exitHouseMap.push(exitHouseData.slice(i, 70 + i));
}

const exitHouseZones = [];

exitHouseMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1) {
      exitHouseZones.push(
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

const houseCollisionMap = [];
for (let i = 0; i < houseCollision.length; i += 70) {
  houseCollisionMap.push(houseCollision.slice(i, 70 + i));
}

const boundarie = [];

houseCollisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 403) {
      boundarie.push(
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

// DRAW NPC CHATS
const npcCollisionMap = [];
for (let i = 0; i < npcChatData.length; i += 70) {
  npcCollisionMap.push(npcChatData.slice(i, 70 + i));
}

const npcChatZones = [];

npcCollisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1) {
      npcChatZones.push(
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

const move = [
  houseWorldBg,
  ...boundarie,
  ...exitHouseZones,
  houseNPCS,
  ...npcChatZones,
];

player.position = {
  x: player.position.x,
  y: player.position.y,
};

function animateHouse() {
  const houseAniID = window.requestAnimationFrame(animateHouse);
  houseWorldBg.draw();

  // DRAW NPCS
  houseNPCS.draw();

  // DRAW PLAYER
  player.draw();

  // DRAW BOUNDARY
  boundarie.forEach((boundary) => {
    boundary.draw();
    // test collision with bounds
  });

  // DRAW exit ZONES
  exitHouseZones.forEach((exitZone) => {
    exitZone.draw();
  });
  // DRAW NPC ZONES
  npcChatZones.forEach((npcZone) => {
    npcZone.draw();
  });
  npcQue = [];
  let moving = true;

  player.animate = false;
  player.position = {
    x: player.position.x,
    y: player.position.y,
  };

  // // HOUSE ZONE DETECTION & OVERWORLD ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < exitHouseZones.length; i++) {
      const houseZone = exitHouseZones[i];

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
        if (keys.s.pressed) {
          window.cancelAnimationFrame(houseAniID);
          audio.tackleHit.play();
          audio.Map.play();
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
                  audio.House.stop();
                  animate();
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
  // // NPC ZONE DETECTION & QUE ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < npcChatZones.length; i++) {
      const npcZone = npcChatZones[i];

      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          npcZone.position.x + npcZone.width
        ) -
          Math.max(player.position.x, npcZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          npcZone.position.y + npcZone.height
        ) -
          Math.max(player.position.y, npcZone.position.y));

      if (
        rectCollision({
          rect1: player,
          rect2: npcZone,
        }) &&
        overlappingArea > (player.width * player.height) / 4
      ) {
        // DEACTIVATE CURRENT ANIMATION LOOP
        if (keys.w.pressed) {
          console.log('npc chatting');
          npcQue.push(() => {
            npcQue.npcChat();
          });
        }
      }
    }
  }

  // moving house with collision detection

  if (keys.w.pressed && lastKey == 'w') {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundarie.length; i++) {
      const boundary = boundarie[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + playersSpeed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) move.forEach((movable) => (movable.position.y += playersSpeed));
  } else if (keys.s.pressed && lastKey == 's') {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundarie.length; i++) {
      const boundary = boundarie[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - playersSpeed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) move.forEach((movable) => (movable.position.y -= playersSpeed));
  } else if (keys.a.pressed && lastKey == 'a') {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundarie.length; i++) {
      const boundary = boundarie[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + playersSpeed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) move.forEach((movable) => (movable.position.x += playersSpeed));
  } else if (keys.d.pressed && lastKey == 'd') {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundarie.length; i++) {
      const boundary = boundarie[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - playersSpeed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) move.forEach((movable) => (movable.position.x -= playersSpeed));
  }
}

document.querySelector('#que-diag').addEventListener('click', (e) => {
  if (npcQue.length > 0) {
    npcQue[0]();
    npcQue.shift();
  } else e.currentTarget.style.display = 'none';
});
console.log(npcQue);
// animateHouse();
