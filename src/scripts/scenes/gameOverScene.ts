export default class GameOverScene extends Phaser.Scene {
    // TileSprites
    private background: Phaser.GameObjects.TileSprite;

    // BitmapTexts
    private gameOverLabel: Phaser.GameObjects.BitmapText;
    private restartLabel: Phaser.GameObjects.BitmapText;

    // Keys
    private spacebar: Phaser.Input.Keyboard.Key;

    constructor() {
        super({ key: 'GameOverScene' })
    }

    create() {
        // create the background
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
        this.background.setOrigin(0, 0);

        // create bitmapTexts
        this.gameOverLabel = this.add.bitmapText(10, 5, "pixelFont", "GAME OVER", 20);
        this.restartLabel = this.add.bitmapText(10, 20, "pixelFont", "press spacebar to play again...", 12);

        // add spacebar interaction
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.scene.start('MainScene');
        }
    }
}