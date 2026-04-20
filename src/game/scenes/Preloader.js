import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Grafismo básico para tela de Load
        this.cameras.main.setBackgroundColor('#1e293b');
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        const loadingText = this.add.text(centerX, centerY - 50, 'Baixando Arquivos do Mundo...', { font: '20px Courier', fill: '#10b981' }).setOrigin(0.5);
        
        // Progress Bar
        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        progressBox.fillStyle(0x0f172a, 0.8);
        progressBox.fillRoundedRect(centerX - 160, centerY, 320, 20, 10);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x10b981, 1);
            progressBar.fillRoundedRect(centerX - 150, centerY + 5, 300 * value, 10, 5);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        /* ========================================================= */
        /* DEFINIÇÕES FIXAS DOS ARQUIVOS (ARRASte AS FOTOS NA PASTA!) */
        /* ========================================================= */
        
        // 1. O Mapa JSON do Tiled
        // O Phaser tentará buscar na rota de build do vite: public/assets/maps/...
        this.load.tilemapTiledJSON('mapa-tiled', 'assets/maps/mapa-teste.json');

        // 2. O Tileset (A Foto do Chão e das paredes usada no Tiled)
        // OBS: Dentro do seu arquivo Tiled (.json), a propriedade "name" do tileset precisa casar lá 
        // mas aqui pelo menos a foto entra na GPU!
        this.load.image('tiles-cena', 'assets/tilesets/tiles-padrao.png');

        // 3. A Matriz (Spritesheet) do seu personagem andando 32x32px
        this.load.spritesheet('personagem', 'assets/sprites/personagem-base.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        // Caso os arquivos não existam por ele ter esquecido, o phaser continuará para evitar crash da SPA
    }

    create() {
        // Ao finalizar os downloads (mesmo se der falha 404), vai tentar chamar o mundo
        this.scene.start('MainScene');
    }
}
