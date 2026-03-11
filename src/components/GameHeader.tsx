import { Trophy, Plus } from "lucide-react";
import avatarImg from "@/assets/hero-character.png";

const GameHeader = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-card">
      <h1 className="font-display text-2xl font-bold text-foreground">
        <span className="text-game-gold">$</span> Educa
        <span className="text-game-gold">$</span>h
      </h1>

      <div className="flex items-center gap-4">
        <Trophy className="text-game-gold" size={28} />

        <div className="flex flex-col items-end">
          <span className="font-display text-sm font-bold text-foreground">NÍVEL 12</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary xp-bar-animated"
                style={{ "--xp-width": "72.5%" } as React.CSSProperties}
              />
            </div>
            <span className="text-xs text-muted-foreground font-semibold">XP 1450/2000</span>
          </div>
        </div>

        <button className="bg-game-gold text-accent-foreground font-display font-bold text-xs px-3 py-1.5 rounded-lg shadow-button flex items-center gap-1 hover:brightness-110 transition-all">
          <Plus size={14} />XP
        </button>

        <img src={avatarImg} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
      </div>
    </header>
  );
};

export default GameHeader;
