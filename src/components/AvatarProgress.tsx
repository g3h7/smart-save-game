import avatarImg from "@/assets/avatar-knight.png";

const AvatarProgress = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card game-card-hover">
      <h3 className="font-display text-lg font-bold text-foreground mb-3">MEU AVATAR & PROGRESSO</h3>

      <div className="bg-gradient-to-br from-primary to-game-navy-dark rounded-2xl p-4 flex items-center gap-4">
        <img src={avatarImg} alt="Avatar Knight" className="w-24 h-24 object-contain" />

        <div className="flex-1">
          <span className="bg-accent text-accent-foreground font-display font-bold text-xs px-3 py-1 rounded-lg">
            NÍVEL 12
          </span>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-primary-foreground text-xs font-semibold">XP 1450/2000</span>
            </div>
            <div className="w-full h-3 bg-game-navy-dark rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-accent xp-bar-animated"
                style={{ "--xp-width": "72.5%" } as React.CSSProperties}
              />
            </div>
            <p className="text-primary-foreground text-xs mt-1">
              Nível up: <span className="text-accent font-bold">15 15</span>
            </p>
            <p className="text-primary-foreground text-xs">+XP por aprendizado</p>
          </div>

          <button className="mt-2 bg-accent text-accent-foreground font-display font-bold text-sm px-5 py-1.5 rounded-xl hover:brightness-110 transition-all shadow-button">
            EVOLUIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarProgress;
