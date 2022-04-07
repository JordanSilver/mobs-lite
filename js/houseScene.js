const houseworld = new Image();
houseworld.src = './img/houseworld.png';

const houseWorldBg = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: houseworld,
});
const playersSpeed = 6;

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

const move = [houseWorldBg, ...boundarie, ...exitHouseZones];

function animateHouse() {
  const houseAniID = window.requestAnimationFrame(animateHouse);
  houseWorldBg.draw();
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

  let moving = true;

  player.animate = false;

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
        overlappingArea > (player.width * player.height) / 2
      )
        if (
          rectCollision({
            rect1: player,
            rect2: houseZone,
          }) &&
          overlappingArea > (player.width * player.height) / 2
          // && Math.random() < 0.5
        ) {
          // DEACTIVATE CURRENT ANIMATION LOOP
          if (keys.s.pressed && lastKey == 's') {
            window.cancelAnimationFrame(houseAniID);
            audio.tackleHit.play();

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

// animateHouse();
