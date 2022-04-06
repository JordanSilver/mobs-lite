const monsters = {
  Emby: {
    name: 'Emby',
    position: {
      x: 250,
      y: 350,
    },
    image: {
      src: './img/embySprite.png',
    },
    frames: {
      max: 4,
      hold: 20,
    },
    animate: true,
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    name: 'Draggle',
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: './img/draggleSprite.png',
    },
    frames: {
      max: 4,
      hold: 20,
    },
    animate: true,
    isEnemy: true,
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};
