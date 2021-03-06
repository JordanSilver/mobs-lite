class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = {},
    animate = false,
    rotation = 0,
  }) {
    this.position = position;

    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;

    this.rotation = rotation;
  }

  draw() {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();

    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = {},
    animate = false,
    rotation = 0,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }
  npcChat() {
    //  show que-dialog with chat
    console.log('class chat func');
    document.querySelector('#que-diag').style.display = `flex`;
    document.querySelector('#que-diag').innerHTML = ` fainted!`;
  }

  faint() {
    document.querySelector('#que-diag').innerHTML = `${this.name} fainted!`;
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.victory.play();
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#que-diag').style.display = 'flex';
    document.querySelector(
      '#que-diag'
    ).innerHTML = `${this.name} used ${attack.name}!`;
    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;
    let healthBar = '#enemy-hp';
    if (this.isEnemy) healthBar = '#player-hp';

    recipient.health -= attack.dmg;

    switch (attack.name) {
      case 'Tackle':
        const tl = gsap.timeline();
        let mvmtDist = 20;

        if (this.isEnemy) mvmtDist = -30;

        tl.to(this.position, {
          x: this.position.x - mvmtDist,
        })
          .to(this.position, {
            x: this.position.x + mvmtDist * 1.5,
            duration: 0.1,
            // enemy gets hit

            onComplete: () => {
              audio.tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health - attack.dmg + '%',
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case 'Fireball':
        const fireballImg = new Image();
        fireballImg.src = './img/fireball.png';
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImg,
          frames: { max: 4, hold: 10 },
          animate: true,
          rotation,
        });

        renderedSprites.splice(1, 0, fireball);
        audio.initFireball.play();
        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 0.5,
          onComplete: () => {
            audio.fireballHit.play();
            gsap.to(healthBar, {
              width: recipient.health - attack.dmg + '%',
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });
        break;
    }
  }
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = 'rgba(255,0,0,0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
