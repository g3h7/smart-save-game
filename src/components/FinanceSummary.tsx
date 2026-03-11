import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Plus } from "lucide-react";

const data = [
  { name: "RECEITA", value: 3500, color: "hsl(187, 70%, 42%)" },
  { name: "DESPESA", value: 2100, color: "hsl(0, 65%, 55%)" },
];

const FinanceSummary = () => {
  const saldo = data[0].value - data[1].value;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card game-card-hover">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-primary" size={20} />
        <h3 className="font-display text-lg font-bold text-foreground">RESUMO MENSAL</h3>
      </div>

      <p className="text-sm text-muted-foreground font-semibold mb-2">RECEITA vs DESPESA</p>

      <div className="flex items-end gap-6">
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(210, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-end gap-1 min-w-fit">
          <span className="text-primary font-bold text-lg font-display">R$ 3.500</span>
          <span className="text-game-red font-bold text-lg font-display">R$ 2.100</span>
        </div>
      </div>

      <div className="mt-3 bg-game-green text-primary-foreground rounded-xl px-4 py-2 text-center font-display font-bold text-sm">
        SALDO: +R$ {saldo.toLocaleString("pt-BR")}
      </div>

      <div className="flex gap-3 mt-3">
        <button className="flex-1 bg-primary text-primary-foreground font-display font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-button hover:brightness-110 transition-all">
          <Plus size={14} /> ADICIONAR RECEITA
        </button>
        <button className="flex-1 bg-game-teal-dark text-primary-foreground font-display font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-button hover:brightness-110 transition-all">
          <Plus size={14} /> ADICIONAR DESPESA
        </button>
      </div>
    </div>
  );
};

export default FinanceSummary;
