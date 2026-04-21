import React, { useMemo, useState } from 'react';
import { Home as HouseIcon, Landmark, PiggyBank, Coins } from 'lucide-react';

// IDs de Terreno
const COLORS = {
  0: 'bg-emerald-500', // Grama
  1: 'bg-amber-900',   // Terra
  2: 'bg-slate-400',   // Calçada de Pedra
};

// Componente para a Casa
const House = ({ color = 'text-blue-500' }) => (
  <div className="flex items-center justify-center w-full h-full p-0.5">
    <HouseIcon size={24} className={`${color} drop-shadow-sm`} fill="currentColor" fillOpacity={0.2} />
  </div>
);

// Componente para os Bancos
const Bank = ({ type }) => {
  switch (type) {
    case 'CDB':
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-indigo-600/20 border border-indigo-400 rounded-sm">
          <Landmark size={20} className="text-indigo-600" />
          <span className="text-[6px] font-bold text-indigo-800 leading-none mt-0.5">CDB</span>
        </div>
      );
    case 'FIIs':
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-violet-600/20 border border-violet-400 rounded-sm">
          <Coins size={20} className="text-violet-600" />
          <span className="text-[6px] font-bold text-violet-800 leading-none mt-0.5">FIIs</span>
        </div>
      );
    case 'Cofrinho':
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-pink-600/20 border border-pink-400 rounded-sm">
          <PiggyBank size={20} className="text-pink-600" />
          <span className="text-[6px] font-bold text-pink-800 leading-none mt-0.5">COFRE</span>
        </div>
      );
    default:
      return null;
  }
};

export default function GameMap() {
  const gridSize = 60;
  const tileSize = 32;

  // Gerar a matriz do mapa
  const mapData = useMemo(() => {
    const matrix = [];
    for (let y = 0; y < gridSize; y++) {
      const row = [];
      for (let x = 0; x < gridSize; x++) {
        // Lógica de terreno simples: a maior parte é grama
        let terrain = 0;
        
        // Exemplo de uma "estrada" (Calçada de Pedra)
        if (x === 10 || y === 10) terrain = 2;
        
        // Exemplo de áreas de "terra"
        if ((x > 12 && x < 15) && (y > 12 && y < 15)) terrain = 1;

        let building = null;

        // Adicionar algumas construções de teste
        if (x === 10 && y === 12) building = { type: 'house', color: 'text-red-500' };
        if (x === 12 && y === 10) building = { type: 'house', color: 'text-blue-500' };
        if (x === 8 && y === 8) building = { type: 'bank', subType: 'CDB' };
        if (x === 15 && y === 15) building = { type: 'bank', subType: 'FIIs' };
        if (x === 5 && y === 20) building = { type: 'bank', subType: 'Cofrinho' };

        row.push({ x, y, terrain, building });
      }
      matrix.push(row);
    }
    return matrix.flat();
  }, [gridSize]);

  const handleTileClick = (tile) => {
    console.group(`Tile Clicada: [${tile.x}, ${tile.y}]`);
    console.log('Terreno ID:', tile.terrain);
    if (tile.building) {
      console.log('Construção:', tile.building.type, tile.building.subType || '');
    }
    console.groupEnd();
  };

  return (
    <div className="w-full h-full overflow-auto bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-inner">
      <div 
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
          width: `${gridSize * tileSize}px`,
          height: `${gridSize * tileSize}px`
        }}
      >
        {mapData.map((tile, idx) => (
          <div
            key={`${tile.x}-${tile.y}`}
            onClick={() => handleTileClick(tile)}
            className={`
              ${COLORS[tile.terrain]} 
              w-[32px] h-[32px] 
              border-[0.5px] border-black/5 
              flex items-center justify-center 
              cursor-pointer hover:brightness-110 
              transition-all duration-75
              relative group
            `}
          >
            {/* Renderizar Construção */}
            {tile.building?.type === 'house' && <House color={tile.building.color} />}
            {tile.building?.type === 'bank' && <Bank type={tile.building.subType} />}

            {/* Tooltip simples no hover p/ ajudar no dev */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold pointer-events-none">
              {tile.x},{tile.y}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
