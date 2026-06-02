import React from 'react';
import { useEconomy } from '../contexts/EconomyContext';

export default function XpTracker() {
  const { globalState, xpParaProximoNivel } = useEconomy();

  const xp = globalState?.xp ?? 0;
  const level = globalState?.level ?? 1;
  const isNewPlayer = level === 1 && xp === 0;
  const displayLevel = isNewPlayer ? 0 : level;
  const xpMax = xpParaProximoNivel ? xpParaProximoNivel(level) : level * 100;
  const xpPercent = xpMax > 0 ? Math.min((xp / xpMax) * 100, 100) : 0;
  const xpFaltando = xpMax - xp;

  // Milestones exibidos como badges (25%, 50%, 75%, 100% do XP necessário)
  const milestones = [
    { label: `+${Math.round(xpMax * 0.25)} XP`, earned: xp >= xpMax * 0.25 },
    { label: `+${Math.round(xpMax * 0.50)} XP`, earned: xp >= xpMax * 0.50 },
    { label: `+${Math.round(xpMax * 0.75)} XP`, earned: xp >= xpMax * 0.75 },
    { label: `+${xpMax} XP`, earned: xp >= xpMax },
  ];

  return (
    <div className="dashboard-card border-none shadow-md">
      <h3 className="text-sidebar font-extrabold text-xl font-display mb-6">ACOMPANHAR XP</h3>

      {/* Milestone Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {milestones.map((ms, i) => (
          <span
            key={i}
            className={`font-extrabold text-xs px-4 py-2 rounded-full shadow-sm transition-all ${
              ms.earned
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {ms.label}
          </span>
        ))}
      </div>

      {/* XP Progress Bar */}
      <div className="relative pt-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 relative"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <div className="flex justify-between w-full mt-2 text-xs font-bold text-gray-400">
          <span>Nv. {displayLevel}</span>
          <span className="text-warning">-{xpFaltando} XP p/ nível</span>
          <span>Nv. {displayLevel + 1}</span>
        </div>
      </div>

      {/* Zero state message */}
      {xp === 0 && (
        <p className="text-center text-xs text-gray-400 mt-4 font-medium">
          Complete módulos para ganhar XP! 🎯
        </p>
      )}
    </div>
  );
}
