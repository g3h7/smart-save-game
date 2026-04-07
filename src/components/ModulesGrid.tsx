import { Play, ClipboardList } from "lucide-react";

const modules = [
  {
    title: "PRIMEIROS PASSOS",
    type: "QUIZ",
    action: "JOGAR QUIZ",
    icon: ClipboardList,
    color: "bg-accent",
  },
  {
    title: "AULA 5: FUNDOS IMOBILIÁRIOS",
    type: "VÍDEO",
    action: "COMEÇAR",
    icon: Play,
    color: "bg-primary",
  },
  {
    title: "AULA 5: INVESTIMENTOS EM RENDA FIXA",
    type: "VÍDEO",
    action: "COMEÇAR",
    icon: Play,
    color: "bg-game-navy-dark",
  },
  {
    title: "QUIZ DE REVISÃO",
    type: "QUIZ",
    action: "JOGAR QUIZ",
    icon: ClipboardList,
    color: "bg-game-green",
  },
];

const ModulesGrid = () => {
  return (
    <div>
      <h3 className="font-display text-xl font-bold text-foreground mb-4">MÓDULOS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-card game-card-hover flex items-center gap-4">
            <div className={`${mod.color} w-16 h-16 rounded-xl flex items-center justify-center shrink-0`}>
              <mod.icon className="text-primary-foreground" size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-display font-bold text-sm text-foreground">{mod.title}</h4>
              <p className="text-xs text-muted-foreground font-semibold">{mod.type}</p>
              <button className="mt-2 bg-accent text-accent-foreground font-display font-bold text-xs px-4 py-1.5 rounded-lg shadow-button hover:brightness-110 transition-all">
                {mod.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesGrid;
