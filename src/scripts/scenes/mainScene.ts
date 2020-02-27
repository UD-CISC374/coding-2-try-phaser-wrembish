import ExampleObject from '../objects/exampleObject';
import { Beam } from '../objects/beam';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background;
  private ship1;
  private ship2;
  private ship3;
  private powerUps;
  private player;
  private cursorKeys;
  private spacebar;
  private projectiles;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0,
      this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.destroyShip, this);

    this.add.text(20, 20, "Playing game", {
      font: "25px Arial",
      fill: "yellow"
    });

    this.powerUps = this.physics.add.group();
    this.physics.add.collider(this.powerUps, this.powerUps);

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

    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles = this.add.group();

  }

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

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.background.tilePositionY -= 0.5;

    this.movePlayerManager();

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {

      this.shootBeam();
    }
    for(var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  movePlayerManager() {
    if(this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-200);
    } else if(this.cursorKeys.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-200);
    } else if(this.cursorKeys.down.isDown) {

      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }
  }

  shootBeam() {
    var beam = new Beam(this);
  }
}