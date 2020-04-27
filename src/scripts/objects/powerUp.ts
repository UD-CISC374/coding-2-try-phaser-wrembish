export class PowerUp extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    
    constructor(scene) {
        let x: number = Math.random() * scene.scale.width;
        let y: number = 30;

        super(scene, x, y, "power-up");
        scene.add.existing(this);

        if (Math.random() > 0.5) {
            this.play("red");
        } else {
            this.play("gray");
        }

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 100;

        scene.powerUps.add(this);
    }

    update() {
        if(this.y > this.scene.scale.height) {
            this.destroy();
        }
    }
}