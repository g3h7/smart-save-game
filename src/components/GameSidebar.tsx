import { Home, DollarSign, User, BookOpen, Settings } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "INÍCIO", id: "inicio" },
  { icon: DollarSign, label: "FINANÇAS", id: "financas" },
  { icon: User, label: "PERSONAGEM", id: "personagem" },
  { icon: BookOpen, label: "CONTEÚDO", id: "conteudo" },
  { icon: Settings, label: "PERFIL", id: "perfil" },
];

const GameSidebar = () => {
  const [active, setActive] = useState("inicio");

  return (
    <aside className="w-24 bg-card border-r border-border flex flex-col items-center py-6 gap-2 shadow-card">
      {menuItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl w-20 transition-all font-display text-xs font-semibold
              ${isActive 
                ? "bg-primary text-primary-foreground shadow-button" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default GameSidebar;
