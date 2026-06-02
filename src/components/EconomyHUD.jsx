import React, { useState, useEffect } from 'react';
import { useEconomy } from '../contexts/EconomyContext';
import { Wallet, TrendingUp, Building, PiggyBank, Bell } from 'lucide-react';
import { EventBus } from '../game/EventBus';

export default function EconomyHUD() {
  const { globalState } = useEconomy();
  const [toastMessage, setToastMessage] = useState(null);

  const saldo = globalState?.saldo ?? 0;
  const cdi = globalState?.cdi ?? 0;
  const cofre = globalState?.cofre ?? 0;
  const fii = globalState?.fii ?? 0;

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  useEffect(() => {
    const handleYield = (amount) => {
      setToastMessage(`Seus investimentos renderam! Confira no seu Dashboard (+${formatCurrency(amount)})`);
      setTimeout(() => setToastMessage(null), 5000);
    };

    EventBus.on('yield-applied', handleYield);
    return () => EventBus.off('yield-applied', handleYield);
  }, []);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg border border-emerald-400 flex items-center gap-3">
            <Bell size={18} className="animate-bounce" />
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none mt-4">
        {/* Container Principal do HUD usando Glassmorphism */}
        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 flex gap-6 items-center transition-all duration-300">
          
          {/* Saldo */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet size={14} className="text-emerald-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saldo</span>
            </div>
            <span className="text-xl font-black text-emerald-400 drop-shadow-sm">
              {formatCurrency(saldo)}
            </span>
          </div>

          <div className="w-px h-10 bg-slate-700/50 rounded-full"></div>

          {/* CDI */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-blue-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CDI</span>
            </div>
            <span className="text-xl font-black text-blue-400 drop-shadow-sm">
              {formatCurrency(cdi)}
            </span>
          </div>

          <div className="w-px h-10 bg-slate-700/50 rounded-full"></div>

          {/* Cofre */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="flex items-center gap-1.5 mb-1">
              <PiggyBank size={14} className="text-pink-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cofre</span>
            </div>
            <span className="text-xl font-black text-pink-400 drop-shadow-sm">
              {formatCurrency(cofre)}
            </span>
          </div>

          <div className="w-px h-10 bg-slate-700/50 rounded-full"></div>

          {/* Cotas FII */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="flex items-center gap-1.5 mb-1">
              <Building size={14} className="text-purple-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cotas FII</span>
            </div>
            <span className="text-xl font-black text-purple-400 drop-shadow-sm">
              {fii}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
