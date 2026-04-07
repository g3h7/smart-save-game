import { Trophy, Plus } from "lucide-react";
import avatarImg from "@/assets/hero-character.png";

const GameHeader = () => {
  return (
    <header className="h-16 bg-primary border-b border-sidebar-border flex items-center justify-between px-6">
      <h1 className="font-display text-2xl font-bold text-primary-foreground">
        <span className="text-accent">$</span> Educa
        <span className="text-accent">$</span>h
      </h1>

      <div className="flex items-center gap-4">
        <Trophy className="text-accent" size={28} />

        <div className="flex flex-col items-end">
          <span className="font-display text-sm font-bold text-primary-foreground">NÍVEL 12</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-3 bg-game-navy-dark rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-game-green xp-bar-animated"
                style={{ "--xp-width": "72.5%" } as React.CSSProperties}
              />
            </div>
            <span className="text-xs text-primary-foreground/70 font-semibold">XP 1450/2000</span>
          </div>
        </div>

        <button className="bg-accent text-accent-foreground font-display font-bold text-xs px-3 py-1.5 rounded-lg shadow-button flex items-center gap-1 hover:brightness-110 transition-all">
          <Plus size={14} />XP
        </button>

        <img src={avatarImg} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-accent object-cover" />
      </div>
    </header>
  );
};

export default GameHeader;
