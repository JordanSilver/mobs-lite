const battleBgImg = new Image();
battleBgImg.src = './img/battleBackground.png';

// find mobile size

if (mobile) battleBgImg.width = window.innerWidth;

const batttleBg = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBgImg,
});

// DRAW ENEMY SPRITES

let draggle;
let emby;
let renderedSprites;
let que;
let battleAnimationId;
// !!! BATTLE ANIMATION LOOP !!!! \\

function initBattle() {
  document.querySelector('#hud').style.display = 'flex';
  document.querySelector('#que-diag').style.display = 'none';
  document.querySelector('#enemy-hp').style.width = '100%';
  document.querySelector('#player-hp').style.width = '100%';
  document.querySelector('#attack-btn').replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  que = [];
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerText = attack.name;
    document.querySelector('#attack-btn').append(button);
  });
  // attack btn event listeners
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });
      if (draggle.health <= 0) {
        que.push(() => {
          draggle.faint();
        });
        que.push(() => {
          // fade to black
          gsap.to('#transition', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector('#hud').style.display = 'none';
              gsap.to('#transition', {
                opacity: 0,
              });
              battle.initiated = false;
              audio.battle.stop();
              audio.Map.play();
            },
          });
        });
      }
      const randomAtk =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      que.push(() => {
        draggle.attack({
          attack: randomAtk,
          recipient: emby,
          renderedSprites,
        });
      });
      if (emby.health <= 0 + 5) {
        que.push(() => {
          emby.faint();
        });
        que.push(() => {
          // fade to black
          gsap.to('#transition', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector('#hud').style.display = 'none';
              gsap.to('#transition', {
                opacity: 0,
              });
              battle.initiated = false;
              audio.battle.stop();
              audio.Map.play();
            },
          });
        });
      }
    });
    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector('#attack-type').innerHTML = selectedAttack.type;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  batttleBg.draw();

  renderedSprites.forEach((sprite) => sprite.draw());
}

animate();
// initBattle();
// animateBattle();

document.querySelector('#que-diag').addEventListener('click', (e) => {
  if (que.length > 0) {
    que[0]();
    que.shift();
  } else e.currentTarget.style.display = 'none';
});
