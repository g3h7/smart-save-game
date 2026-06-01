import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainScene extends Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        // Removido o setBackgroundColor para garantir que o fundo do canvas fique neutro e não cubra o mapa

        // 1. Instância do Mapa Tiled (educash_01.json)
        const map = this.make.tilemap({ key: 'mapa-educash' });

        // Sincronize o Tileset: Nome exato "Serene_Village_32x32" retirado do educash_01.json
        const tileset = map.addTilesetImage('Serene_Village_32x32', 'tiles-serene');

        if (!tileset) {
            console.error('ERRO: Tileset "Serene_Village_32x32" não encontrado no JSON!');
        }

        // 3. Funções específicas para carregar as camadas e colisões (conforme solicitado)
        this.map = map;
        this.loadMapLayers(map, tileset);

        // 4. Instanciar Player (Spawnpoint da camada 'Entidade')
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

        // 5. Configurar Colisões Estritas
        this.setupCollisionLayer(map, this.player);

        // 6. Configurar Interações de Farm
        this.setupInteractionLayer(map);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.farmCooldowns = JSON.parse(localStorage.getItem('educash_farm_cooldowns')) || {};

        // 7. Configurar Animações
        this.createPlayerAnimations();

        // Limites físicos rígidos baseados no tamanho do mapa (60 tiles * 32px = 1920)
        this.physics.world.setBounds(0, 0, 1920, 1920);

        // 8. Câmera seguindo o Player
        this.cameras.main.setBounds(0, 0, 1920, 1920);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(3.0);

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

    /**
     * Função para carregar as camadas visuais do mapa.
     * Libera a passagem por padrão nestas camadas, pois não adiciona colliders a elas.
     */
    loadMapLayers(map, tileset) {
        // Criar as camadas de Tiles (Nomes exatos do JSON)
        // Mesmo dentro de grupos (Agrupar 1), o Phaser encontra pelo nome.
        const chaoBase = map.createLayer('Chao_base verde', tileset, 0, 0);
        const contorno = map.createLayer('Contorno', tileset, 0, 0);
        const piso = map.createLayer('Piso', tileset, 0, 0);
        const casas = map.createLayer('casas', tileset, 0, 0);

        // Configuração de Depths (Z-Index) para garantir sobreposição correta
        if (chaoBase) chaoBase.setDepth(0);
        else console.warn('Camada "Chao_base verde" não encontrada no JSON!');

        if (contorno) contorno.setDepth(1);
        else console.warn('Camada "Contorno" não encontrada no JSON!');

        if (piso) piso.setDepth(2);
        else console.warn('Camada "Piso" não encontrada no JSON!');

        if (casas) casas.setDepth(10); // Casas ficam acima do player
        else console.warn('Camada "casas" não encontrada no JSON!');
    }

    /**
     * Função ESPECÍFICA para a camada COLISAO.
     * Onde houver objeto nesta camada, o personagem não passa.
     * Libera passagem nas demais camadas (pois apenas esta recebe corpo físico sólido).
     */
    setupCollisionLayer(map, player) {
        const collisionLayer = map.getObjectLayer('Colisao');
        
        if (collisionLayer) {
            const collisionGroup = this.physics.add.staticGroup();
            
            collisionLayer.objects.forEach(obj => {
                // Previne "colisões fantasmagóricas" ignorando objetos vazios, pontos ou marcações
                if (!obj.width || !obj.height) return;

                // Tiled exporta x, y como o canto superior esquerdo (Top-Left).
                // Ao usar setOrigin(0, 0), o Phaser alinha o desenho e o corpo físico (body)
                // perfeitamente com a coordenada absoluta do mundo, sem offsets extras de cálculo.
                const debugRect = this.add.rectangle(
                    obj.x, 
                    obj.y, 
                    obj.width, 
                    obj.height, 
                    0xff0000, 
                    0.5 // Transparência
                ).setOrigin(0, 0).setDepth(100); // Depth 100 força o desenho acima de todas as outras camadas
                
                // Transforma o retângulo visual em um corpo físico estático absoluto
                this.physics.add.existing(debugRect, true);
                
                // Adiciona o corpo físico no grupo de colisão
                collisionGroup.add(debugRect);
            });

            // Adiciona o colisor: o personagem SÓ para ao bater nesta collisionGroup
            this.physics.add.collider(player, collisionGroup);
            console.log("Sistema de colisão ativado para a camada 'Colisao' com debug visual habilitado.");
        } else {
            console.error('ERRO: Camada "Colisao" não encontrada no JSON!');
        }
    }

    setupInteractionLayer(map) {
        const interacoesLayer = map.getObjectLayer('Interacoes');
        this.farmPoints = [];
        this.cdiPoints = [];

        if (interacoesLayer) {
            interacoesLayer.objects.forEach(obj => {
                if (obj.name && obj.name.startsWith('ponto_farm_')) {
                    this.farmPoints.push({
                        name: obj.name,
                        x: obj.x + (obj.width || 0) / 2,
                        y: obj.y + (obj.height || 0) / 2
                    });
                }
                if (obj.name && obj.name.startsWith('ponto_cdi')) {
                    this.cdiPoints.push({
                        name: obj.name,
                        x: obj.x + (obj.width || 0) / 2,
                        y: obj.y + (obj.height || 0) / 2
                    });
                }
            });
            console.log(`Pontos de farm carregados: ${this.farmPoints.length}, Pontos de CDI carregados: ${this.cdiPoints.length}`);
        } else {
            console.warn('Camada "Interacoes" não encontrada. O sistema de farm pode não funcionar se não houver pontos criados.');
        }
    }

    handleInteraction() {
        const interactDistance = 50; // Distância máxima para interagir
        const now = Date.now();
        const cooldownTime = 90 * 1000; // 90 segundos

        let interacted = false;

        // Checar Interação com Banco (CDI/Cofre)
        for (const point of this.cdiPoints) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y);
            if (dist < interactDistance) {
                EventBus.emit('open-investment-modal');
                interacted = true;
                break;
            }
        }

        if (interacted) return;

        // Checar Interação de Farm
        for (const point of this.farmPoints) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y);
            
            if (dist < interactDistance) {
                const lastFarmed = this.farmCooldowns[point.name] || 0;
                
                if (now - lastFarmed >= cooldownTime) {
                    // Sucesso: ganha 20
                    this.farmCooldowns[point.name] = now;
                    localStorage.setItem('educash_farm_cooldowns', JSON.stringify(this.farmCooldowns));
                    
                    EventBus.emit('farm-money', 20);
                    this.showFloatingText('+ $20', '#10b981', this.player.x, this.player.y - 30);
                } else {
                    // Em cooldown
                    this.showFloatingText('Aguarde', '#ef4444', this.player.x, this.player.y - 30);
                }
                break; // Interage apenas com 1 ponto por vez
            }
        }
    }

    showFloatingText(msg, color, x, y) {
        const text = this.add.text(x, y, msg, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: color,
            stroke: '#0f172a',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(150);

        this.tweens.add({
            targets: text,
            y: y - 40,
            alpha: 0,
            duration: 1500,
            ease: 'Power1',
            onComplete: () => text.destroy()
        });
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

        // Checar interação de Farm
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.handleInteraction();
        }

        // Aplicar a força física
        this.player.body.setVelocity(velocity.x, velocity.y);
    }
}
