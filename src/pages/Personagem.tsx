import GameSidebar from "@/components/GameSidebar";
import GameHeader from "@/components/GameHeader";
import { useState } from "react";
import { 
  Shield, Sword, Crown, Star, Award, Gem, Coins, Check, Lock, 
  Glasses, Sliders, Backpack, Wand2, Hammer, Axe, Zap, Ghost,
  Gift, Heart, Music, Camera, Map as MapIcon, User
} from "lucide-react";
import { useCharacter } from "@/contexts/CharacterContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  { id: "curly", label: "Cacheado", emoji: "👩‍🦱" },
  { id: "ponytail", label: "Preso", emoji: "👱‍♀️" },
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
  { id: "warrior", label: "Guerreiro", icon: Sword, cost: 0 },
  { id: "king", label: "Rei", icon: Crown, cost: 0 },
  { id: "rogue", label: "Ladino", icon: Ghost, cost: 0 },
  { id: "explorer", label: "Explorador", icon: MapIcon, cost: 0 },
];

const accessories = [
  { id: "none", label: "Nenhum", icon: Sliders, cost: 0, emoji: "" },
  { id: "glasses", label: "Óculos", icon: Glasses, cost: 0, emoji: "👓" },
  { id: "crown", label: "Coroa", icon: Crown, cost: 0, emoji: "👑" },
  { id: "hat", label: "Chapéu", icon: Gift, cost: 0, emoji: "🤠" },
  { id: "backpack", label: "Mochila", icon: Backpack, cost: 0, emoji: "🎒" },
  { id: "necklace", label: "Colar", icon: Heart, cost: 0, emoji: "📿" },
];

const weapons = [
  { id: "none", label: "Nenhuma", icon: Sliders, cost: 0, emoji: "" },
  { id: "sword", label: "Espada", icon: Sword, cost: 0, emoji: "⚔️" },
  { id: "wand", label: "Varinha", icon: Wand2, cost: 0, emoji: "🪄" },
  { id: "staff", label: "Cajado", icon: Zap, cost: 0, emoji: "🪄" },
  { id: "shield", label: "Escudo", icon: Shield, cost: 0, emoji: "🛡️" },
  { id: "bow", label: "Arco", icon: MapIcon, cost: 0, emoji: "🏹" },
];

const outfitEmojis: Record<string, string> = {
  knight: "🛡️",
  mage: "🧙",
  warrior: "⚔️",
  king: "👑",
  rogue: "🥷",
  explorer: "🧗",
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

function AvatarPreview({ skinColor, hairStyle, hairColor, outfit, accessory, weapon }: {
  skinColor: string; hairStyle: string; hairColor: string; outfit: string; accessory: string; weapon: string;
}) {
  const skin = skinColors.find(s => s.id === skinColor)?.color || "hsl(25 50% 60%)";
  const hair = hairColors.find(h => h.id === hairColor)?.color || "hsl(0 0% 15%)";
  const outfitColor = outfit === "knight" ? "hsl(215 60% 50%)"
    : outfit === "mage" ? "hsl(270 50% 55%)"
    : outfit === "warrior" ? "hsl(0 50% 45%)"
    : outfit === "rogue" ? "hsl(0 0% 20%)"
    : outfit === "explorer" ? "hsl(35 50% 40%)"
    : "hsl(45 80% 50%)";

  const accEmoji = accessories.find(a => a.id === accessory)?.emoji || "";
  const weaponEmoji = weapons.find(w => w.id === weapon)?.emoji || "";

  return (
    <div className="relative w-32 h-40 flex flex-col items-center justify-end">
      {/* Backpack Accessory (Behind) */}
      {accessory === "backpack" && (
        <div className="absolute top-16 -right-2 text-2xl transform rotate-12">
          {accEmoji}
        </div>
      )}

      {/* Hair */}
      {hairStyle !== "bald" && (
        <div
          className="absolute top-0 w-16 rounded-t-full z-10"
          style={{
            backgroundColor: hair,
            height: hairStyle === "long" ? "28px" : hairStyle === "mohawk" ? "20px" : hairStyle === "curly" ? "24px" : "14px",
            width: hairStyle === "mohawk" ? "10px" : "50px",
            borderRadius: hairStyle === "mohawk" ? "4px 4px 0 0" : "50% 50% 0 0",
            top: hairStyle === "mohawk" ? "2px" : "8px",
          }}
        />
      )}
      
      {/* Head */}
      <div
        className="w-14 h-14 rounded-full border-2 border-card shadow-md absolute top-4 z-20"
        style={{ backgroundColor: skin }}
      >
        <div className="flex items-center justify-center h-full text-lg relative">
          😊
          {/* Facial Accessory */}
          {accessory === "glasses" && (
            <span className="absolute inset-0 flex items-center justify-center text-xs mt-1">
              {accEmoji}
            </span>
          )}
        </div>
      </div>

      {/* Head Accessory (Top) */}
      {(accessory === "crown" || accessory === "hat") && (
        <div className="absolute -top-1 z-30 text-xl">
          {accEmoji}
        </div>
      )}

      {/* Neck Accessory */}
      {accessory === "necklace" && (
        <div className="absolute top-14 z-30 text-sm">
          {accEmoji}
        </div>
      )}

      {/* Body/Outfit */}
      <div
        className="w-20 h-16 rounded-t-2xl border-2 border-card shadow-md flex items-center justify-center text-2xl z-10 relative"
        style={{ backgroundColor: outfitColor }}
      >
        {outfitEmojis[outfit] || "🛡️"}
        
        {/* Weapon */}
        {weapon !== "none" && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-2xl transform rotate-12 drop-shadow-md">
            {weaponEmoji}
          </div>
        )}
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
  const [activeTab, setActiveTab] = useState<"aparencia" | "roupas" | "acessorios" | "itens" | "emblemas" | "cartao">("aparencia");

  const playerName = localStorage.getItem("playerName") || "Jogador";

  const tabs = [
    { id: "aparencia" as const, label: "APARÊNCIA", icon: User },
    { id: "roupas" as const, label: "ROUPAS", icon: Shield },
    { id: "acessorios" as const, label: "ACESSÓRIOS", icon: Glasses },
    { id: "itens" as const, label: "ITENS", icon: Sword },
    { id: "emblemas" as const, label: "EMBLEMAS", icon: Award },
    { id: "cartao" as const, label: "CARTÃO", icon: Star },
  ];

  const handleBuyOutfit = (id: string, cost: number) => {
    const success = buyOutfit(id, cost);
    if (success) {
      toast.success(`Item desbloqueado!`);
      updateAppearance({ outfit: id });
    } else {
      toast.error("Moedas insuficientes!");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GameSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GameHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">🎭 CUSTOMIZAÇÃO</h2>
              <p className="text-muted-foreground text-sm">Personalize seu avatar para as aventuras do Educa$h</p>
            </div>
            <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <Coins className="text-accent" size={20} />
              <span className="font-display font-bold text-lg text-accent-foreground">{coins.toLocaleString("pt-BR")}</span>
            </div>
          </motion.div>

          {/* Tabs - Now more RPG like with icons */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 font-display font-bold text-xs px-5 py-3 rounded-xl transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-button scale-105"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Panel - Improved with Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative w-48 h-56 rounded-3xl bg-muted/50 flex items-center justify-center overflow-hidden border-4 border-primary/20 backdrop-blur-sm">
                  <AvatarPreview
                    skinColor={appearance.skinColor}
                    hairStyle={appearance.hairStyle}
                    hairColor={appearance.hairColor}
                    outfit={appearance.outfit}
                    accessory={appearance.accessory}
                    weapon={appearance.weapon}
                  />
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-foreground text-2xl">{playerName}</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">Nível 5</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border/50">
                <div className="flex flex-col items-center gap-1">
                  <Shield size={16} className="text-primary" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Defesa</span>
                  <span className="text-sm font-bold">45</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Sword size={16} className="text-accent" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Ataque</span>
                  <span className="text-sm font-bold">32</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap size={16} className="text-game-green" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Magia</span>
                  <span className="text-sm font-bold">78</span>
                </div>
              </div>
            </motion.div>

            {/* Customization panel */}
            <div className="lg:col-span-2 space-y-6 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === "aparencia" && (
                  <motion.div
                    key="aparencia"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
                      <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                        <User size={18} className="text-primary" /> TOM DE PELE
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {skinColors.map((skin) => (
                          <button
                            key={skin.id}
                            onClick={() => updateAppearance({ skinColor: skin.id })}
                            className={`w-14 h-14 rounded-2xl border-2 transition-all relative ${
                              appearance.skinColor === skin.id ? "border-primary ring-4 ring-primary/20 scale-110" : "border-border hover:border-primary/50"
                            }`}
                            style={{ backgroundColor: skin.color }}
                            title={skin.label}
                          >
                            {appearance.skinColor === skin.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                                <Check className="text-white" size={24} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
                      <h3 className="font-display font-bold text-foreground">ESTILO DE CABELO</h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {hairStyles.map((hair) => (
                          <button
                            key={hair.id}
                            onClick={() => updateAppearance({ hairStyle: hair.id })}
                            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                              appearance.hairStyle === hair.id
                                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                                : "bg-muted/50 text-muted-foreground hover:bg-secondary border-border"
                            }`}
                          >
                            <span className="text-2xl">{hair.emoji}</span>
                            <span className="text-[10px] font-bold uppercase">{hair.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
                      <h3 className="font-display font-bold text-foreground">COR DO CABELO</h3>
                      <div className="flex flex-wrap gap-3">
                        {hairColors.map((hc) => (
                          <button
                            key={hc.id}
                            onClick={() => updateAppearance({ hairColor: hc.id })}
                            className={`w-10 h-10 rounded-full transition-all relative ${
                              appearance.hairColor === hc.id ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: hc.color }}
                            title={hc.label}
                          >
                            {appearance.hairColor === hc.id && (
                              <Check className="absolute inset-0 m-auto text-card" size={16} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "roupas" && (
                  <motion.div
                    key="roupas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {outfits.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => {
                          updateAppearance({ outfit: outfit.id });
                          toast.success(`Traje equipado!`);
                        }}
                        className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                          appearance.outfit === outfit.id
                            ? "bg-primary/10 border-primary shadow-lg ring-1 ring-primary"
                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <outfit.icon
                          size={40}
                          className={appearance.outfit === outfit.id ? "text-primary" : "text-muted-foreground"}
                        />
                        <span className="font-display font-bold text-sm text-foreground">{outfit.label}</span>
                        {appearance.outfit === outfit.id ? (
                          <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                            <Check size={12} /> EQUIPADO
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Selecionar</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "acessorios" && (
                  <motion.div
                    key="acessorios"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {accessories.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          updateAppearance({ accessory: acc.id });
                          toast.success(`Acessório atualizado!`);
                        }}
                        className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                          appearance.accessory === acc.id
                            ? "bg-primary/10 border-primary shadow-lg ring-1 ring-primary"
                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <acc.icon
                          size={40}
                          className={appearance.accessory === acc.id ? "text-primary" : "text-muted-foreground"}
                        />
                        <span className="font-display font-bold text-sm text-foreground">{acc.label}</span>
                        <span className="text-2xl mt-1">{acc.emoji}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "itens" && (
                  <motion.div
                    key="itens"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {weapons.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          updateAppearance({ weapon: w.id });
                          toast.success(`Equipamento alterado!`);
                        }}
                        className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                          appearance.weapon === w.id
                            ? "bg-accent/10 border-accent shadow-lg ring-1 ring-accent"
                            : "bg-card border-border hover:border-accent/50 hover:bg-muted/30"
                        }`}
                      >
                        <w.icon
                          size={40}
                          className={appearance.weapon === w.id ? "text-accent" : "text-muted-foreground"}
                        />
                        <span className="font-display font-bold text-sm text-foreground">{w.label}</span>
                        <span className="text-2xl mt-1">{w.emoji}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "emblemas" && (
                  <motion.div
                    key="emblemas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {emblems.map((emblem) => (
                      <div
                        key={emblem.id}
                        className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                          emblem.earned
                            ? "bg-accent/10 border-accent shadow-md"
                            : "bg-muted/30 border-border opacity-50 grayscale"
                        }`}
                      >
                        <span className="text-4xl filter drop-shadow-sm">{emblem.icon}</span>
                        <div>
                          <p className="font-display font-bold text-base text-foreground">{emblem.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{emblem.description}</p>
                          {emblem.earned && (
                            <span className="text-[10px] font-bold text-game-green flex items-center gap-1 mt-2 bg-game-green/10 px-2 py-0.5 rounded-full w-fit">
                              <Award size={12} /> CONQUISTADO
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "cartao" && (
                  <motion.div
                    key="cartao"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <div className="bg-gradient-to-br from-primary via-primary/80 to-accent rounded-3xl p-8 text-primary-foreground max-w-md w-full shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                        <Star size={200} fill="currentColor" />
                      </div>
                      
                      <div className="flex items-center gap-6 mb-8 relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border-2 border-white/30">
                          <AvatarPreview
                            skinColor={appearance.skinColor}
                            hairStyle={appearance.hairStyle}
                            hairColor={appearance.hairColor}
                            outfit={appearance.outfit}
                            accessory={appearance.accessory}
                            weapon={appearance.weapon}
                          />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-3xl">{playerName}</h4>
                          <div className="flex items-center gap-2 text-white/80">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold font-mono">ID: #{Math.floor(Math.random() * 9000) + 1000}</span>
                            <span className="text-sm">• {outfits.find(o => o.id === appearance.outfit)?.label || "Aventureiro"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center relative z-10">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                          <p className="font-bold text-2xl">5</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">Nível</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                          <p className="font-bold text-2xl">1.2k</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">XP</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                          <p className="font-bold text-2xl">{emblems.filter(e => e.earned).length}</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">Emblemas</p>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex flex-col gap-3 relative z-10">
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Emblemas em Destaque</p>
                        <div className="flex gap-2">
                          {emblems.filter(e => e.earned).slice(0, 5).map(e => (
                            <div key={e.id} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shadow-inner" title={e.label}>
                              {e.icon}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Personagem;
