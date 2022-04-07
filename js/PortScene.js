const portworld = new Image();
portworld.src = './img/houseworld.png';

const portWorldBg = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: portworld,
});
const portSpeed = 6;

// DRAW EXIT HOUSE BARRIER
const exitPortMap = [];
for (let i = 0; i < exitHouseData.length; i += 70) {
  exitPortMap.push(exitHouseData.slice(i, 70 + i));
}

const exitHouseZone = [];

exitPortMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1) {
      exitHouseZone.push(
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

let portCollision = [];
const portCollisionMap = [];
for (let i = 0; i < portCollision.length; i += 70) {
  portCollisionMap.push(portCollision.slice(i, 70 + i));
}

const boundari = [];

portCollisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 403) {
      boundari.push(
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

// , ...exitHouseZones <---- SET MOVERS BACK IN
const movers = [houseWorldBg, ...boundari];

function animatePort() {
  const portAniID = window.requestAnimationFrame(animateHouse);
  portWorldBg.draw();
  // DRAW PLAYER
  player.draw();

  // DRAW BOUNDARY
  boundari.forEach((boundary) => {
    boundary.draw();
    // test collision with bounds
  });

  // DRAW exit ZONES
  exitHouseZones.forEach((exitZone) => {
    exitZone.draw();
  });

  let mova = true;

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
          window.cancelAnimationFrame(portAniID);
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
                  // animate();
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
              y: boundary.position.y + portSpeed,
            },
          },
        })
      ) {
        mova = false;
        break;
      }
    }

    if (mova) move.forEach((movable) => (movable.position.y += portSpeed));
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
              y: boundary.position.y - portSpeed,
            },
          },
        })
      ) {
        mova = false;
        break;
      }
    }
    if (mova) move.forEach((movable) => (movable.position.y -= portSpeed));
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
              x: boundary.position.x + portSpeed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        mova = false;
        break;
      }
    }
    if (mova) move.forEach((movable) => (movable.position.x += portSpeed));
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
              y: boundary.position.y - portSpeed,
            },
          },
        })
      ) {
        mova = false;
        break;
      }
    }
    if (mova) move.forEach((movable) => (movable.position.x -= portSpeed));
  }
}

// animateHouse();
