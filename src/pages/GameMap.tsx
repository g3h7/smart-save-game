import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, MapPin } from "lucide-react";
import gameMapImg from "@/assets/game-map.png";

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

const locations: MapLocation[] = [
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

const GameMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position>({ x: 50, y: 70 });
  const [coins, setCoins] = useState(5000);
  const [activeLocation, setActiveLocation] = useState<MapLocation | null>(null);
  const [investments, setInvestments] = useState<string[]>([]);
  const [keysDown, setKeysDown] = useState<Set<string>>(new Set());
  const speed = 0.4;

  const moveChar = useCallback(() => {
    setPos((p) => {
      let { x, y } = p;
      if (keysDown.has("ArrowUp") || keysDown.has("w")) y = Math.max(5, y - speed);
      if (keysDown.has("ArrowDown") || keysDown.has("s")) y = Math.min(95, y + speed);
      if (keysDown.has("ArrowLeft") || keysDown.has("a")) x = Math.max(3, x - speed);
      if (keysDown.has("ArrowRight") || keysDown.has("d")) x = Math.min(97, x + speed);

      // Check locations
      const nearby = locations.find(
        (loc) => Math.hypot(loc.x - x, loc.y - y) < loc.radius
      );
      setActiveLocation(nearby || null);

      return { x, y };
    });
  }, [keysDown]);

  useEffect(() => {
    const interval = setInterval(moveChar, 16);
    return () => clearInterval(interval);
  }, [moveChar]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      setKeysDown((prev) => new Set(prev).add(e.key.toLowerCase() === "arrowup" ? "ArrowUp" : e.key.toLowerCase() === "arrowdown" ? "ArrowDown" : e.key.toLowerCase() === "arrowleft" ? "ArrowLeft" : e.key.toLowerCase() === "arrowright" ? "ArrowRight" : e.key.toLowerCase()));
    };
    const up = (e: KeyboardEvent) => {
      setKeysDown((prev) => {
        const s = new Set(prev);
        const key = e.key.toLowerCase() === "arrowup" ? "ArrowUp" : e.key.toLowerCase() === "arrowdown" ? "ArrowDown" : e.key.toLowerCase() === "arrowleft" ? "ArrowLeft" : e.key.toLowerCase() === "arrowright" ? "ArrowRight" : e.key.toLowerCase();
        s.delete(key);
        return s;
      });
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const handleInvest = (loc: MapLocation) => {
    if (!loc.investment || coins < loc.investment.cost || investments.includes(loc.id)) return;
    setCoins((c) => c - loc.investment!.cost);
    setInvestments((prev) => [...prev, loc.id]);
  };

  // Touch/mobile controls
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(3, Math.min(97, x)), y: Math.max(5, Math.min(95, y)) });
    const nearby = locations.find((loc) => Math.hypot(loc.x - x, loc.y - y) < loc.radius);
    setActiveLocation(nearby || null);
  };

  return (
    <div className="h-screen bg-foreground flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={22} />
          </button>
          <MapPin className="text-primary" size={20} />
          <span className="font-display text-sm font-bold text-foreground">MAPA DO MUNDO</span>
        </div>
        <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full">
          <Coins className="text-accent" size={16} />
          <span className="font-display font-bold text-sm text-accent-foreground">{coins.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden" ref={mapRef} onClick={handleMapClick} tabIndex={0}>
        <img src={gameMapImg} alt="Mapa do jogo" className="w-full h-full object-cover" draggable={false} />

        {/* Location markers */}
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-primary-foreground animate-pulse ${
              investments.includes(loc.id) ? "bg-game-green" : "bg-accent"
            }`} />
          </div>
        ))}

        {/* Character */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75 z-20 pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-primary rounded-full border-3 border-primary-foreground shadow-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">🧑</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-foreground/30 rounded-full blur-sm" />
          </div>
        </div>

        {/* Location popup */}
        {activeLocation && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-card rounded-2xl shadow-card p-5 w-80 border border-border animate-in fade-in slide-in-from-bottom-4 duration-200">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              {activeLocation.name}
            </h3>
            <p className="text-sm text-muted-foreground font-body mt-1">{activeLocation.description}</p>

            {activeLocation.investment && (
              <div className="mt-3 bg-muted rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="font-display text-xs font-bold text-foreground">{activeLocation.investment.name}</span>
                  <span className="font-display text-xs font-bold text-primary">{activeLocation.investment.returnRate}% a.m.</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                    <Coins size={12} /> {activeLocation.investment.cost.toLocaleString("pt-BR")} moedas
                  </span>
                  {investments.includes(activeLocation.id) ? (
                    <span className="text-xs font-display font-bold text-game-green">✓ INVESTIDO</span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleInvest(activeLocation); }}
                      disabled={coins < activeLocation.investment.cost}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-display font-bold text-xs shadow-button hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      INVESTIR
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls hint */}
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-2 z-10">
          <p className="font-display text-[10px] font-bold text-muted-foreground">WASD / SETAS PARA MOVER</p>
          <p className="font-display text-[10px] font-bold text-muted-foreground">OU CLIQUE NO MAPA</p>
        </div>
      </div>
    </div>
  );
};

export default GameMap;
