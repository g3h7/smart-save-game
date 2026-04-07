import GameSidebar from "@/components/GameSidebar";
import GameHeader from "@/components/GameHeader";
import { Play, ClipboardList, Lock, CheckCircle, Star } from "lucide-react";

const modules = [
  {
    title: "PRIMEIROS PASSOS",
    description: "Aprenda os conceitos básicos de educação financeira",
    type: "QUIZ",
    action: "JOGAR QUIZ",
    icon: ClipboardList,
    color: "bg-accent",
    status: "completed",
    xp: 50,
  },
  {
    title: "AULA 1: O QUE É DINHEIRO?",
    description: "Entenda a história e o papel do dinheiro na sociedade",
    type: "VÍDEO",
    action: "REVER",
    icon: Play,
    color: "bg-primary",
    status: "completed",
    xp: 30,
  },
  {
    title: "AULA 2: ORÇAMENTO PESSOAL",
    description: "Como organizar suas receitas e despesas mensais",
    type: "VÍDEO",
    action: "REVER",
    icon: Play,
    color: "bg-primary",
    status: "completed",
    xp: 30,
  },
  {
    title: "QUIZ DE REVISÃO 1",
    description: "Teste seus conhecimentos sobre dinheiro e orçamento",
    type: "QUIZ",
    action: "JOGAR QUIZ",
    icon: ClipboardList,
    color: "bg-game-green",
    status: "available",
    xp: 80,
  },
  {
    title: "AULA 3: POUPANÇA E RESERVA",
    description: "A importância de poupar e criar sua reserva de emergência",
    type: "VÍDEO",
    action: "COMEÇAR",
    icon: Play,
    color: "bg-primary",
    status: "available",
    xp: 30,
  },
  {
    title: "AULA 4: JUROS COMPOSTOS",
    description: "O poder dos juros compostos nos seus investimentos",
    type: "VÍDEO",
    action: "COMEÇAR",
    icon: Play,
    color: "bg-game-navy-dark",
    status: "locked",
    xp: 40,
  },
  {
    title: "AULA 5: FUNDOS IMOBILIÁRIOS",
    description: "Entenda como funcionam os FIIs e como investir",
    type: "VÍDEO",
    action: "COMEÇAR",
    icon: Play,
    color: "bg-game-navy-dark",
    status: "locked",
    xp: 40,
  },
  {
    title: "AULA 6: RENDA FIXA",
    description: "CDB, Tesouro Direto e outros investimentos seguros",
    type: "VÍDEO",
    action: "COMEÇAR",
    icon: Play,
    color: "bg-game-navy-dark",
    status: "locked",
    xp: 40,
  },
  {
    title: "QUIZ FINAL",
    description: "Prove que você domina educação financeira!",
    type: "QUIZ",
    action: "JOGAR QUIZ",
    icon: ClipboardList,
    color: "bg-accent",
    status: "locked",
    xp: 150,
  },
];

const statusConfig = {
  completed: { badge: "CONCLUÍDO", badgeClass: "bg-game-green text-primary-foreground", opacity: "" },
  available: { badge: "DISPONÍVEL", badgeClass: "bg-accent text-accent-foreground", opacity: "" },
  locked: { badge: "BLOQUEADO", badgeClass: "bg-muted text-muted-foreground", opacity: "opacity-60" },
};

const Modulos = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GameSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GameHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">📚 MÓDULOS DE APRENDIZADO</h2>
            <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-2 shadow-card">
              <Star className="text-accent" size={20} />
              <span className="font-display font-bold text-sm text-foreground">3/9 completos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const config = statusConfig[mod.status as keyof typeof statusConfig];
              const isLocked = mod.status === "locked";
              return (
                <div
                  key={i}
                  className={`bg-card rounded-2xl p-5 shadow-card game-card-hover flex flex-col gap-3 relative ${config.opacity}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${mod.color} w-14 h-14 rounded-full flex items-center justify-center shrink-0`}>
                      {isLocked ? (
                        <Lock className="text-primary-foreground" size={24} />
                      ) : mod.status === "completed" ? (
                        <CheckCircle className="text-primary-foreground" size={24} />
                      ) : (
                        <mod.icon className="text-primary-foreground" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                          {config.badge}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">{mod.type}</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-foreground leading-tight">{mod.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{mod.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-accent flex items-center gap-1">
                      <Star size={14} /> +{mod.xp} XP
                    </span>
                    <button
                      disabled={isLocked}
                      className={`font-display font-bold text-xs px-4 py-1.5 rounded-lg transition-all
                        ${isLocked
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-accent text-accent-foreground shadow-button hover:brightness-110"
                        }`}
                    >
                      {mod.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Modulos;
