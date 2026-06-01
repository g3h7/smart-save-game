import React, { useState, useEffect } from 'react';
import { useEconomy } from '../../contexts/EconomyContext';
import { EventBus } from '../../game/EventBus';
import { X, Landmark, TrendingUp, Wallet } from 'lucide-react';

export default function InvestmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { globalState, updateEconomyState } = useEconomy();
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('cofre'); // 'cofre' or 'cdi'
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setAmount('');
      setError('');
    };

    EventBus.on('open-investment-modal', handleOpen);
    return () => EventBus.off('open-investment-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleInvest = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Digite um valor válido.');
      return;
    }

    if (val > globalState.saldo) {
      setError('Saldo insuficiente.');
      return;
    }

    // Processar o investimento
    const updates = {
      saldo: globalState.saldo - val
    };

    if (selectedAsset === 'cofre') {
      updates.cofre = globalState.cofre + val;
    } else {
      updates.cdi = globalState.cdi + val;
    }

    updateEconomyState(updates);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Landmark size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 font-display">Agência Bancária</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Escolha onde deseja aplicar o seu dinheiro.</p>
        </div>

        {/* Exibição do Saldo */}
        <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-6 border border-slate-100">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-emerald-500" />
            <span className="font-bold text-slate-600 text-sm uppercase tracking-wider">Seu Saldo</span>
          </div>
          <span className="font-black text-emerald-600 text-lg">
            {globalState.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        {/* Seleção do Ativo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedAsset('cofre')}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              selectedAsset === 'cofre' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-slate-100 hover:border-slate-200 text-slate-500'
            }`}
          >
            <Landmark size={24} className="mb-2" />
            <span className="font-bold text-sm">Cofrinho / CDB</span>
            <span className="text-[10px] font-bold mt-1 opacity-70 uppercase tracking-wide">Rende 0.85% a.m.</span>
          </button>
          
          <button
            onClick={() => setSelectedAsset('cdi')}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              selectedAsset === 'cdi' 
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
              : 'border-slate-100 hover:border-slate-200 text-slate-500'
            }`}
          >
            <TrendingUp size={24} className="mb-2" />
            <span className="font-bold text-sm">CDI / Tesouro Selic</span>
            <span className="text-[10px] font-bold mt-1 opacity-70 uppercase tracking-wide">Rende 1.1% a.m.</span>
          </button>
        </div>

        {/* Input de Valor */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Valor a investir
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-black text-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold mt-2 animate-in slide-in-from-top-1">{error}</p>}
        </div>

        <button 
          onClick={handleInvest}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/20"
        >
          CONFIRMAR INVESTIMENTO
        </button>

      </div>
    </div>
  );
}
