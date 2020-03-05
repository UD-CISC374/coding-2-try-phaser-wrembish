import { Beam } from '../objects/beam';
import { Explosion } from '../objects/explosion';
import { PowerUp } from '../objects/powerUp';
import { EasyEnemy } from '../objects/easyEnemy';
import { MediumEnemy } from '../objects/meadiumEnemy';
import { HardEnemy } from '../objects/hardEnemy';

export default class MainScene extends Phaser.Scene {
  // tilesprites
  private background: Phaser.GameObjects.TileSprite;

  // sprites
  private player: Phaser.Physics.Arcade.Sprite;

  // groups
  private powerUps: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private projectiles: Phaser.GameObjects.Group;

  // bitmaptexts
  private scoreLabel: Phaser.GameObjects.BitmapText;
  private scoreMultLabel: Phaser.GameObjects.BitmapText;
  private restartLabel: Phaser.GameObjects.BitmapText;

  // number
  private score: number;
  private scoreMult: number;
  private scorePoint: number;

  // sounds
  private beamSound: Phaser.Sound.BaseSound;
  private explosionSound: Phaser.Sound.BaseSound;
  private pickupSound: Phaser.Sound.BaseSound;
  private music: Phaser.Sound.BaseSound;
  private scoreSound: Phaser.Sound.BaseSound;

  // misc
  private cursorKeys;
  private spacebar: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // create the background
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    // add restart option
    this.add.bitmapText(this.scale.width-80,this.scale.height-10,"pixelFont","press r to restart...",10);
    this.input.keyboard.on("keydown_R", this.restart, this);

    // add player sprite
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.setCollideWorldBounds(true);
    this.player.play("thrust");

    // add sounds
    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.pickupSound = this.sound.add("audio_pickup");
    this.scoreSound = this.sound.add("leeroy");
    this.music = this.sound.add("music");

    // configure music and play
    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    this.music.play(musicConfig);

    // make the score board at the top of the screen
    this.score = 0;
    this.scoreMult = 1;
    this.scorePoint = 250;
    // --makes the black rectangle background for the scoreboard--
    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(this.scale.width, 0);
    graphics.lineTo(this.scale.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();
    // add bitmapTexts
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16);
    this.scoreMultLabel = this.add.bitmapText(this.scale.width - 100, 5, "pixelFont", "SCORE MULT.", 16);

    // create a group for the projectiles and powerUps
    this.projectiles = this.add.group();
    this.projectiles.runChildUpdate = true;
    this.powerUps = this.add.group();
    this.powerUps.runChildUpdate = true;
    this.enemies = this.add.group();
    this.enemies.runChildUpdate = true;

    // create keyboard interaction
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // physics overlaps
    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);

    new EasyEnemy(this);
  }

  // Pad the score with zeroes
  zeroPad(number: number, size: number): string {
    var stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  // interaction functions
  pickPowerUp(player, powerUp) {
    powerUp.destroy();
    this.pickupSound.play();
    this.scoreMult++;
  }

  hurtPlayer(player, enemy) {
    enemy.destroy();

    if (this.player.alpha < 1) {
      return;
    }
    var explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });

    this.explosionSound.play();
    this.scoreMult = 1;    
    if(this.scorePoint > 250 && this.score < this.scorePoint/2) {
      this.score = this.scorePoint/2;
    } else if(this.score < 25) {
      this.score = 0;
    } else {
      this.score -= this.scorePoint/10;
    }
  }

  resetPlayer() {
    var x = this.scale.width / 2 - 8;
    var y = this.scale.height + 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: this.player,
      y: this.scale.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: this.resetAlpha,
      callbackScope: this
    });
  }

  resetAlpha() {
    this.player.alpha = 1;
  }

  hitEnemy(projectile, enemy) {
    enemy.hitpoints -= (1 + this.scoreMult/10);
    if(enemy.hitpoints > 0) {
      projectile.destroy();
      return;
    }
    var explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    enemy.destroy();
    this.score += (enemy.pointsWorth * this.scoreMult);
    if(this.score > this.scorePoint) {
      this.scoreSound.play();
      this.scorePoint = this.scorePoint * 2;
    }
    

    this.explosionSound.play();
  }

  // move player
  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursorKeys.down.isDown) {

      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }
  }

  // shoot beam
  shootBeam() {
    var beam = new Beam(this);
    this.beamSound.play();
  }

  restart() {
    this.score=0;
    this.scoreMult=1;
    this.scorePoint=250;
    this.enemies.clear(true,true);
    this.projectiles.clear(true,true);
    this.powerUps.clear(true,true);
  }

  // update function
  update() {
    // scroll background
    this.background.tilePositionY -= 0.5;

    // move player
    this.movePlayerManager();

    // update score and multiplier
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
    this.scoreMultLabel.text = "SCORE MULT.: " + this.scoreMult;

    // shoot beams when space is pressed
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shootBeam();
      }
    }
    
    // randomly generate powerups
    if(Math.random() > 0.997) {
      this.addPowerUp();
    }

    // randomly generate enemies
    if(Math.random() > 0.95) {
      let enemyType: number = Math.random();
      if(enemyType > 0.7) {
        this.addEnemy(3);
      } else if(enemyType > 0.4) {
        this.addEnemy(2);
      } else {
        this.addEnemy(1);
      }
    }
  }

  addPowerUp() {
    let powerUp = new PowerUp(this);
  }

  addEnemy(enemyType) {
    if(enemyType === 3) {
      let newEnemy = new HardEnemy(this);
    } else if(enemyType === 2) {
      let newEnemy = new MediumEnemy(this);
    } else {
      let newEnemy = new EasyEnemy(this);
    }
    
  }
}