export class MediumEnemy extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    hitpoints: number;
    pointsWorth: number;

    constructor(scene) {
        let x: number = Math.random() * scene.scale.width;
        let y: number = 0;

        super(scene, x, y, "ship2");
        this.hitpoints = 2 + scene.scorePoint/1000;
        this.pointsWorth = 10;
        scene.add.existing(this);

        this.play("ship2_anim");

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 100;

        scene.enemies.add(this);
    }

    update() {
        if(this.y > this.scene.scale.height) {
            this.destroy();
        }
    }
}