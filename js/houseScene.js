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
const movable = [houseWorldBg];
// DRAW BORDERS FOR COLLISIONS

const houseCollisionMap = [];
for (let i = 0; i < houseCollision.length; i += 70) {
  houseCollisionMap.push(houseCollision.slice(i, 70 + i));
}

const boundarie = [];

houseCollisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 480) {
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

function animateHouse() {
  window.requestAnimationFrame(animateHouse);
  houseWorldBg.draw();
  // DRAW PLAYER
  player.draw();
  let moving = true;
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

    if (moving)
      movable.forEach((movable) => (movable.position.y += playersSpeed));
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
    if (moving)
      movable.forEach((movable) => (movable.position.y -= playersSpeed));
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
    if (moving)
      movable.forEach((movable) => (movable.position.x += playersSpeed));
  } else if (keys.d.pressed && lastKey == 'd') {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundarie.length; i++) {
      const boundary = boundarie[i];
      console.log(player.animate);
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

    if (moving)
      movables.forEach((movable) => (movable.position.x -= playersSpeed));
  }
}
