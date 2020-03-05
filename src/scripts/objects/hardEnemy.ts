export class HardEnemy extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    hitpoints: number;
    pointsWorth: number;

    constructor(scene) {
        let x: number = Math.random() * scene.scale.width;
        let y: number = 0;

        super(scene, x, y, "ship3");
        this.hitpoints = 3 + scene.scorePoint/1000;
        this.pointsWorth = 15;
        scene.add.existing(this);

        this.play("ship3_anim");

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 150;

        scene.enemies.add(this);
    }

    update() {
        if(this.y > this.scene.scale.height) {
            this.destroy();
        }
    }
}