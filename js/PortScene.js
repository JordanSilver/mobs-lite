const portworld = new Image();
portworld.src = './img/port-map.png';

const portWorldBg = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: portworld,
});

const portFg = new Image();
portFg.src = './img/port-map-fg.png';

const portFGS = new Sprite({
  position: { x: offset.x, y: offset.y },

  image: portFg,
});

// portfolio NPC
const portNPC = new Image();
portNPC.src = './img/playerTwoDown.png';

const portNPCS = new Monster({
  position: {
    // keep position fixed to background
    x: canvas.width / 4,
    y: canvas.height / 4,

    // x: 329,
    // y: 77.5,
  },
  image: portNPC,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    // up: playerUp,
    // left: playerLeft,
    // right: playerRight,
    down: portNPC,
  },
});

const portArrows = new Image();
portArrows.src = './img/port-arrows.png';

// port map speed
let portSpeed = 7;

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
const enterOne = document.querySelector('#enterBtn-1');
const enterTwo = document.querySelector('#enterBtn-2');
const enterThree = document.querySelector('#enterBtn-3');
const enterFour = document.querySelector('#enterBtn-4');
const pressX = document.querySelectorAll('.press-x');

pressX.forEach((x) => {
  x.addEventListener('touchstart', () => {
    keys.x.pressed = true;
    lastKey = 'x';
  });
  x.addEventListener('touchend', () => {
    keys.x.pressed = false;
  });
});

// DRAW Enter WEB BARRIER
// SPOT ONE
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

// spot one arrow

const arrowOne = new Sprite({
  position: {
    x: enterWebZones[1].position.x + 35,
    y: enterWebZones[1].position.y - 45,
  },
  image: portArrows,
  frames: {
    max: 4,
    hold: 15,
  },
  animate: true,
  sprites: {
    down: portArrows,
  },
});

// SPOT TWO
const enterWebMapTwo = [];
for (let i = 0; i < enterWeb2Data.length; i += 70) {
  enterWebMapTwo.push(enterWeb2Data.slice(i, 70 + i));
}

const enterWebTwoZones = [];

enterWebMapTwo.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      enterWebTwoZones.push(
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

// spot two arrow

const arrowTwo = new Sprite({
  position: {
    x: enterWebTwoZones[1].position.x + 45,
    y: enterWebTwoZones[1].position.y - 45,
  },
  image: portArrows,
  frames: {
    max: 4,
    hold: 15,
  },
  animate: true,
  sprites: {
    down: portArrows,
  },
});

// SPOT Three
const enterWebMapThree = [];
for (let i = 0; i < enterWeb3Data.length; i += 70) {
  enterWebMapThree.push(enterWeb3Data.slice(i, 70 + i));
}

const enterWebThreeZones = [];

enterWebMapThree.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      enterWebThreeZones.push(
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
// spot three arrow
const arrowThree = new Sprite({
  position: {
    x: enterWebThreeZones[0].position.x,
    y: enterWebThreeZones[0].position.y - 45,
  },
  image: portArrows,
  frames: {
    max: 4,
    hold: 15,
  },
  animate: true,
  sprites: {
    down: portArrows,
  },
});

// SPOT Four
const enterWebMapFour = [];
for (let i = 0; i < enterWeb4Data.length; i += 70) {
  enterWebMapFour.push(enterWeb4Data.slice(i, 70 + i));
}

const enterWebFourZones = [];

enterWebMapFour.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      enterWebFourZones.push(
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

// spot four arrow
const arrowFour = new Sprite({
  position: {
    x: enterWebFourZones[0].position.x,
    y: enterWebFourZones[0].position.y - 45,
  },
  image: portArrows,
  frames: {
    max: 4,
    hold: 15,
  },
  animate: true,
  sprites: {
    down: portArrows,
  },
});

// char set
const charSetMap = [];
for (let i = 0; i < portCharSetData.length; i += 70) {
  charSetMap.push(portCharSetData.slice(i, 70 + i));
}

const charSetZones = [];

charSetMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      charSetZones.push(
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

// chat zones
const portNpcMap = [];
for (let i = 0; i < portNPCData.length; i += 70) {
  portNpcMap.push(portNPCData.slice(i, 70 + i));
}

const npcPortChatZones = [];

portNpcMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 393) {
      npcPortChatZones.push(
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

if (mobile || !mobile) {
  portNPCS.position.x = npcPortChatZones[0].position.x;
  portNPCS.position.y = npcPortChatZones[0].position.y;
}

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
  ...enterWebTwoZones,
  ...enterWebThreeZones,
  ...enterWebFourZones,
  portNPCS,
  ...npcPortChatZones,
  portFGS,
  ...charSetZones,
  arrowOne,
  arrowTwo,
  arrowThree,
  arrowFour,
];

let portDialoges = [
  'Welcome to the Portfolio!',

  'Step on the carpets to enter!',
];

function npcPortChat() {
  chat.innerHTML = portDialoges[0];
}

let url;
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;

function animatePort() {
  const portAniID = window.requestAnimationFrame(animatePort);

  portWorldBg.draw();

  portNPCS.draw();

  // DRAW PLAYER
  player.draw();

  // npc chat
  npcPortChatZones.forEach((zone) => {
    zone.draw();
  });

  // DRAW BOUNDARY
  boundari.forEach((boundary) => {
    boundary.draw();
    // test collision with bounds
  });

  // DRAW exit ZONES
  exitPortZones.forEach((exitZone) => {
    exitZone.draw();
  });
  // draw charset zones
  charSetZones.forEach((charSetZone) => {
    charSetZone.draw();
  });
  // DRAW ENTER WEB ZONES
  // ONE
  enterWebZones.forEach((webZone) => {
    webZone.draw();
    if (
      player.position.x > webZone.position.x - 250 &&
      player.position.x < webZone.position.x + 250 &&
      player.position.y > webZone.position.y - 150 &&
      player.position.y < webZone.position.y + 150
    ) {
      arrowOne.draw();
    }
    if (
      player.position.x > webZone.position.x - 75 &&
      player.position.x < webZone.position.x + 75 &&
      player.position.y > webZone.position.y - 75 &&
      player.position.y < webZone.position.y + 75
    ) {
      gsap.to(enterOne, {
        duration: 0.5,
        opacity: 1,
      });
    } else {
      gsap.to(enterOne, {
        duration: 0.5,
        opacity: 0,
      });
    }
  });
  // TWO
  enterWebTwoZones.forEach((webZone) => {
    webZone.draw();
    if (
      player.position.x > webZone.position.x - 250 &&
      player.position.x < webZone.position.x + 250 &&
      player.position.y > webZone.position.y - 150 &&
      player.position.y < webZone.position.y + 150
    ) {
      arrowTwo.draw();
    }
    if (
      player.position.x > webZone.position.x - 75 &&
      player.position.x < webZone.position.x + 75 &&
      player.position.y > webZone.position.y - 75 &&
      player.position.y < webZone.position.y + 75
    ) {
      gsap.to(enterTwo, {
        duration: 0.5,
        opacity: 1,
      });
    } else {
      gsap.to(enterTwo, {
        duration: 0.5,
        opacity: 0,
      });
    }
  });
  // Three
  enterWebThreeZones.forEach((webZone) => {
    webZone.draw();
    if (
      player.position.x > webZone.position.x - 250 &&
      player.position.x < webZone.position.x + 250 &&
      player.position.y > webZone.position.y - 150 &&
      player.position.y < webZone.position.y + 150
    ) {
      arrowThree.draw();
    }
    if (
      player.position.x > webZone.position.x - 75 &&
      player.position.x < webZone.position.x + 75 &&
      player.position.y > webZone.position.y - 75 &&
      player.position.y < webZone.position.y + 75
    ) {
      gsap.to(enterThree, {
        duration: 0.5,
        opacity: 1,
      });
    } else {
      gsap.to(enterThree, {
        duration: 0.5,
        opacity: 0,
      });
    }
  });

  // Four
  enterWebFourZones.forEach((webZone) => {
    webZone.draw();
    if (
      player.position.x > webZone.position.x - 250 &&
      player.position.x < webZone.position.x + 250 &&
      player.position.y > webZone.position.y - 150 &&
      player.position.y < webZone.position.y + 150
    ) {
      arrowFour.draw();
    }
    if (
      player.position.x > webZone.position.x - 75 &&
      player.position.x < webZone.position.x + 75 &&
      player.position.y > webZone.position.y - 75 &&
      player.position.y < webZone.position.y + 75
    ) {
      gsap.to(enterFour, {
        duration: 0.5,
        opacity: 1,
      });
    } else {
      gsap.to(enterFour, {
        duration: 0.5,
        opacity: 0,
      });
    }
  });

  // foreground
  portFGS.draw();

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
                  port = false;
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

  // // NPC ZONE DETECTION & CHAT ACTIVATION
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < npcPortChatZones.length; i++) {
      const npcZone = npcPortChatZones[i];

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
        overlappingArea > (player.width - 100 * player.height - 100) / 2
      ) {
        npcPortChat();

        chatBoxHtml.style.display = 'flex';
      } else {
        chatBoxHtml.style.display = 'none';
      }
    }
  }

  // // WEB ZONE DETECTION
  if (keys.x.pressed) {
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
        if (keys.x.pressed) {
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
                  setTimeout(
                    () => window.open('https://tagpainting.com', params),
                    200
                  );

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
  // // WEB TWO ZONE DETECTION
  if (keys.x.pressed) {
    for (let i = 0; i < enterWebTwoZones.length; i++) {
      const webZone = enterWebTwoZones[i];

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
        if (keys.x.pressed) {
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
                  setTimeout(
                    () =>
                      window.open('https://nxt-crypto.netlify.app/', params),
                    200
                  );

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
  // // WEB THREE ZONE DETECTION

  for (let i = 0; i < enterWebThreeZones.length; i++) {
    const webZone = enterWebThreeZones[i];

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
      overlappingArea > (player.width * player.height) / 16
    ) {
      if (keys.x.pressed) {
        // DEACTIVATE CURRENT ANIMATION LOOP
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
                setTimeout(
                  () => window.open('https://exiva-me.vercel.app/', params),
                  200
                );

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

  // // WEB Four ZONE DETECTION

  for (let i = 0; i < enterWebFourZones.length; i++) {
    const webZone = enterWebFourZones[i];

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

      if (keys.x.pressed) {
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
                setTimeout(
                  () =>
                    window.open(
                      'http://beastmodebattles.herokuapp.com/',
                      params
                    ),
                  200
                );

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
