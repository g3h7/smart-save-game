import GameSidebar from "@/components/GameSidebar";
import GameHeader from "@/components/GameHeader";
import { useState } from "react";
import { Shield, Sword, Crown, Star, Award, Gem } from "lucide-react";
import avatarImg from "@/assets/hero-character.png";

const skinColors = [
  { id: "light", color: "hsl(30 60% 80%)", label: "Clara" },
  { id: "medium", color: "hsl(25 50% 60%)", label: "Média" },
  { id: "tan", color: "hsl(20 45% 50%)", label: "Morena" },
  { id: "dark", color: "hsl(15 40% 35%)", label: "Escura" },
];

const hairStyles = [
  { id: "short", label: "Curto", emoji: "💇" },
  { id: "long", label: "Longo", emoji: "💇‍♀️" },
  { id: "mohawk", label: "Moicano", emoji: "🦹" },
  { id: "bald", label: "Careca", emoji: "👨‍🦲" },
];

const hairColors = [
  { id: "black", color: "hsl(0 0% 15%)", label: "Preto" },
  { id: "brown", color: "hsl(25 60% 30%)", label: "Castanho" },
  { id: "blonde", color: "hsl(45 80% 60%)", label: "Loiro" },
  { id: "red", color: "hsl(0 70% 45%)", label: "Ruivo" },
  { id: "blue", color: "hsl(215 75% 55%)", label: "Azul" },
  { id: "purple", color: "hsl(270 50% 55%)", label: "Roxo" },
];

const outfits = [
  { id: "knight", label: "Cavaleiro", icon: Shield, cost: 0, owned: true },
  { id: "mage", label: "Mago", icon: Gem, cost: 200, owned: true },
  { id: "warrior", label: "Guerreiro", icon: Sword, cost: 500, owned: false },
  { id: "king", label: "Rei", icon: Crown, cost: 1000, owned: false },
];

const emblems = [
  { id: "novice", label: "Novato", icon: "🌱", description: "Completou o primeiro módulo", earned: true },
  { id: "saver", label: "Poupador", icon: "💰", description: "Economizou R$1.000", earned: true },
  { id: "investor", label: "Investidor", icon: "📈", description: "Fez 5 investimentos", earned: true },
  { id: "scholar", label: "Estudioso", icon: "📚", description: "Completou 5 módulos", earned: false },
  { id: "master", label: "Mestre", icon: "🏆", description: "Completou todos os quizzes", earned: false },
  { id: "legend", label: "Lenda", icon: "⭐", description: "Alcançou nível 10", earned: false },
];

const Personagem = () => {
  const [selectedSkin, setSelectedSkin] = useState("medium");
  const [selectedHair, setSelectedHair] = useState("short");
  const [selectedHairColor, setSelectedHairColor] = useState("black");
  const [selectedOutfit, setSelectedOutfit] = useState("knight");
  const [activeTab, setActiveTab] = useState<"aparencia" | "roupas" | "emblemas" | "cartao">("aparencia");

  const playerName = localStorage.getItem("playerName") || "Jogador";

  const tabs = [
    { id: "aparencia" as const, label: "APARÊNCIA" },
    { id: "roupas" as const, label: "ROUPAS" },
    { id: "emblemas" as const, label: "EMBLEMAS" },
    { id: "cartao" as const, label: "CARTÃO" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GameSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GameHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <h2 className="font-display text-2xl font-bold text-foreground">🎭 PERSONAGEM</h2>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-display font-bold text-xs px-5 py-2 rounded-xl transition-all
                  ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="bg-card rounded-2xl p-6 shadow-card flex flex-col items-center gap-4">
              <h3 className="font-display font-bold text-foreground">PREVIEW</h3>
              <div className="relative w-40 h-40 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-4 border-primary">
                <img src={avatarImg} alt="Avatar" className="w-32 h-32 object-contain" />
              </div>
              <p className="font-display font-bold text-foreground text-lg">{playerName}</p>
              <div className="flex items-center gap-2">
                <Star className="text-game-gold" size={16} />
                <span className="text-sm font-bold text-muted-foreground">Nível 5 • Cavaleiro</span>
              </div>
              <div className="flex gap-1 mt-2">
                {emblems.filter(e => e.earned).map(e => (
                  <span key={e.id} className="text-xl" title={e.label}>{e.icon}</span>
                ))}
              </div>
            </div>

            {/* Customization panel */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === "aparencia" && (
                <>
                  <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                    <h3 className="font-display font-bold text-foreground">TOM DE PELE</h3>
                    <div className="flex gap-3">
                      {skinColors.map((skin) => (
                        <button
                          key={skin.id}
                          onClick={() => setSelectedSkin(skin.id)}
                          className={`w-12 h-12 rounded-xl border-3 transition-all ${
                            selectedSkin === skin.id ? "ring-2 ring-primary ring-offset-2" : "border-border"
                          }`}
                          style={{ backgroundColor: skin.color }}
                          title={skin.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                    <h3 className="font-display font-bold text-foreground">ESTILO DE CABELO</h3>
                    <div className="flex gap-3">
                      {hairStyles.map((hair) => (
                        <button
                          key={hair.id}
                          onClick={() => setSelectedHair(hair.id)}
                          className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                            selectedHair === hair.id
                              ? "bg-primary text-primary-foreground shadow-button"
                              : "bg-muted text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          <span className="text-xl">{hair.emoji}</span>
                          <span className="text-[9px] font-bold">{hair.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                    <h3 className="font-display font-bold text-foreground">COR DO CABELO</h3>
                    <div className="flex gap-3">
                      {hairColors.map((hc) => (
                        <button
                          key={hc.id}
                          onClick={() => setSelectedHairColor(hc.id)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            selectedHairColor === hc.id ? "ring-2 ring-primary ring-offset-2" : ""
                          }`}
                          style={{ backgroundColor: hc.color }}
                          title={hc.label}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "roupas" && (
                <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="font-display font-bold text-foreground">TRAJES DISPONÍVEIS</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {outfits.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => outfit.owned && setSelectedOutfit(outfit.id)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          selectedOutfit === outfit.id
                            ? "bg-primary/10 border-primary"
                            : outfit.owned
                              ? "bg-card border-border hover:border-primary/50"
                              : "bg-muted/50 border-border opacity-60"
                        }`}
                      >
                        <outfit.icon
                          size={32}
                          className={selectedOutfit === outfit.id ? "text-primary" : "text-muted-foreground"}
                        />
                        <span className="font-display font-bold text-sm text-foreground">{outfit.label}</span>
                        {!outfit.owned && (
                          <span className="text-[10px] font-bold text-game-gold flex items-center gap-1">
                            🪙 {outfit.cost} moedas
                          </span>
                        )}
                        {outfit.owned && selectedOutfit === outfit.id && (
                          <span className="text-[10px] font-bold text-primary">EQUIPADO</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "emblemas" && (
                <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="font-display font-bold text-foreground">COLEÇÃO DE EMBLEMAS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {emblems.map((emblem) => (
                      <div
                        key={emblem.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          emblem.earned
                            ? "bg-game-gold/10 border-game-gold"
                            : "bg-muted/30 border-border opacity-50"
                        }`}
                      >
                        <span className="text-3xl">{emblem.icon}</span>
                        <div>
                          <p className="font-display font-bold text-sm text-foreground">{emblem.label}</p>
                          <p className="text-xs text-muted-foreground">{emblem.description}</p>
                          {emblem.earned && (
                            <span className="text-[10px] font-bold text-game-green flex items-center gap-1 mt-1">
                              <Award size={12} /> CONQUISTADO
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "cartao" && (
                <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="font-display font-bold text-foreground">CARTÃO DE APRESENTAÇÃO</h3>
                  <div className="bg-gradient-to-br from-primary to-game-teal-dark rounded-2xl p-6 text-primary-foreground max-w-md">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                        <img src={avatarImg} alt="Avatar" className="w-14 h-14 object-contain" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xl">{playerName}</h4>
                        <p className="text-sm opacity-80">Cavaleiro Financeiro</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-primary-foreground/10 rounded-xl p-2">
                        <p className="font-bold text-lg">5</p>
                        <p className="text-[10px] opacity-80">NÍVEL</p>
                      </div>
                      <div className="bg-primary-foreground/10 rounded-xl p-2">
                        <p className="font-bold text-lg">1.250</p>
                        <p className="text-[10px] opacity-80">XP TOTAL</p>
                      </div>
                      <div className="bg-primary-foreground/10 rounded-xl p-2">
                        <p className="font-bold text-lg">3</p>
                        <p className="text-[10px] opacity-80">EMBLEMAS</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-4 justify-center">
                      {emblems.filter(e => e.earned).map(e => (
                        <span key={e.id} className="text-xl">{e.icon}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Personagem;
