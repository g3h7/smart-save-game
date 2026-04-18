import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Plus } from 'lucide-react';

const data = [
  { name: 'Jan', receita: 1500, despesa: 1200 },
  { name: 'Fev', receita: 2300, despesa: 1900 },
  { name: 'Mar', receita: 3400, despesa: 2000 },
  { name: 'Abr', receita: 2800, despesa: 2500 },
  { name: 'Mai', receita: 3500, despesa: 2100 },
];

export default function ResumoMensal() {
  const latestData = data[data.length - 1];
  const balance = latestData.receita - latestData.despesa;

  return (
    <div className="dashboard-card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="text-primary" size={24} strokeWidth={2.5} />
        <h3 className="text-sidebar font-extrabold text-xl font-display">RESUMO MENSAL</h3>
      </div>
      
      <p className="text-gray-400 text-sm font-bold tracking-wider mb-6">HISTÓRICO MENSAL (RECEITAS vs DESPESAS)</p>

      <div className="flex-1 min-h-[300px] flex items-end justify-between relative mt-4">
        <div className="w-full h-full absolute inset-0 pb-12">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={{ stroke: '#9CA3AF' }} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => `R$ ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="receita" 
                name="Receita"
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }} 
              />
              <Line 
                type="monotone" 
                dataKey="despesa" 
                name="Despesa"
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Overlay on the right (Based on the latest month) */}
        <div className="absolute right-0 bottom-16 flex flex-col items-end pointer-events-none">
          <span className="text-primary font-black text-xl">R$ {latestData.receita}</span>
          <span className="text-danger font-black text-xl">R$ {latestData.despesa}</span>
        </div>
      </div>

      <div className="mt-8 space-y-4 z-10 relative">
        {/* Balance Bar */}
        <div className="bg-primary py-4 px-6 rounded-2xl flex justify-center shadow-md shadow-primary/20">
          <span className="text-white font-black text-lg tracking-wide">SALDO DO MÊS: +R$ {balance}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-primary hover:bg-emerald-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
            <Plus size={20} strokeWidth={3} />
            ADICIONAR RECEITA
          </button>
          
          <button className="bg-sidebar hover:bg-[#1a263d] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
            <Plus size={20} strokeWidth={3} />
            ADICIONAR DESPESA
          </button>
        </div>
      </div>
    </div>
  );
}
