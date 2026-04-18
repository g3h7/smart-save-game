import React from 'react';
import { Home, DollarSign, Map, BookOpen, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

const navItems = [
  { id: 'inicio', label: 'INÍCIO', icon: Home },
  { id: 'financas', label: 'FINANÇAS', icon: DollarSign },
  { id: 'mapa', label: 'MAPA', icon: Map },
  { id: 'modulos', label: 'MÓDULOS', icon: BookOpen },
  { id: 'personagem', label: 'PERSONAGEM', icon: User },
  { id: 'perfil', label: 'PERFIL', icon: Settings },
];

export default function Sidebar({ activeRoute, setActiveRoute }) {

  return (
    <aside className="w-28 bg-sidebar flex flex-col items-center py-8 text-white h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-20">
      <nav className="flex-1 flex flex-col items-center w-full gap-4 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveRoute(item.id)}
              className={cx(
                "flex flex-col items-center justify-center w-24 h-24 rounded-[32px] transition-all duration-300 ease-out group",
                isActive 
                  ? "bg-[#273859] shadow-inner text-white scale-100" 
                  : "text-gray-400 hover:text-white hover:bg-[#1a263d] scale-95 hover:scale-100"
              )}
            >
              <div className={cx(
                "mb-2 p-3 rounded-full transition-colors",
                isActive ? "bg-white text-sidebar" : "bg-transparent text-gray-400 group-hover:text-white"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  );
}
