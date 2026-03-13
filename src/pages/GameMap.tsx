import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, MapPin } from "lucide-react";
import gameMapImg from "@/assets/game-map.png";
import { useGameMap, locations } from "@/contexts/GameMapContext";
import MapNPCs from "@/components/MapNPCs";

const GameMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const { state, setPos, setActiveLocation, handleInvest, isWalkable } = useGameMap();
  const { pos, coins, activeLocation, investments } = state;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    if (isWalkable(x, y)) {
      setPos({ x, y });
      const nearby = locations.find((loc) => Math.hypot(loc.x - x, loc.y - y) < loc.radius);
      setActiveLocation(nearby || null);
    }
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

        {/* NPCs */}
        <MapNPCs />

        {/* Location markers */}
        {locations.map((loc) => (
          <div key={loc.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
            <div className={`w-4 h-4 rounded-full border-2 border-primary-foreground animate-pulse ${investments.includes(loc.id) ? "bg-game-green" : "bg-accent"}`} />
          </div>
        ))}

        {/* Character */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75 z-20 pointer-events-none" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
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
