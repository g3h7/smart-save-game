import React from 'react';
import { Shield, Hammer, Coins } from 'lucide-react';
import { useEconomy } from '../contexts/EconomyContext';

export default function Personagem() {
  const { globalState } = useEconomy();
  const saldo = globalState?.saldo ?? 0;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-pixel pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b-4 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#734c31] border-4 border-[#4a3319] flex items-center justify-center pixel-shadow-sm">
             <Shield className="text-white" size={20} />
          </div>
          <h2 className="text-[#52331c] text-lg font-bold uppercase tracking-wider">PERSONAGEM</h2>
        </div>
        
        {/* Coins indicator displaying real player saldo */}
        <div className="bg-[#fff4e0] border-4 border-[#734c31] text-[#52331c] px-5 py-3 flex items-center gap-3 pixel-shadow-sm select-none">
          <Coins size={16} fill="#f97316" className="text-[#f97316]" />
          <span className="font-bold text-xs tracking-wider">
            {Math.floor(saldo).toLocaleString('pt-BR')} MOEDAS
          </span>
        </div>
      </div>

      {/* Main Themed Dialogue Box (RPG Menu Box) */}
      <div className="max-w-3xl mx-auto bg-[#e5c59a] border-[8px] border-[#734c31] pixel-shadow-md p-8 text-center relative mt-8">
        
        {/* Corner Pixel Hinges */}
        <div className="absolute -top-[8px] -left-[8px] w-4 h-4 bg-[#4a3319]"></div>
        <div className="absolute -top-[8px] -right-[8px] w-4 h-4 bg-[#4a3319]"></div>
        <div className="absolute -bottom-[8px] -left-[8px] w-4 h-4 bg-[#4a3319]"></div>
        <div className="absolute -bottom-[8px] -right-[8px] w-4 h-4 bg-[#4a3319]"></div>

        {/* Animated Construction RPG Icon */}
        <div className="mx-auto w-24 h-24 bg-[#baa07b] border-4 border-[#734c31] flex items-center justify-center mb-6 pixel-shadow-sm animate-bounce">
          <Hammer size={40} className="text-[#52331c]" />
        </div>

        {/* Construction Title */}
        <h3 className="text-sm font-bold text-[#52331c] tracking-wider mb-4">
          [ ÁREA EM CONSTRUÇÃO ]
        </h3>

        {/* Thematic NPC Dialogue */}
        <div className="bg-[#f7e6c4] border-4 border-[#baa07b] p-6 text-left mb-6">
          <p className="text-[10px] text-[#52331c] font-bold leading-relaxed uppercase">
            💬 DICA DO NPC (FERREIRO):
          </p>
          <p className="text-[9px] text-[#52331c] mt-3 leading-loose uppercase">
            "Nossos ferreiros e alfaiates reais estão trabalhando dia e noite na forja da fazenda! Em breve, você poderá gastar suas moedas para customizar sua skin, comprar armaduras lendárias e ostentar emblemas de sabedoria financeira no seu cartão de aventureiro. Volte mais tarde!"
          </p>
        </div>

        {/* Progress Bar (RPG Quest style) */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] font-bold text-[#52331c]">
            <span>FORJANDO SISTEMA...</span>
            <span>75%</span>
          </div>
          <div className="w-full h-6 bg-[#fff4e0] border-4 border-[#734c31] p-0.5 rounded-none overflow-hidden relative">
            <div className="h-full bg-[#5cb85c] border-r-4 border-[#2b612b]" style={{ width: '75%' }}></div>
          </div>
        </div>

      </div>

      {/* Aesthetic Footer Hint */}
      <div className="mt-8 text-center text-gray-500 text-[8px] tracking-normal select-none uppercase">
        <p className="drop-shadow-[1px_1px_0px_white]">
          Explore as abas Início, Módulos ou Finanças para continuar sua jornada.
        </p>
      </div>

    </div>
  );
}
