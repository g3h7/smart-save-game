import React from 'react';
import { useEconomy } from '../contexts/EconomyContext';

// O spritesheet tem 4 linhas × 3 colunas de frames de 32×32 px (total: 96×128 px).
// Frame 1 (idle-down, personagem virado para baixo/frente) está na linha 0, coluna 1.
// backgroundPosition: -col*32px, -row*32px  → frame 1 = col 1, row 0 = (-32px, 0px)
const SPRITE_URL = '/Conteudo_educash/sprites/mafia_bold.png';
const FRAME_W = 32;
const FRAME_H = 32;
const IDLE_COL = 1; // frame do meio da linha 0 = idle-down
const IDLE_ROW = 0;
// Escala para mostrar o sprite bem visível no card (4×)
const SCALE = 4;

export default function AvatarProgress() {
  const { globalState, xpParaProximoNivel } = useEconomy();

  const xp = globalState?.xp ?? 0;
  // Jogador novo: level começa em 1 mas exibimos como nível 0 até ganhar o primeiro XP
  const level = globalState?.level ?? 1;
  const isNewPlayer = level === 1 && xp === 0;
  const displayLevel = isNewPlayer ? 0 : level;
  const xpMax = xpParaProximoNivel ? xpParaProximoNivel(level) : level * 100;
  const xpPercent = xpMax > 0 ? Math.min((xp / xpMax) * 100, 100) : 0;

  return (
    <div className="dashboard-card border-none shadow-md">
      <h3 className="text-sidebar font-extrabold text-xl font-display mb-6">MEU AVATAR &amp; PROGRESSO</h3>

      <div className="bg-sidebar rounded-3xl p-6 relative overflow-hidden flex items-center gap-6">

        {/* Character Sprite — pixelated, no blur */}
        <div
          className="shrink-0 mx-auto"
          style={{
            width: FRAME_W * SCALE,
            height: FRAME_H * SCALE,
            backgroundImage: `url(${SPRITE_URL})`,
            backgroundPosition: `-${IDLE_COL * FRAME_W * SCALE}px -${IDLE_ROW * FRAME_H * SCALE}px`,
            backgroundSize: `${3 * FRAME_W * SCALE}px ${4 * FRAME_H * SCALE}px`,
            imageRendering: 'pixelated',
            flexShrink: 0,
          }}
          title="Personagem do Jogador"
        />

        <div className="flex-1 flex flex-col justify-center">
          {/* Level Badge */}
          <div className={`w-max px-4 py-1 rounded-full text-white font-black text-xs mb-2 ${
            isNewPlayer ? 'bg-gray-500' : 'bg-warning'
          }`}>
            {isNewPlayer ? 'NÍVEL 0 — INICIANTE' : `NÍVEL ${displayLevel}`}
          </div>

          {/* XP Bar */}
          <div className="mb-2">
            <span className="text-white font-bold text-sm">
              XP {xp}/{xpMax}
            </span>
            <div className="w-full h-3 bg-xpBarEmpty rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-xpBarFill rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Next level hint */}
          <div className="text-gray-400 text-xs mt-2 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-warning before:rounded-full pl-4 font-medium">
            Nível up em:{' '}
            <span className="text-warning font-bold">{xpMax - xp} XP</span>
            <br />
            <span className="text-white">+XP por aprendizado</span>
          </div>

          <button className="bg-warning hover:bg-orange-400 text-white font-black py-3 rounded-2xl w-32 mt-4 shadow-lg shadow-warning/30 transition-transform active:scale-95">
            EVOLUIR
          </button>
        </div>
      </div>
    </div>
  );
}
