export class Beam extends Phaser.GameObjects.Sprite{
    body: Phaser.Physics.Arcade.Body;
    constructor(scene){
        let x = scene.player.x;
        let y = scene.player.y;

        super(scene, x, y, "beam");
        scene.projectiles.add(this);
    }
}