import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import GameOverScene from './scenes/gameOverScene';
import GameConfig = Phaser.Types.Core.GameConfig;

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

const config: GameConfig = {
    backgroundColor: '#0',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 256,
        height: 272
    },
    scene: [PreloadScene, MainScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};

window.addEventListener('load', () => {
    window['game'] = new Phaser.Game(config);
});

//
