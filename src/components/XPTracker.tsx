const xpMilestones = [
  { label: "R$ XP", earned: true, value: "+15 XP" },
  { label: "+15 XP", earned: true, value: "+15 XP" },
  { label: "+20 XP", earned: false, value: "+20 XP" },
];

const XPTracker = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card game-card-hover">
      <h3 className="font-display text-lg font-bold text-foreground mb-3">ACOMPANHAR XP</h3>

      <div className="flex items-center gap-2 mb-3">
        {xpMilestones.map((m, i) => (
          <span
            key={i}
            className={`text-xs font-display font-bold px-3 py-1 rounded-full ${
              m.earned
                ? "bg-game-green text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {m.value}
          </span>
        ))}
        <span className="text-xs font-display font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
          +XP
        </span>
      </div>

      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-game-blue xp-bar-animated"
          style={{ "--xp-width": "65%" } as React.CSSProperties}
        />
      </div>

      <div className="flex justify-between mt-2">
        {xpMilestones.map((m, i) => (
          <span key={i} className="text-xs text-muted-foreground font-semibold">
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default XPTracker;
