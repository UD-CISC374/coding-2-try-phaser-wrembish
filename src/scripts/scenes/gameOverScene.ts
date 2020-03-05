export default class GameOverScene extends Phaser.Scene {
    // TileSprites
    private background: Phaser.GameObjects.TileSprite;

    // BitmapTexts
    private gameOverLabel: Phaser.GameObjects.BitmapText;
    private restartLabel: Phaser.GameObjects.BitmapText;
    private highscoresLabel: Phaser.GameObjects.BitmapText;

    // Keys
    private spacebar: Phaser.Input.Keyboard.Key;

    // Highscore
    private highscore;
    private playerScore;

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

        // get highscore
        if(localStorage.getItem("highscore") == null) {
            this.highscore = '0';
        } else {
            this.highscore = localStorage.getItem("highscore");
        }

        // get players score
        if(localStorage.getItem("yourScore") == null) {
            this.playerScore = '0';
        } else {
            this.playerScore = localStorage.getItem("yourScore");
        }

        // create highscore label
        this.highscoresLabel = this.add.bitmapText(50,100,"pixelFont", "HIGHSCORE");

        // check if new highscore
        if(+this.playerScore > +this.highscore) {
            this.highscore = this.playerScore;
        } 
        
        localStorage.setItem("highscore", this.highscore);
        this.highscoresLabel.text = "YOUR SCORE: " + this.playerScore + "\nHIGHSCORE: " + this.highscore;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.scene.start('MainScene');
        }
    }
}