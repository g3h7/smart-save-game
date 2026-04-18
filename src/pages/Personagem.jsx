import React, { useState } from 'react';
import { User, LogOut, Coins, Check, Star, Shield, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

// Data Sets para Customização
const SKIN_TONES = [
  { id: 'skin-1', color: '#FAD6B1' }, // Claro
  { id: 'skin-2', color: '#D49C6E' }, // Médio Claro
  { id: 'skin-3', color: '#8D5524' }, // Médio Escuro
  { id: 'skin-4', color: '#3E2A1E' }, // Escuro
];

const HAIR_STYLES = [
  { id: 'hair-curto', label: 'Curto', shape: 'rounded-t-lg h-6 w-10' },
  { id: 'hair-longo', label: 'Longo', shape: 'rounded-t-xl rounded-b-md h-12 w-12' },
  { id: 'hair-moicano', label: 'Moicano', shape: 'rounded-t-full h-8 w-4' },
  { id: 'hair-careca', label: 'Careca', shape: 'hidden' }, // sem cabelo
];

const HAIR_COLORS = [
  { id: 'color-black', color: '#1F2937' },
  { id: 'color-brown', color: '#783F04' },
  { id: 'color-blonde', color: '#FCD34D' },
  { id: 'color-red', color: '#DC2626' },
  { id: 'color-blue', color: '#2563EB' },
  { id: 'color-purple', color: '#8B5CF6' },
];

const TABS = [
  { id: 'aparencia', label: 'APARÊNCIA' },
  { id: 'roupas', label: 'ROUPAS' },
  { id: 'emblemas', label: 'EMBLEMAS' },
  { id: 'cartao', label: 'CARTÃO' },
];

export default function Personagem() {
  const [activeTab, setActiveTab] = useState('aparencia');
  const [skin, setSkin] = useState(SKIN_TONES[1]);
  const [hair, setHair] = useState(HAIR_STYLES[1]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[1]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar/5 flex items-center justify-center rounded-xl">
             <User className="text-sidebar" size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-sidebar font-black text-2xl font-display uppercase tracking-wide">Personagem</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-warning/10 text-warning px-5 py-2.5 rounded-full flex items-center gap-2 border border-warning/20 shadow-sm">
             <Coins size={18} fill="#f97316" />
             <span className="font-extrabold text-sm font-display tracking-wider">3.500</span>
          </div>
          <button className="text-danger hover:bg-danger/5 px-5 py-2.5 rounded-full flex items-center gap-2 border border-danger/20 shadow-sm transition-colors uppercase text-xs font-black tracking-wider">
             <LogOut size={16} />
             Sair
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cx(
              "px-8 py-3 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-sm",
              activeTab === tab.id 
                ? "bg-sidebar text-white shadow-md scale-105" 
                : "bg-white text-gray-400 hover:text-sidebar hover:bg-gray-50 border border-gray-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Split Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        
        {/* LEFT PANEL: Preview Renderer (Pixel Art Simulator) */}
        <div className="lg:col-span-4 flex flex-col items-center">
           <div className="dashboard-card w-full flex flex-col items-center p-8 bg-white/60 backdrop-blur-sm border-sidebar/10 relative">
             <h3 className="font-black text-sidebar text-sm tracking-wider uppercase mb-6 relative z-10">Preview</h3>
             
             {/* Character Canvas Frame */}
             <div className="w-48 h-56 rounded-3xl bg-sidebar border-4 border-sidebar/10 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden mb-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                
                {/* Spritesheet Placeholder Container */}
                {/* imageRendering: 'pixelated' is critical for future Phaser/Tiled objects mapped here */}
                <div 
                   className="relative flex flex-col items-center justify-end h-32 scale-125 transition-all duration-300"
                   style={{ imageRendering: 'pixelated' }}
                >
                   {/* Hair Back / Long part if applicable */}
                   {hair.id === 'hair-longo' && (
                     <div 
                        className={cx("absolute -top-2 z-0", hair.shape)} 
                        style={{ backgroundColor: hairColor.color }} 
                     />
                   )}
                   
                   {/* Head / Skin Tone */}
                   <div 
                     className="w-12 h-12 rounded-full absolute top-2 z-10 flex items-center justify-center shadow-sm transition-colors duration-300"
                     style={{ backgroundColor: skin.color }}
                   >
                      {/* Face details */}
                      <div className="w-6 flex justify-between absolute top-4 opacity-60">
                         <div className="w-1 h-1 bg-sidebar rounded-full"></div>
                         <div className="w-1 h-1 bg-sidebar rounded-full"></div>
                      </div>
                      <div className="w-3 h-1 bg-sidebar/50 rounded-full absolute top-7"></div>
                      
                      {/* Hair Front */}
                      <div 
                        className={cx("absolute top-0 z-20", hair.shape, hair.id === 'hair-longo' && "h-4 rounded-b-none")}
                        style={{ backgroundColor: hairColor.color }}
                      ></div>
                   </div>

                   {/* Body / Shirt */}
                   <div className="w-16 h-14 rounded-t-2xl z-10 relative mt-12 overflow-hidden shadow-md bg-danger">
                      <div className="absolute top-2 w-full flex justify-center">
                         {/* Collar */}
                         <div className="w-6 h-3 rounded-b-full bg-danger/80 border-b-2 border-danger-dark"></div>
                      </div>
                      {/* Emblems applied to shirt */}
                      <div className="absolute inset-0 flex items-center justify-center text-white/50">
                         <Shield size={16} fill="currentColor" />
                      </div>
                   </div>

                   {/* Legs */}
                   <div className="flex gap-2 absolute -bottom-3 z-0">
                      <div className="w-4 h-6 rounded-b-md transition-colors" style={{ backgroundColor: skin.color }}></div>
                      <div className="w-4 h-6 rounded-b-md transition-colors" style={{ backgroundColor: skin.color }}></div>
                   </div>
                </div>
             </div>

             {/* Character Info */}
             <div className="text-center w-full">
                <h2 className="text-2xl font-black font-display text-sidebar mb-1">Jogador</h2>
                <div className="flex items-center justify-center gap-1.5 text-gray-400 font-bold text-sm mb-4">
                   <Star size={14} className="text-warning fill-warning/20 mb-0.5" />
                   <span>Nível 5</span>
                   <span className="mx-1">•</span>
                   <span>Guerreiro</span>
                </div>
                
                {/* Active Medals Array */}
                <div className="flex items-center justify-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20"><Star size={14} className="text-primary fill-primary" /></div>
                   <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center border border-warning/20"><Zap size={14} className="text-warning fill-warning" /></div>
                   <div className="w-8 h-8 rounded-lg bg-sidebar/10 flex items-center justify-center border border-sidebar/10 opacity-50"><Shield size={14} className="text-sidebar" /></div>
                </div>
             </div>
           </div>
        </div>

        {/* RIGHT PANEL: Customization Options */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeTab === 'aparencia' ? (
            <>
              {/* Box 1: Tom de Pele */}
              <div className="dashboard-card bg-white h-auto py-6">
                <h4 className="font-black text-xs uppercase tracking-wider text-sidebar mb-4">Tom de Pele</h4>
                <div className="flex gap-4">
                  {SKIN_TONES.map(t => {
                    const isSelected = skin.id === t.id;
                    return (
                      <button 
                        key={t.id}
                        onClick={() => setSkin(t)}
                        className={cx(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 p-1 relative",
                          isSelected ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg shadow-black/5" : "hover:scale-105 hover:ring-2 hover:ring-gray-200 ring-offset-1"
                        )}
                      >
                        <div className="w-full h-full rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: t.color }}></div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-sm">
                            <Check size={12} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Box 2: Estilo de Cabelo */}
              <div className="dashboard-card bg-white h-auto py-6">
                <h4 className="font-black text-xs uppercase tracking-wider text-sidebar mb-4">Estilo de Cabelo</h4>
                <div className="flex gap-4">
                  {HAIR_STYLES.map(style => {
                    const isSelected = hair.id === style.id;
                    return (
                      <button 
                        key={style.id}
                        onClick={() => setHair(style)}
                        className={cx(
                          "w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2",
                          isSelected 
                            ? "border-sidebar bg-sidebar text-white shadow-xl shadow-sidebar/20 scale-105" 
                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {/* Mini mockup do cabelo */}
                        <div className="w-8 h-8 rounded-full bg-[#fce7d8] flex flex-col items-center relative overflow-hidden mt-2 border border-black/5 shadow-inner">
                            <div className={cx("absolute inset-x-auto", style.shape, style.id === 'hair-longo' && "top-0 h-8", style.id !== 'hair-longo' && "top-0")} style={{ backgroundColor: hairColor.color }}></div>
                            <div className="flex gap-1 absolute top-3"><div className="w-[2px] h-[2px] bg-black/30 rounded-full"></div><div className="w-[2px] h-[2px] bg-black/30 rounded-full"></div></div>
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-wider">{style.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Box 3: Cor do Cabelo */}
              <div className="dashboard-card bg-white h-auto py-6">
                <h4 className="font-black text-xs uppercase tracking-wider text-sidebar mb-4">Cor do Cabelo</h4>
                <div className="flex flex-wrap gap-4">
                  {HAIR_COLORS.map(c => {
                    const isSelected = hairColor.id === c.id;
                    return (
                      <button 
                        key={c.id}
                        onClick={() => setHairColor(c)}
                        className={cx(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                          isSelected ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-md" : "hover:scale-110 hover:shadow-sm"
                        )}
                        style={{ backgroundColor: c.color }}
                      >
                        {isSelected && <Check size={16} strokeWidth={3} className={c.id === 'color-blonde' ? 'text-sidebar' : 'text-white'} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="dashboard-card bg-gray-50/50 flex flex-col items-center justify-center flex-1 min-h-[400px] border-dashed border-2 border-gray-200">
               <Shield size={48} className="text-gray-300 mb-4" />
               <h3 className="text-gray-400 font-display font-black text-xl mb-2 uppercase">Aba Em Construção</h3>
               <p className="text-gray-400 text-sm max-w-[250px] text-center font-medium">As propriedades estendidas do jogador estarão disponíveis na fase final de testes de itens.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
