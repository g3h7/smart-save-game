import GameSidebar from "@/components/GameSidebar";
import GameHeader from "@/components/GameHeader";
import { useState } from "react";
import { Shield, Sword, Crown, Star, Award, Gem, Coins, Check, Lock, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "@/contexts/CharacterContext";
import { toast } from "sonner";

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
  { id: "knight", label: "Cavaleiro", icon: Shield, cost: 0 },
  { id: "mage", label: "Mago", icon: Gem, cost: 0 },
  { id: "warrior", label: "Guerreiro", icon: Sword, cost: 500 },
  { id: "king", label: "Rei", icon: Crown, cost: 1000 },
];

const outfitEmojis: Record<string, string> = {
  knight: "🛡️",
  mage: "🧙",
  warrior: "⚔️",
  king: "👑",
};

const hairEmojiMap: Record<string, string> = {
  short: "💇",
  long: "💇‍♀️",
  mohawk: "🦹",
  bald: "👨‍🦲",
};

const emblems = [
  { id: "novice", label: "Novato", icon: "🌱", description: "Completou o primeiro módulo", earned: true },
  { id: "saver", label: "Poupador", icon: "💰", description: "Economizou R$1.000", earned: true },
  { id: "investor", label: "Investidor", icon: "📈", description: "Fez 5 investimentos", earned: true },
  { id: "scholar", label: "Estudioso", icon: "📚", description: "Completou 5 módulos", earned: false },
  { id: "master", label: "Mestre", icon: "🏆", description: "Completou todos os quizzes", earned: false },
  { id: "legend", label: "Lenda", icon: "⭐", description: "Alcançou nível 10", earned: false },
];

function AvatarPreview({ skinColor, hairStyle, hairColor, outfit }: {
  skinColor: string; hairStyle: string; hairColor: string; outfit: string;
}) {
  const skin = skinColors.find(s => s.id === skinColor)?.color || "hsl(25 50% 60%)";
  const hair = hairColors.find(h => h.id === hairColor)?.color || "hsl(0 0% 15%)";
  const outfitColor = outfit === "knight" ? "hsl(215 60% 50%)"
    : outfit === "mage" ? "hsl(270 50% 55%)"
    : outfit === "warrior" ? "hsl(0 50% 45%)"
    : "hsl(45 80% 50%)";

  return (
    <div className="relative w-32 h-40 flex flex-col items-center justify-end">
      {/* Hair */}
      {hairStyle !== "bald" && (
        <div
          className="absolute top-0 w-16 rounded-t-full"
          style={{
            backgroundColor: hair,
            height: hairStyle === "long" ? "28px" : hairStyle === "mohawk" ? "20px" : "14px",
            width: hairStyle === "mohawk" ? "10px" : "50px",
            borderRadius: hairStyle === "mohawk" ? "4px 4px 0 0" : "50% 50% 0 0",
            top: hairStyle === "mohawk" ? "2px" : "8px",
          }}
        />
      )}
      {/* Head */}
      <div
        className="w-14 h-14 rounded-full border-2 border-card shadow-md absolute top-4"
        style={{ backgroundColor: skin }}
      >
        <div className="flex items-center justify-center h-full text-lg">
          😊
        </div>
      </div>
      {/* Body/Outfit */}
      <div
        className="w-20 h-16 rounded-t-2xl border-2 border-card shadow-md flex items-center justify-center text-2xl"
        style={{ backgroundColor: outfitColor }}
      >
        {outfitEmojis[outfit] || "🛡️"}
      </div>
      {/* Legs */}
      <div className="flex gap-2">
        <div className="w-6 h-4 rounded-b-lg" style={{ backgroundColor: skin }} />
        <div className="w-6 h-4 rounded-b-lg" style={{ backgroundColor: skin }} />
      </div>
    </div>
  );
}

const Personagem = () => {
  const { appearance, updateAppearance, ownedOutfits, buyOutfit, coins } = useCharacter();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"aparencia" | "roupas" | "emblemas" | "cartao">("aparencia");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const playerName = localStorage.getItem("playerName") || "Jogador";

  const tabs = [
    { id: "aparencia" as const, label: "APARÊNCIA" },
    { id: "roupas" as const, label: "ROUPAS" },
    { id: "emblemas" as const, label: "EMBLEMAS" },
    { id: "cartao" as const, label: "CARTÃO" },
  ];

  const handleBuyOutfit = (id: string, cost: number) => {
    const success = buyOutfit(id, cost);
    if (success) {
      toast.success(`Traje "${outfits.find(o => o.id === id)?.label}" comprado!`);
      updateAppearance({ outfit: id });
    } else {
      toast.error("Moedas insuficientes!");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GameSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GameHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">🎭 PERSONAGEM</h2>
            <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full">
              <Coins className="text-accent" size={16} />
              <span className="font-display font-bold text-sm text-accent-foreground">{coins.toLocaleString("pt-BR")}</span>
            </div>
          </div>

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
              <div className="relative w-40 h-48 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-4 border-primary">
                <AvatarPreview
                  skinColor={appearance.skinColor}
                  hairStyle={appearance.hairStyle}
                  hairColor={appearance.hairColor}
                  outfit={appearance.outfit}
                />
              </div>
              <p className="font-display font-bold text-foreground text-lg">{playerName}</p>
              <div className="flex items-center gap-2">
                <Star className="text-accent" size={16} />
                <span className="text-sm font-bold text-muted-foreground">
                  Nível 5 • {outfits.find(o => o.id === appearance.outfit)?.label || "Cavaleiro"}
                </span>
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
                          onClick={() => updateAppearance({ skinColor: skin.id })}
                          className={`w-12 h-12 rounded-xl border-2 transition-all relative ${
                            appearance.skinColor === skin.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-border hover:border-primary/50"
                          }`}
                          style={{ backgroundColor: skin.color }}
                          title={skin.label}
                        >
                          {appearance.skinColor === skin.id && (
                            <Check className="absolute inset-0 m-auto text-card" size={18} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                    <h3 className="font-display font-bold text-foreground">ESTILO DE CABELO</h3>
                    <div className="flex gap-3">
                      {hairStyles.map((hair) => (
                        <button
                          key={hair.id}
                          onClick={() => updateAppearance({ hairStyle: hair.id })}
                          className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                            appearance.hairStyle === hair.id
                              ? "bg-primary text-primary-foreground shadow-button border-primary"
                              : "bg-muted text-muted-foreground hover:bg-secondary border-border"
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
                          onClick={() => updateAppearance({ hairColor: hc.id })}
                          className={`w-10 h-10 rounded-full transition-all relative ${
                            appearance.hairColor === hc.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-primary/50"
                          }`}
                          style={{ backgroundColor: hc.color }}
                          title={hc.label}
                        >
                          {appearance.hairColor === hc.id && (
                            <Check className="absolute inset-0 m-auto text-card" size={14} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "roupas" && (
                <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="font-display font-bold text-foreground">TRAJES DISPONÍVEIS</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {outfits.map((outfit) => {
                      const owned = ownedOutfits.includes(outfit.id);
                      const equipped = appearance.outfit === outfit.id;
                      return (
                        <button
                          key={outfit.id}
                          onClick={() => {
                            if (owned) {
                              updateAppearance({ outfit: outfit.id });
                              toast.success(`Traje "${outfit.label}" equipado!`);
                            } else {
                              handleBuyOutfit(outfit.id, outfit.cost);
                            }
                          }}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                            equipped
                              ? "bg-primary/10 border-primary shadow-md"
                              : owned
                                ? "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                                : "bg-muted/50 border-border hover:border-accent/50"
                          }`}
                        >
                          <outfit.icon
                            size={32}
                            className={equipped ? "text-primary" : owned ? "text-muted-foreground" : "text-muted-foreground/50"}
                          />
                          <span className="font-display font-bold text-sm text-foreground">{outfit.label}</span>
                          {!owned && (
                            <span className="text-[10px] font-bold text-accent flex items-center gap-1">
                              <Coins size={10} /> {outfit.cost} moedas
                            </span>
                          )}
                          {owned && equipped && (
                            <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                              <Check size={10} /> EQUIPADO
                            </span>
                          )}
                          {owned && !equipped && (
                            <span className="text-[10px] font-bold text-muted-foreground">CLIQUE PARA EQUIPAR</span>
                          )}
                          {!owned && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Lock size={10} /> COMPRAR
                            </span>
                          )}
                        </button>
                      );
                    })}
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
                            ? "bg-accent/10 border-accent"
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
                  <div className="bg-gradient-to-br from-primary to-primary/60 rounded-2xl p-6 text-primary-foreground max-w-md">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                        <AvatarPreview
                          skinColor={appearance.skinColor}
                          hairStyle={appearance.hairStyle}
                          hairColor={appearance.hairColor}
                          outfit={appearance.outfit}
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xl">{playerName}</h4>
                        <p className="text-sm opacity-80">
                          {outfits.find(o => o.id === appearance.outfit)?.label || "Cavaleiro"} Financeiro
                        </p>
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
                        <p className="font-bold text-lg">{emblems.filter(e => e.earned).length}</p>
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
