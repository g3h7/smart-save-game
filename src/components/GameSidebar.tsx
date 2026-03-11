import { Home, DollarSign, User, BookOpen, Settings, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "INÍCIO", id: "inicio", route: "/dashboard" },
  { icon: DollarSign, label: "FINANÇAS", id: "financas", route: "/financas" },
  { icon: Map, label: "MAPA", id: "mapa", route: "/mapa" },
  { icon: BookOpen, label: "MÓDULOS", id: "modulos", route: "/modulos" },
  { icon: User, label: "PERSONAGEM", id: "personagem", route: "/personagem" },
  { icon: Settings, label: "PERFIL", id: "perfil", route: "/dashboard" },
];

const GameSidebar = () => {
  const [active, setActive] = useState("inicio");
  const navigate = useNavigate();

  return (
    <aside className="w-24 bg-card border-r border-border flex flex-col items-center py-6 gap-2 shadow-card">
      {menuItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { setActive(item.id); navigate(item.route); }}
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
