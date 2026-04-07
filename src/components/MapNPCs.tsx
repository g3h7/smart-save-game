import { useState, useEffect, useRef } from "react";

interface NPC {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  emoji: string;
  color: string;
  name: string;
}

// Road segments NPCs can walk on [x1, y1, x2, y2]
const npcRoads: Array<[number, number, number, number]> = [
  [5, 68, 95, 75],
  [5, 45, 95, 52],
  [5, 20, 95, 27],
  [5, 8, 95, 15],
  [10, 5, 18, 95],
  [35, 5, 43, 95],
  [55, 5, 63, 95],
  [75, 5, 83, 95],
  [18, 55, 35, 62],
  [43, 30, 55, 38],
  [63, 30, 75, 38],
  [40, 60, 60, 80],
];

function randomPointOnRoad(): { x: number; y: number } {
  const road = npcRoads[Math.floor(Math.random() * npcRoads.length)];
  return {
    x: road[0] + Math.random() * (road[2] - road[0]),
    y: road[1] + Math.random() * (road[3] - road[1]),
  };
}

function isOnRoad(x: number, y: number): boolean {
  return npcRoads.some(([x1, y1, x2, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2);
}

const npcTemplates = [
  { emoji: "👩‍💼", color: "hsl(var(--game-navy))", name: "Comerciante" },
  { emoji: "👨‍🌾", color: "hsl(var(--game-green))", name: "Fazendeiro" },
  { emoji: "👷", color: "hsl(var(--accent))", name: "Construtor" },
  { emoji: "🧙", color: "hsl(var(--game-orange))", name: "Mago" },
  { emoji: "👩‍🏫", color: "hsl(var(--game-green-dark))", name: "Professora" },
  { emoji: "🧑‍🍳", color: "hsl(var(--game-orange-dark))", name: "Chef" },
  { emoji: "👮", color: "hsl(var(--game-navy-dark))", name: "Guarda" },
  { emoji: "🧑‍🔧", color: "hsl(var(--game-navy))", name: "Mecânico" },
];

function createNPC(id: number): NPC {
  const template = npcTemplates[id % npcTemplates.length];
  const start = randomPointOnRoad();
  const target = randomPointOnRoad();
  return {
    id,
    x: start.x,
    y: start.y,
    targetX: target.x,
    targetY: target.y,
    speed: 0.02 + Math.random() * 0.04,
    ...template,
  };
}

export default function MapNPCs() {
  const [npcs, setNpcs] = useState<NPC[]>(() =>
    Array.from({ length: 8 }, (_, i) => createNPC(i))
  );
  const npcsRef = useRef(npcs);
  npcsRef.current = npcs;

  useEffect(() => {
    const interval = setInterval(() => {
      setNpcs((prev) =>
        prev.map((npc) => {
          const dx = npc.targetX - npc.x;
          const dy = npc.targetY - npc.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 1) {
            // Pick new target
            const newTarget = randomPointOnRoad();
            return { ...npc, targetX: newTarget.x, targetY: newTarget.y };
          }

          const nx = npc.x + (dx / dist) * npc.speed;
          const ny = npc.y + (dy / dist) * npc.speed;

          return { ...npc, x: nx, y: ny };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {npcs.map((npc) => (
        <div
          key={npc.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none transition-all duration-50"
          style={{ left: `${npc.x}%`, top: `${npc.y}%` }}
        >
          <div className="relative group">
            <div
              className="w-6 h-6 rounded-full border-2 border-card shadow-md flex items-center justify-center text-xs"
              style={{ backgroundColor: npc.color }}
            >
              {npc.emoji}
            </div>
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-foreground/20 rounded-full blur-[1px]" />
          </div>
        </div>
      ))}
    </>
  );
}
