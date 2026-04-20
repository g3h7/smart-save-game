import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainScene extends Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#1e293b');

        // ==== SETUP DO MAPA TILED ====
        let isMapLoaded = false;
        
        // Verifica silenciosamente se o Phaser conseguiu colocar o Json na memória 
        // (Isso impede que o jogo quebre caso você ainda não tenha arrastado seu arquivo pra public/assets/maps)
        if (this.cache.tilemap.has('mapa-tiled') && this.textures.exists('tiles-cena')) {
            try {
                // Cria a instância do mapa lendo do cache
                const map = this.make.tilemap({ key: 'mapa-tiled' });
                
                // O nome 'TilesetPai' abaixo precisa ser o nome IDÊNTICO que vc deu no software Tiled pro tileset associado.
                // Vou setar um genérico, se ficar preto quando vc pôr a foto, teremos que checar o nome exato do seu arquivo Tiled!
                // O segundo parametro 'tiles-cena' é a foto `.png` que mandei baixar lá no Preloader.
                const tileset = map.addTilesetImage(map.tilesets[0]?.name || 'default_tileset_name', 'tiles-cena');
                
                // Monta a Layer padrão 0 do mapa (Background)
                map.createLayer(0, tileset, 0, 0); 

                isMapLoaded = true;
            } catch (err) {
                 console.warn("Tiled Map detectado, mas não conseguiu parear o nome da Camada. Renderizando de forma crua...");
            }
        }

        // Se o seu mapa não for lido ou arrastado, renderiza nosso piso Matrix de debug
        if (!isMapLoaded) {
            const graphics = this.add.graphics();
            graphics.lineStyle(1, 0xffffff, 0.15);
            for (let i = 0; i < 2000; i += 32) {
                graphics.moveTo(i, 0); graphics.lineTo(i, 2000);
                graphics.moveTo(0, i); graphics.lineTo(2000, i);
            }
            this.add.text(10, 10, '[DEBUG] Aguardando mapa-teste.json e assets em /public/assets...', { font: '14px Courier', fill: '#f97316' });
        }

        // ==== O PERSONAGEM ANIMADO ====
        if (this.textures.exists('personagem')) {
            // Cria todas as animações (Esquerda, Direita, Cima, Baixo) lendo o PNG 32x32 do personagem
            this.createPlayerAnimations();
            
            // Invoca o sprite físico do personagem no mapa (usando frame 0 caindo frente)
            this.player = this.physics.add.sprite(400, 300, 'personagem', 0);
            
            // Faz com que ele colida amigavelmente com os limites da câmera
            this.player.setCollideWorldBounds(true);
        } else {
            // Fallback se não colocar foto do personagem
            this.player = this.add.rectangle(400, 300, 32, 32, 0x10b981);
            this.physics.add.existing(this.player);
            this.player.body.setCollideWorldBounds(true);
        }

        // Câmera persegue o Boneco
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2); // Zoom in estilo Retro/Stardew Valley

        // Mapeamento AWSD + Setinhas Customizadas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        EventBus.emit('current-scene-ready', this);
    }

    createPlayerAnimations() {
        // Abaixo configuramos uma teoria clássica de spritesheets RPG 32x32:
        // Linha 0 (frames 0 a 2) = Andar pra Baixo
        // Linha 1 (frames 3 a 5) = Andar pra Esquerda
        // Linha 2 (frames 6 a 8) = Andar pra Direita
        // Linha 3 (frames 9 a 11) = Andar pra Cima
        
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1 // -1 significa Loop infinito
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('personagem', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('personagem', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('personagem', { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Frames de personagem parado visualizando pro lado respectivo
        this.anims.create({ key: 'idle-down', frames: [{ key: 'personagem', frame: 1 }] });
        this.anims.create({ key: 'idle-left', frames: [{ key: 'personagem', frame: 4 }] });
        this.anims.create({ key: 'idle-right', frames: [{ key: 'personagem', frame: 7 }] });
        this.anims.create({ key: 'idle-up', frames: [{ key: 'personagem', frame: 10 }] });
    }

    update() {
        if (!this.player || !this.player.body) return;

        const speed = 120;
        let isMoving = false;
        const velocity = { x: 0, y: 0 };

        // X Movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocity.x = -speed;
            if (this.player.anims) { this.player.anims.play('walk-left', true); }
            isMoving = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocity.x = speed;
            if (this.player.anims) { this.player.anims.play('walk-right', true); }
            isMoving = true;
        }

        // Y Movement (If not already moving strongly horizontally to prioritize grid)
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocity.y = -speed;
            if (!isMoving && this.player.anims) { this.player.anims.play('walk-up', true); }
            isMoving = true;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocity.y = speed;
            if (!isMoving && this.player.anims) { this.player.anims.play('walk-down', true); }
            isMoving = true;
        }

        // Se soltou os botões, parar animação baseado no vetor anterior
        if (!isMoving && this.player.anims) {
            if (this.player.anims.currentAnim) {
                const current = this.player.anims.currentAnim.key;
                if (current.includes('left')) this.player.anims.play('idle-left');
                else if (current.includes('right')) this.player.anims.play('idle-right');
                else if (current.includes('up')) this.player.anims.play('idle-up');
                else this.player.anims.play('idle-down');
            }
        }

        // Aplicar a força física
        this.player.body.setVelocity(velocity.x, velocity.y);
    }
}
