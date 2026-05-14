import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { Preloader } from './scenes/Preloader';

// Configuração Profissional com Pixel Art Enabled (desliga Anti-Aliasing para Spritesheet)
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1920,
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
        // FIT garante que os 1920x1920 caibam na tela, preservando rigidamente o aspecto.
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
