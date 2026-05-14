import React, { useRef, useState, useEffect } from 'react';
import { Map as MapIcon, Maximize, Minimize, PlayCircle } from 'lucide-react';
import { PhaserGame } from '../components/PhaserGame';

export default function Mapa() {
    const phaserRef = useRef();
    const gameWrapperRef = useRef();
    const [sceneActive, setSceneActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Esse callback capta o handshake da máquina de EventBus de que tudo foi instanciado e não quebrou
    const currentScene = (scene) => {
        setSceneActive(true);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            gameWrapperRef.current?.requestFullscreen().catch(err => {
                console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-8">
            
            {/* Header Topic */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sidebar/5 flex items-center justify-center rounded-xl">
                        <MapIcon className="text-sidebar" size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-sidebar font-black text-2xl font-display uppercase tracking-wide leading-none">Mundo (Mapa)</h2>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                            <span className={`w-2 h-2 rounded-full ${sceneActive ? 'bg-primary animate-pulse' : 'bg-warning'}`}></span>
                            Motor Gráfico: {sceneActive ? 'ONLINE' : 'LIGANDO...'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={toggleFullscreen}
                        className="bg-sidebar text-white hover:bg-black px-6 py-2.5 rounded-full flex items-center gap-2 border border-sidebar/20 shadow-sm transition-colors uppercase text-xs font-black tracking-wider"
                    >
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        {isFullscreen ? 'Sair da Tela' : 'Tela Cheia'}
                    </button>
                </div>
            </div>

            {/* Stage wrapper for the Phaser Game */}
            <div 
                ref={gameWrapperRef}
                className={`flex-1 w-full shadow-sm relative min-h-[600px] flex items-center justify-center ${isFullscreen ? 'bg-[#0f172a] p-0 rounded-none border-none' : 'bg-white p-4 rounded-[2rem] border border-gray-100'}`}
            >
                
                {/* O container interno injeta a PhaserGame via Reference com Cleanup Ativado */}
                <div className="w-full h-full relative z-10">
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                </div>
                
                {/* Overlay/Moldura Decorativa Arcade */}
                <div className="absolute -bottom-4 right-8 bg-warning text-white px-4 py-2 rounded-t-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 z-20 shadow-[-4px_0_15px_rgba(0,0,0,0.1)]">
                    <PlayCircle size={14} />
                    Engine Integrada v1.0
                </div>
            </div>
            
        </div>
    );
}
