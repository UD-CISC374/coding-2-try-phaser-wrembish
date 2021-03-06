export class EasyEnemy extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    hitpoints: number;
    pointsWorth: number;

    constructor(scene) {
        let x: number = Math.random() * scene.scale.width;
        let y: number = 0;

        super(scene, x, y, "ship1");
        this.hitpoints = 1 + scene.scorePoint/1000;
        this.pointsWorth = 5;
        scene.add.existing(this);

        this.play("ship1_anim");

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 50;

        scene.enemies.add(this);
    }

    update() {
        if(this.y > this.scene.scale.height) {
            this.destroy();
        }
    }
}