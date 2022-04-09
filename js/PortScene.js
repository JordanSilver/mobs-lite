const portworld = new Image();
portworld.src = './img/port-map.png';

const portWorldBg = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: portworld,
});

// port map speed
const portSpeed = 7;

// DRAW EXIT PORT BARRIER
const exitPortMap = [];
for (let i = 0; i < exitPortData.length; i += 70) {
  exitPortMap.push(exitPortData.slice(i, 70 + i));
}

const exitPortZones = [];

exitPortMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      exitPortZones.push(
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

// DRAW Enter WEB BARRIER
const enterWebMap = [];
for (let i = 0; i < enterWebData.length; i += 70) {
  enterWebMap.push(enterWebData.slice(i, 70 + i));
}

const enterWebZones = [];

enterWebMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      enterWebZones.push(
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

const portCollisionMap = [];
for (let i = 0; i < portCollision.length; i += 70) {
  portCollisionMap.push(portCollision.slice(i, 70 + i));
}

const boundari = [];

portCollisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 392) {
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

//
const portMovers = [
  portWorldBg,
  ...boundari,
  ...exitPortZones,
  ...enterWebZones,
];

function animatePort() {
  const portAniID = window.requestAnimationFrame(animatePort);
  portWorldBg.draw();

  // DRAW PLAYER
  player.draw();

  // DRAW BOUNDARY
  boundari.forEach((boundary) => {
    boundary.draw();
    // test collision with bounds
  });

  // DRAW exit ZONES
  exitPortZones.forEach((exitZone) => {
    exitZone.draw();
  });
  // DRAW ENTER WEB ZONES
  enterWebZones.forEach((webZone) => {
    webZone.draw();
  });

  let mova = true;

  player.animate = false;
  player.position = {
    x: player.position.x,
    y: player.position.y,
  };

  // // HOUSE ZONE DETECTION & OVERWORLD ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < exitPortZones.length; i++) {
      const portZone = exitPortZones[i];

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
  let url;

  const playerLocation = () => {
    if (portWorldBg.position.x >= -300 && portWorldBg.position.y >= -650) {
      url = 'https://tagpainting.com';
    } else if (
      portWorldBg.position.x >= -300 &&
      portWorldBg.position.y <= -900
    ) {
      url = 'https://nxt-crypto.netlify.app/';
    }
  };

  playerLocation();
  // // WEB ZONE DETECTION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < enterWebZones.length; i++) {
      const webZone = enterWebZones[i];

      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          webZone.position.x + webZone.width
        ) -
          Math.max(player.position.x, webZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          webZone.position.y + webZone.height
        ) -
          Math.max(player.position.y, webZone.position.y));

      if (
        rectCollision({
          rect1: player,
          rect2: webZone,
        }) &&
        overlappingArea > (player.width * player.height) / 4
      ) {
        // DEACTIVATE CURRENT ANIMATION LOOP
        if (keys.w.pressed) {
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
                  setTimeout(window.open(url, '_blank'), 100);
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

  // moving port with collision detection

  if (keys.w.pressed && lastKey == 'w') {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundari.length; i++) {
      const boundary = boundari[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - player.height / 2 + portSpeed,
            },
          },
        })
      ) {
        mova = false;
        break;
      }
    }

    if (mova)
      portMovers.forEach((movable) => (movable.position.y += portSpeed));
  } else if (keys.s.pressed && lastKey == 's') {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundari.length; i++) {
      const boundary = boundari[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - player.height / 2 - portSpeed,
            },
          },
        })
      ) {
        mova = false;
        break;
      }
    }
    if (mova)
      portMovers.forEach((movable) => (movable.position.y -= portSpeed));
  } else if (keys.a.pressed && lastKey == 'a') {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundari.length; i++) {
      const boundary = boundari[i];
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
    if (mova)
      portMovers.forEach((movable) => (movable.position.x += portSpeed));
  } else if (keys.d.pressed && lastKey == 'd') {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundari.length; i++) {
      const boundary = boundari[i];
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
    if (mova)
      portMovers.forEach((movable) => (movable.position.x -= portSpeed));
  }
}
// animate();
