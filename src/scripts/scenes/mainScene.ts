import ExampleObject from '../objects/exampleObject';
import { Beam } from '../objects/beam';
import { Explosion } from '../objects/explosion';

export default class MainScene extends Phaser.Scene {
  // tilesprites
  private background: Phaser.GameObjects.TileSprite;

  // sprites
  private ship1: Phaser.GameObjects.Sprite;
  private ship2: Phaser.GameObjects.Sprite;
  private ship3: Phaser.GameObjects.Sprite;
  private ship4: Phaser.GameObjects.Sprite;
  private ship5: Phaser.GameObjects.Sprite;
  private ship6: Phaser.GameObjects.Sprite;
  private player: Phaser.Physics.Arcade.Sprite;

  // groups
  private powerUps: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.GameObjects.Group;

  // bitmaptexts
  private scoreLabel: Phaser.GameObjects.BitmapText;
  private scoreMultLabel: Phaser.GameObjects.BitmapText;

  // number
  private score: number;
  private scoreMult: number;

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
    // add sprites
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);
    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");
    this.ship4 = this.add.sprite(0, 0, "ship1");
    this.ship5 = this.add.sprite(0, 0, "ship2");
    this.ship6 = this.add.sprite(0, 0, "ship3");
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.setCollideWorldBounds(true);

    // add bitmapTexts
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16);
    this.scoreMultLabel = this.add.bitmapText(this.scale.width - 100, 5, "pixelFont", "SCORE MULT.", 16);

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
      loop: false,
      delay: 0
    }
    this.music.play(musicConfig);

    // make the score board at the top of the screen
    this.score = 0;
    this.scoreMult = 1;
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

    // add the enemies to the group and activate physics for them
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    this.enemies.add(this.ship4);
    this.enemies.add(this.ship5);
    this.enemies.add(this.ship6);
    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();
    this.ship4.setInteractive();
    this.ship5.setInteractive();
    this.ship6.setInteractive();

    // create a group for the projectiles
    this.projectiles = this.add.group();

    // animate the sprites
    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");
    this.ship4.play("ship1_anim");
    this.ship5.play("ship2_anim");
    this.ship6.play("ship3_anim");
    this.player.play("thrust");


    // create the group of power ups and fill it
    this.powerUps = this.physics.add.group();
    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);
      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }
      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    // create keyboard interaction
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // physics colliders and overlaps
    this.physics.add.collider(this.projectiles, this.powerUps,
      function (projectile, powerUp) {
        projectile.destroy();
      });
    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);
  }

  // Pad the score with zeroes
  zeroPad(number, size) {
    var stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  // interaction functions
  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
    this.pickupSound.play();
    this.scoreMult = this.scoreMult * 2;
  }

  hurtPlayer(player, enemy) {
    this.resetShipPos(enemy);

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
    this.score -= 500;
    this.scoreMult = 1;    
    if(this.score < 0) {
      this.score = 0;
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
    var explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += (10 * this.scoreMult);
    if(this.score !== 0 && this.score % 200 == 0) {
      this.scoreSound.play();
    }
    

    this.explosionSound.play();
  }

// move and reset enemy ships
  moveShip(ship, speed) {
    ship.y += speed;

    if (ship.y > this.scale.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    ship.x = Phaser.Math.Between(0, this.scale.width);
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

  // update function
  update() {
    // scroll background
    this.background.tilePositionY -= 0.5;

    // move enemies
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);
    this.moveShip(this.ship4, 1);
    this.moveShip(this.ship5, 2);
    this.moveShip(this.ship6, 3);

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

    // call the beams' update functions
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }   
  }
}
