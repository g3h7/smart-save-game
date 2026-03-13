import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";

interface Position {
  x: number;
  y: number;
}

interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  description: string;
  investment?: { name: string; cost: number; returnRate: number };
}

export const locations: MapLocation[] = [
  { id: "banco", name: "Banco do Povo", x: 48, y: 50, radius: 6, description: "Faça investimentos seguros em renda fixa.",
    investment: { name: "CDB Seguro", cost: 500, returnRate: 0.9 } },
  { id: "mercado", name: "Torre Municipal", x: 82, y: 25, radius: 5, description: "Invista em ações de empresas locais.",
    investment: { name: "Ações Locais", cost: 1200, returnRate: 2.5 } },
  { id: "casa", name: "Zona Residencial", x: 28, y: 55, radius: 6, description: "Compre imóveis para alugar.",
    investment: { name: "Imóvel para Aluguel", cost: 3000, returnRate: 0.7 } },
  { id: "oficina", name: "Oficina de Barcos", x: 78, y: 18, radius: 5, description: "Invista em comércio marítimo.",
    investment: { name: "Frota Pesqueira", cost: 2000, returnRate: 1.8 } },
  { id: "estufa", name: "Casa do Empreendedor", x: 48, y: 12, radius: 5, description: "Financie startups e ganhe dividendos.",
    investment: { name: "Startup AgriTech", cost: 1500, returnRate: 3.2 } },
];

// Define walkable road segments as rectangles [x1, y1, x2, y2] in percentage coordinates
// These represent the streets/paths on the map where the character can walk
const walkableAreas: Array<[number, number, number, number]> = [
  // Main horizontal roads
  [5, 68, 95, 75],    // Bottom main road
  [5, 45, 95, 52],    // Middle horizontal road
  [5, 20, 95, 27],    // Top horizontal road
  [5, 8, 95, 15],     // Very top road

  // Main vertical roads
  [10, 5, 18, 95],    // Left vertical road
  [35, 5, 43, 95],    // Center-left vertical road
  [55, 5, 63, 95],    // Center-right vertical road
  [75, 5, 83, 95],    // Right vertical road

  // Additional connecting paths
  [18, 55, 35, 62],   // Connection near residential zone
  [43, 30, 55, 38],   // Central connection
  [63, 30, 75, 38],   // Right-center connection
  [83, 45, 95, 52],   // Far right connection

  // Spawn area (bottom center)
  [40, 60, 60, 80],
];

function isWalkable(x: number, y: number): boolean {
  return walkableAreas.some(
    ([x1, y1, x2, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2
  );
}

interface GameMapState {
  pos: Position;
  coins: number;
  investments: string[];
  activeLocation: MapLocation | null;
  keysDown: Set<string>;
}

interface GameMapContextType {
  state: GameMapState;
  setPos: (p: Position | ((prev: Position) => Position)) => void;
  setCoins: (c: number | ((prev: number) => number)) => void;
  setInvestments: (inv: string[] | ((prev: string[]) => string[])) => void;
  setActiveLocation: (loc: MapLocation | null) => void;
  setKeysDown: (keys: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  handleInvest: (loc: MapLocation) => void;
  isWalkable: (x: number, y: number) => boolean;
}

const GameMapContext = createContext<GameMapContextType | null>(null);

export function GameMapProvider({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState<Position>({ x: 50, y: 70 });
  const [coins, setCoins] = useState(5000);
  const [investments, setInvestments] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<MapLocation | null>(null);
  const [keysDown, setKeysDown] = useState<Set<string>>(new Set());

  const handleInvest = useCallback((loc: MapLocation) => {
    if (!loc.investment || coins < loc.investment.cost || investments.includes(loc.id)) return;
    setCoins((c) => c - loc.investment!.cost);
    setInvestments((prev) => [...prev, loc.id]);
  }, [coins, investments]);

  // Global keyboard listener for map movement (persists across pages)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mapped = key === "arrowup" ? "ArrowUp" : key === "arrowdown" ? "ArrowDown" : key === "arrowleft" ? "ArrowLeft" : key === "arrowright" ? "ArrowRight" : key;
      setKeysDown((prev) => new Set(prev).add(mapped));
    };
    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mapped = key === "arrowup" ? "ArrowUp" : key === "arrowdown" ? "ArrowDown" : key === "arrowleft" ? "ArrowLeft" : key === "arrowright" ? "ArrowRight" : key;
      setKeysDown((prev) => {
        const s = new Set(prev);
        s.delete(mapped);
        return s;
      });
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Movement loop - always running
  const keysRef = useRef(keysDown);
  keysRef.current = keysDown;

  useEffect(() => {
    const speed = 0.4;
    const interval = setInterval(() => {
      const keys = keysRef.current;
      if (keys.size === 0) return;

      setPos((p) => {
        let { x, y } = p;
        let nx = x, ny = y;

        if (keys.has("ArrowUp") || keys.has("w")) ny = Math.max(5, y - speed);
        if (keys.has("ArrowDown") || keys.has("s")) ny = Math.min(95, y + speed);
        if (keys.has("ArrowLeft") || keys.has("a")) nx = Math.max(3, x - speed);
        if (keys.has("ArrowRight") || keys.has("d")) nx = Math.min(97, x + speed);

        // Collision: try full move, then axis-by-axis
        if (isWalkable(nx, ny)) {
          x = nx; y = ny;
        } else if (isWalkable(nx, y)) {
          x = nx;
        } else if (isWalkable(x, ny)) {
          y = ny;
        }
        // else stay put

        const nearby = locations.find((loc) => Math.hypot(loc.x - x, loc.y - y) < loc.radius);
        setActiveLocation(nearby || null);

        return { x, y };
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <GameMapContext.Provider value={{
      state: { pos, coins, investments, activeLocation, keysDown },
      setPos, setCoins, setInvestments, setActiveLocation, setKeysDown,
      handleInvest, isWalkable,
    }}>
      {children}
    </GameMapContext.Provider>
  );
}

export function useGameMap() {
  const ctx = useContext(GameMapContext);
  if (!ctx) throw new Error("useGameMap must be inside GameMapProvider");
  return ctx;
}
