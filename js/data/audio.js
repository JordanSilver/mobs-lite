const audio = {
  Map: new Howl({
    src: './audio/map.wav',
    html5: true,
    volume: 0.05,
    loop: true,
  }),
  House: new Howl({
    src: './audio/houseMusic.wav',
    html5: true,
    volume: 0.05,
  }),
  initBattle: new Howl({
    src: './audio/initBattle.wav',
    html5: true,
    volume: 0.04,
  }),
  battle: new Howl({
    src: './audio/battle.mp3',
    html5: true,
    volume: 0.04,
  }),
  initFireball: new Howl({
    src: './audio/initFireball.wav',
    html5: true,
    volume: 0.09,
  }),
  fireballHit: new Howl({
    src: './audio/fireballHit.wav',
    html5: true,
    volume: 0.07,
  }),
  tackleHit: new Howl({
    src: './audio/tackleHit.wav',
    html5: true,
    volume: 0.05,
  }),
  victory: new Howl({
    src: './audio/victory.wav',
    html5: true,
    volume: 0.09,
  }),
};
