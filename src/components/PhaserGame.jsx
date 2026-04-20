import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from '../game/main';
import { EventBus } from '../game/EventBus';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef(null);

    // useEffect is heavily optimized here to act as a proper Engine Mount & Unmount Sandbox
    useLayoutEffect(() => {
        if (!game.current) {
            game.current = StartGame('game-container');

            if (typeof ref === 'function') {
                ref({ game: game.current, scene: null });
            } else if (ref) {
                ref.current = { game: game.current, scene: null };
            }
        }

        // Garbage Collector! O Limpador Mais Importante.
        // Se a SPA jogar pra aba "Personagem", a função return abaixo Destrói a máquina WebGL e apaga variáveis!
        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = null;
            }
        };
    }, [ref]);

    // Listener para o Bus emitir
    useEffect(() => {
        EventBus.on('current-scene-ready', (scene_instance) => {
            if (currentActiveScene && typeof currentActiveScene === 'function') {
                currentActiveScene(scene_instance);
            }
            if (ref && typeof ref !== 'function') {
                ref.current.scene = scene_instance;
            }
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
        };
    }, [currentActiveScene, ref]);

    // O id do div obrigatoriamente se chama game-container que reflete a config do Phaser
    return (
        <div 
            id="game-container" 
            className="w-full h-full rounded-3xl overflow-hidden ring-4 ring-sidebar/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
        />
    );
});
