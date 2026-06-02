import React from 'react';
import { Trophy, Plus, UserCircle2 } from 'lucide-react';
import { useEconomy } from '../contexts/EconomyContext';

// Sprite do personagem no header (menor, 2× escala)
const SPRITE_URL = '/Conteudo_educash/sprites/mafia_bold.png';
const FRAME_W = 32;
const FRAME_H = 32;
const SCALE = 2;

export default function Header({ username, onLogout }) {
  const { globalState, xpParaProximoNivel } = useEconomy();

  const xp = globalState?.xp ?? 0;
  const level = globalState?.level ?? 1;
  const xpMax = xpParaProximoNivel ? xpParaProximoNivel(level) : level * 100;
  const xpPercent = xpMax > 0 ? Math.min((xp / xpMax) * 100, 100) : 0;

  // Jogador novo: level 1 com 0 XP → exibimos "Nível 0"
  const isNewPlayer = level === 1 && xp === 0;
  const displayLevel = isNewPlayer ? 0 : level;

  return (
    <header className="h-20 bg-background flex items-center justify-between px-8 z-10 sticky top-0 relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sidebar/10 before:to-transparent">

      {/* Brand logo Area */}
      <div className="flex items-center gap-2">
        <span className="text-warning text-3xl font-black heading tracking-tighter drop-shadow-md">
          $
        </span>
        <h1 className="text-2xl font-black text-sidebar tracking-tight font-display">
          Educa<span className="text-primary">$</span>h
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Trophies */}
        <button className="text-warning hover:scale-110 transition-transform">
          <Trophy size={28} strokeWidth={2.5} fill="#f97316" />
        </button>

        {/* Level / XP Progress — dados reais do contexto */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-sidebar text-base">
              {isNewPlayer ? 'NÍVEL 0' : `NÍVEL ${displayLevel}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {isNewPlayer ? 'SEM XP — COMECE JÁ!' : `XP ${xp}/${xpMax}`}
              </span>
            </div>
          </div>

          <div className="w-48 h-3 bg-gray-200 rounded-full mt-1.5 overflow-hidden ring-1 ring-inset ring-gray-300">
            <div
              className="h-full bg-primary rounded-full relative transition-all duration-700"
              style={{ width: `${xpPercent}%` }}
            >
              {xpPercent > 0 && (
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Add XP Button */}
        <button className="btn-xp flex items-center gap-2">
          <Plus size={16} strokeWidth={3} />
          <span>XP</span>
        </button>

        {/* Profile Avatar com sprite do personagem */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-extrabold text-sidebar uppercase tracking-wider">
              {username || 'JOGADOR'}
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[9px] font-bold text-danger hover:underline cursor-pointer"
              >
                SAIR (LOGOUT)
              </button>
            )}
          </div>

          {/* Mini sprite do personagem no lugar do ícone genérico */}
          <div
            className="w-12 h-12 rounded-full bg-sidebar border-2 border-sidebar/10 hover:border-primary/50 transition-colors overflow-hidden shadow-[0_4px_12px_rgba(17,24,39,0.06)] flex items-center justify-center"
            title={username || 'Jogador'}
          >
            <div
              style={{
                width: FRAME_W * SCALE,
                height: FRAME_H * SCALE,
                backgroundImage: `url(${SPRITE_URL})`,
                backgroundPosition: `-${1 * FRAME_W * SCALE}px 0px`,
                backgroundSize: `${3 * FRAME_W * SCALE}px ${4 * FRAME_H * SCALE}px`,
                imageRendering: 'pixelated',
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
