import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { Preloader } from './scenes/Preloader';

// Configuração Profissional com Pixel Art Enabled (desliga Anti-Aliasing para Spritesheet)
const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: 'game-container', // a ID da div no React
    backgroundColor: '#0f172a',
    pixelArt: true, // Essencial para STardew Valley / Tiled
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Jogo Isometrico não tem gravidade vertical para cair buracos
            debug: false
        }
    },
    scale: {
        // RESIZE garante que o WebGL interno sempre tenha a resolução real da div (1:1), 
        // prevenindo que o CSS "estique" o canvas e cause a ilusão de offset ou distorção.
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container'
    },
    scene: [
        Preloader,
        MainScene
    ]
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
