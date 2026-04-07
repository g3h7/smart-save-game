import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface Investment {
  id: number;
  name: string;
  type: string;
  investedAt: Date;
  amount: number;
  rate: number;
  risk: "baixo" | "médio" | "alto";
}

const generateInvestments = (): Investment[] => {
  const types = [
    { name: "Tesouro Selic", type: "Renda Fixa", rate: 0.85, risk: "baixo" as const },
    { name: "CDB Banco Digital", type: "Renda Fixa", rate: 1.1, risk: "baixo" as const },
    { name: "Fundo Imobiliário (FII)", type: "FII", rate: 0.75, risk: "médio" as const },
    { name: "Ações - Tech Corp", type: "Ações", rate: 2.5, risk: "alto" as const },
    { name: "LCI Habitacional", type: "Renda Fixa", rate: 0.95, risk: "baixo" as const },
    { name: "ETF S&P 500", type: "ETF", rate: 1.8, risk: "médio" as const },
    { name: "Crypto - Bitcoin", type: "Crypto", rate: 4.0, risk: "alto" as const },
  ];

  return types.map((t, i) => {
    const daysAgo = Math.floor(Math.random() * 300) + 30;
    return {
      id: i + 1,
      ...t,
      investedAt: new Date(Date.now() - daysAgo * 86400000),
      amount: Math.floor(Math.random() * 4000 + 500),
    };
  });
};

const calcReturn = (inv: Investment) => {
  const months = (Date.now() - inv.investedAt.getTime()) / (30 * 86400000);
  const total = inv.amount * Math.pow(1 + inv.rate / 100, months);
  return { current: total, profit: total - inv.amount, months };
};

const generateChartData = (inv: Investment) => {
  const months = Math.ceil((Date.now() - inv.investedAt.getTime()) / (30 * 86400000));
  const future = 6;
  const data = [];
  for (let m = 0; m <= months + future; m++) {
    const val = inv.amount * Math.pow(1 + inv.rate / 100, m);
    const d = new Date(inv.investedAt.getTime() + m * 30 * 86400000);
    data.push({
      month: d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      valor: Math.round(val),
      isFuture: m > months,
    });
  }
  return data;
};

const riskColors: Record<string, string> = {
  baixo: "bg-game-green text-primary-foreground",
  médio: "bg-accent text-accent-foreground",
  alto: "bg-destructive text-destructive-foreground",
};

const Financas = () => {
  const navigate = useNavigate();
  const investments = useMemo(generateInvestments, []);
  const [selected, setSelected] = useState<Investment | null>(null);

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalCurrent = investments.reduce((s, i) => s + calcReturn(i).current, 0);
  const totalProfit = totalCurrent - totalInvested;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary border-b border-sidebar-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          <ArrowLeft size={24} />
        </button>
        <DollarSign className="text-game-green" size={24} />
        <h1 className="font-display text-xl font-bold text-primary-foreground">MEUS INVESTIMENTOS</h1>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground font-display text-xs font-semibold">TOTAL INVESTIDO</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">R$ {totalInvested.toLocaleString("pt-BR")}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground font-display text-xs font-semibold">VALOR ATUAL</p>
            <p className="font-display text-2xl font-bold text-primary mt-1">R$ {Math.round(totalCurrent).toLocaleString("pt-BR")}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground font-display text-xs font-semibold">LUCRO TOTAL</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="text-game-green" size={20} />
              <p className="font-display text-2xl font-bold text-game-green">+R$ {Math.round(totalProfit).toLocaleString("pt-BR")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Investment list */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" /> CARTEIRA
            </h2>
            {investments.map((inv) => {
              const { current, profit } = calcReturn(inv);
              const isSelected = selected?.id === inv.id;
              return (
                <button
                  key={inv.id}
                  onClick={() => setSelected(inv)}
                  className={`w-full text-left bg-card rounded-xl p-4 shadow-card game-card-hover border-2 transition-all ${
                    isSelected ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">{inv.name}</p>
                      <p className="text-xs text-muted-foreground font-body">{inv.type}</p>
                    </div>
                    <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${riskColors[inv.risk]}`}>
                      {inv.risk.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        <Clock size={10} /> {inv.investedAt.toLocaleDateString("pt-BR")}
                      </p>
                      <p className="font-display text-sm font-bold text-foreground mt-0.5">R$ {inv.amount.toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-body">{inv.rate}% a.m.</p>
                      <p className="font-display text-sm font-bold text-game-green">
                        +R$ {Math.round(profit).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 bg-card rounded-2xl p-5 shadow-card">
            {selected ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Projeção de rendimento ({selected.rate}% a.m.)
                    </p>
                  </div>
                  <span className={`text-xs font-display font-bold px-3 py-1 rounded-full ${riskColors[selected.risk]}`}>
                    RISCO {selected.risk.toUpperCase()}
                  </span>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateChartData(selected)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                        contentStyle={{ borderRadius: 12, fontFamily: "Nunito", fontSize: 12 }}
                      />
                      <Line type="monotone" dataKey="valor" stroke="hsl(222, 75%, 18%)" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 bg-muted rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground font-display">INVESTIDO</p>
                    <p className="font-display font-bold text-foreground">R$ {selected.amount.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-display">ATUAL</p>
                    <p className="font-display font-bold text-primary">R$ {Math.round(calcReturn(selected).current).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-display">LUCRO</p>
                    <p className="font-display font-bold text-game-green">+R$ {Math.round(calcReturn(selected).profit).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-72 text-muted-foreground">
                <BarChart3 size={48} className="mb-3 opacity-40" />
                <p className="font-display font-bold text-sm">SELECIONE UM INVESTIMENTO</p>
                <p className="font-body text-xs mt-1">Clique em um item da carteira para ver detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financas;
