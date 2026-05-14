import React from 'react';
import { useEconomy } from '../contexts/EconomyContext';
import { Wallet, TrendingUp, Building } from 'lucide-react';

export default function EconomyHUD() {
  const { globalState } = useEconomy();

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none mt-4">
      {/* Container Principal do HUD usando Glassmorphism */}
      <div className="bg-slate-900/80 backdrop-blur-md px-8 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 flex gap-10 items-center transition-all duration-300">
        
        {/* Saldo */}
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saldo</span>
          </div>
          <span className="text-xl font-black text-emerald-400 drop-shadow-sm">
            {formatCurrency(globalState.saldo)}
          </span>
        </div>

        {/* Separador */}
        <div className="w-px h-10 bg-slate-700/50 rounded-full"></div>

        {/* CDI */}
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} className="text-blue-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CDI</span>
          </div>
          <span className="text-xl font-black text-blue-400 drop-shadow-sm">
            {formatCurrency(globalState.investimentoCDI)}
          </span>
        </div>

        {/* Separador */}
        <div className="w-px h-10 bg-slate-700/50 rounded-full"></div>

        {/* Cotas FII */}
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Building size={14} className="text-purple-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cotas FII</span>
          </div>
          <span className="text-xl font-black text-purple-400 drop-shadow-sm">
            {globalState.cotasFII}
          </span>
        </div>

      </div>
    </div>
  );
}
