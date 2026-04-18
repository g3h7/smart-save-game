import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, ArrowUpRight, TrendingDown, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

const mockInvestments = [
  { 
    id: 'selic', 
    title: 'Tesouro Selic', 
    type: 'Renda Fixa', 
    risk: 'BAIXO', 
    date: '24/05/2025', 
    rate: '0.85% a.m.', 
    value: 2063, 
    profit: 189,
    rawVal: 2063,
    color: '#10b981', // green
    history: [ 
      { name: 'Jan', val: 1874 }, { name: 'Fev', val: 1910 }, 
      { name: 'Mar', val: 1950 }, { name: 'Abr', val: 2005 }, { name: 'Mai', val: 2063 } 
    ] 
  },
  { 
    id: 'cdb', 
    title: 'CDB Banco Digital', 
    type: 'Renda Fixa', 
    risk: 'BAIXO', 
    date: '10/12/2025', 
    rate: '1.1% a.m.', 
    value: 3307, 
    profit: 137,
    rawVal: 3307,
    color: '#10b981', 
    history: [ 
      { name: 'Jan', val: 3170 }, { name: 'Fev', val: 3200 }, 
      { name: 'Mar', val: 3240 }, { name: 'Abr', val: 3270 }, { name: 'Mai', val: 3307 } 
    ] 
  },
  { 
    id: 'fii', 
    title: 'Fundo Imobiliário (FII)', 
    type: 'FII', 
    risk: 'MÉDIO', 
    date: '13/10/2025', 
    rate: '0.75% a.m.', 
    value: 3551, 
    profit: 153, 
    rawVal: 3551,
    color: '#f97316', // orange
    history: [ 
      { name: 'Jan', val: 3398 }, { name: 'Fev', val: 3450 }, 
      { name: 'Mar', val: 3420 }, { name: 'Abr', val: 3480 }, { name: 'Mai', val: 3551 } 
    ] 
  }
];

export default function Financas() {
  const [selectedId, setSelectedId] = useState(null);
  const activeInvestment = mockInvestments.find(inv => inv.id === selectedId);

  // Totals for top cards
  const totalInvested = 20593; // Fixed mockup value
  const currentValue = 23072;
  const totalProfit = 2479;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      
      {/* Header Topic */}
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-primary" size={32} strokeWidth={2.5} />
        <h2 className="text-sidebar font-black text-2xl font-display">MEUS INVESTIMENTOS</h2>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card border-none bg-gradient-to-br from-white to-gray-50 flex flex-col justify-center">
          <span className="text-gray-400 font-extrabold text-xs tracking-wider uppercase mb-2">Total Investido</span>
          <span className="text-sidebar font-black text-3xl font-display leading-none">R$ {totalInvested.toLocaleString()}</span>
        </div>
        
        <div className="dashboard-card border-none bg-gradient-to-br from-white to-gray-50 flex flex-col justify-center border-l-4 border-l-sidebar/20">
          <span className="text-gray-400 font-extrabold text-xs tracking-wider uppercase mb-2">Valor Atual</span>
          <span className="text-primary font-black text-3xl font-display leading-none">R$ {currentValue.toLocaleString()}</span>
        </div>

        <div className="dashboard-card border-none bg-[#147a6b]/5 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-[#147a6b] translate-x-4 -translate-y-4">
            <TrendingUp size={100} />
          </div>
          <span className="text-gray-500 font-extrabold text-xs tracking-wider uppercase mb-2">Lucro Total</span>
          <div className="flex items-center gap-2">
            <TrendingUp size={24} strokeWidth={3} className="text-primary" />
            <span className="text-primary font-black text-3xl font-display leading-none">+R$ {totalProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        
        {/* Left Wallet List */}
        <div className="col-span-1 border-r-0 xl:col-span-5 h-[600px] flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-2">
            <BarChart3 className="text-sidebar" size={20} />
            <h3 className="text-sidebar font-black text-sm tracking-wider uppercase">Carteira</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-8">
            {mockInvestments.map(inv => {
              const isActive = selectedId === inv.id;
              const isGain = inv.profit > 0;
              return (
                <button 
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  className={cx(
                    "w-full text-left bg-white rounded-2xl p-5 border-2 transition-all duration-300 relative overflow-hidden flex flex-col shadow-sm outline-none",
                    isActive 
                      ? "border-primary ring-4 ring-primary/10 -translate-y-1 shadow-[0_8px_30px_rgba(16,185,129,0.15)]" 
                      : "border-gray-100 hover:border-sidebar/20 hover:shadow-md active:scale-95"
                  )}
                >
                  {/* Decorative Active Marker */}
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-sidebar text-base leading-tight font-display">{inv.title}</h4>
                      <span className="text-xs text-gray-400 font-medium">{inv.type}</span>
                    </div>
                    {/* Risk Tag */}
                    <span className={cx(
                      "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm",
                      inv.risk === 'BAIXO' ? "bg-primary" : inv.risk === 'MÉDIO' ? "bg-warning" : "bg-danger"
                    )}>
                      {inv.risk}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-auto pt-2 border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock size={12} />
                        <span className="text-[11px] font-bold">{inv.date}</span>
                      </div>
                      <span className="font-black text-sidebar text-lg">R$ {inv.rawVal.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] font-bold text-gray-400">{inv.rate}</span>
                      <span className={cx(
                        "font-black text-sm flex items-center gap-1",
                        isGain ? "text-primary" : "text-danger"
                      )}>
                        {isGain ? "+" : "-"}R$ {Math.abs(inv.profit)}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Dashboard Area */}
        <div className="xl:col-span-7 h-full min-h-[500px]">
          {!activeInvestment ? (
            <div className="dashboard-card h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-sidebar/10 shadow-none bg-white/50">
              <div className="w-24 h-24 bg-sidebar/5 rounded-full flex items-center justify-center mb-6">
                 <BarChart3 size={48} className="text-gray-300" />
              </div>
              <h3 className="text-sidebar font-black text-xl font-display mb-2">SELECIONE UM INVESTIMENTO</h3>
              <p className="text-gray-400 max-w-sm">Clique em um ativo da sua carteira para abrir o terminal de avaliação histórica de rendimento contínuo.</p>
            </div>
          ) : (
            <div className="dashboard-card h-full flex flex-col animate-in slide-in-from-right-8 duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border-sidebar/10 relative overflow-hidden ring-1 ring-black/5">
              
              {/* Colored Glow Behind Dashboard based on risk type */}
              <div 
                className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
                style={{ backgroundColor: activeInvestment.color }}
              ></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-sidebar font-black text-2xl font-display mb-1">{activeInvestment.title}</h3>
                  <div className="flex gap-4 text-sm font-bold text-gray-400">
                    <span className="uppercase tracking-wide">{activeInvestment.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> Venc: {activeInvestment.date}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-wider block mb-1">Rendimento Simulado</span>
                  <div className="flex items-center gap-2 justify-end">
                    {activeInvestment.profit > 0 ? (
                      <ArrowUpRight size={24} strokeWidth={3} className="text-primary" />
                    ) : (
                      <TrendingDown size={24} strokeWidth={3} className="text-danger" />
                    )}
                    <span className={cx(
                      "font-black text-2xl", 
                      activeInvestment.profit > 0 ? "text-primary" : "text-danger"
                    )}>
                      {activeInvestment.profit > 0 ? "+" : ""}R$ {activeInvestment.profit}
                    </span>
                  </div>
                </div>
              </div>

              {/* The Dynamic Recharts Simulation */}
              <div className="flex-1 w-full min-h-[300px] relative mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeInvestment.history} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`colorVal-${activeInvestment.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeInvestment.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={activeInvestment.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }} 
                      tickFormatter={(value) => `R$ ${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontWeight: 'bold', color: '#111827' }}
                      formatter={(value) => [`R$ ${value}`, 'Valor Acumulado']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke={activeInvestment.color} 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill={`url(#colorVal-${activeInvestment.id})`} 
                      activeDot={{ r: 8, strokeWidth: 0, fill: activeInvestment.color }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Footer action */}
              <div className="mt-8 flex justify-end items-center border-t border-gray-100 pt-6 z-10 relative">
                 <button className="bg-sidebar hover:bg-black text-white font-black py-4 px-8 rounded-2xl transition-all active:scale-[0.98] shadow-lg flex items-center gap-3">
                   VENDER POSIÇÃO
                   <ArrowUpRight size={18} strokeWidth={3} />
                 </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
