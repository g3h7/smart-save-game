import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainScene extends Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#1e293b');

        // 1. Instância do Mapa Tiled (educash_01.json)
        const map = this.make.tilemap({ key: 'mapa-educash' });

        // 2. Adição do Tileset
        // O nome 'Serene_Village_32x32' deve ser idêntico ao 'name' dentro do JSON.
        const tileset = map.addTilesetImage('Serene_Village_32x32', 'tiles-serene');
        
        if (!tileset) {
            console.error('ERRO: Tileset "Serene_Village_32x32" não encontrado no JSON!');
        }

        // 3. Criar as camadas de Tiles (Nomes exatos do novo JSON)
        const chaoBase = map.createLayer('Chao_base verde', tileset, 0, 0);
        const contorno = map.createLayer('Contorno', tileset, 0, 0);
        const piso = map.createLayer('Piso', tileset, 0, 0);
        const casas = map.createLayer('casas', tileset, 0, 0);

        // 4. Configuração de Depths (Z-Index) com Verificação de Segurança
        if (chaoBase) chaoBase.setDepth(0);
        else console.warn('Camada "Chao_base verde" não encontrada!');

        if (contorno) contorno.setDepth(1);
        else console.warn('Camada "Contorno" não encontrada!');

        if (piso) piso.setDepth(2);
        else console.warn('Camada "Piso" não encontrada!');

        if (casas) casas.setDepth(10); // Casas ficam acima do player
        else console.warn('Camada "casas" não encontrada!');

        // 5. Instanciar Player (Spawnpoint da camada 'Entidade')
        const spawnPoint = map.findObject('Entidade', obj => obj.name === 'Player');
        
        this.player = this.physics.add.sprite(
            spawnPoint ? spawnPoint.x : 400, 
            spawnPoint ? spawnPoint.y : 300, 
            'player',
            0
        );

        // Player fica no meio (depth 5) para passar atrás das casas (depth 10)
        this.player.setDepth(5);
        this.player.setCollideWorldBounds(true);
        
        // Ajuste da Hitbox para os pés (essencial para perspectiva isométrica)
        this.player.body.setSize(20, 16);
        this.player.body.setOffset(6, 16);

        // 6. Colisões de Objetos (Camada 'Colisao')
        // Convertendo objetos de retângulo do Tiled em corpos físicos estáticos
        const collisionLayer = map.getObjectLayer('Colisao');
        if (collisionLayer) {
            const collisionGroup = this.physics.add.staticGroup();
            collisionLayer.objects.forEach(obj => {
                const wall = collisionGroup.create(obj.x + (obj.width / 2), obj.y + (obj.height / 2), null);
                wall.setSize(obj.width, obj.height);
                wall.setVisible(false); // Mantém invisível para não poluir o cenário
            });
            this.physics.add.collider(this.player, collisionGroup);
        }

        // 7. Configurar Animações
        this.createPlayerAnimations();

        // 8. Câmera seguindo o Player
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2);

        // 9. Controles AWSD + Setas
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
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1 // -1 significa Loop infinito
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Frames de personagem parado visualizando pro lado respectivo
        this.anims.create({ key: 'idle-down', frames: [{ key: 'player', frame: 1 }] });
        this.anims.create({ key: 'idle-left', frames: [{ key: 'player', frame: 4 }] });
        this.anims.create({ key: 'idle-right', frames: [{ key: 'player', frame: 7 }] });
        this.anims.create({ key: 'idle-up', frames: [{ key: 'player', frame: 10 }] });
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
