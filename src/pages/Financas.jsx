import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, ArrowUpRight, TrendingDown, Clock, Wallet, PiggyBank, Building2, Coins } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEconomy } from '../contexts/EconomyContext';

function cx(...args) {
  return twMerge(clsx(args));
}

// Metadados fixos de cada ativo (informações descritivas do produto)
const ATIVOS_META = [
  {
    id: 'selic',
    title: 'Tesouro Selic / CDI',
    type: 'Renda Fixa',
    risk: 'BAIXO',
    rate: '1.1% a cada 5min',
    color: '#10b981',
    icon: TrendingUp,
    desc: 'Aplicação de renda fixa atrelada ao CDI. Rendimento automático a cada 5 minutos.'
  },
  {
    id: 'cdb',
    title: 'CDB / Cofrinho',
    type: 'Renda Fixa',
    risk: 'BAIXO',
    rate: '0.85% a cada 5min',
    color: '#3b82f6',
    icon: PiggyBank,
    desc: 'Certificado de depósito bancário. Segurança máxima com rendimento progressivo.'
  },
  {
    id: 'fii',
    title: 'Fundo Imobiliário (FII)',
    type: 'FII',
    risk: 'MÉDIO',
    rate: 'Cotas adquiridas',
    color: '#f97316',
    icon: Building2,
    desc: 'Cotas de fundos imobiliários adquiridas no jogo. Diversificação do portfólio.'
  },
];

// Formata número como moeda BRL
function formatBRL(val) {
  if (val === undefined || val === null || isNaN(val)) return 'R$ 0,00';
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata só o número (sem símbolo)
function formatNum(val) {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Tooltip customizado para o gráfico de área
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-100">
        <p className="font-black text-sidebar text-sm">{formatBRL(payload[0].value)}</p>
        <p className="text-xs text-gray-400 font-bold mt-0.5">{payload[0].payload.name}</p>
      </div>
    );
  }
  return null;
}

export default function Financas() {
  const { globalState } = useEconomy();
  const [selectedId, setSelectedId] = useState(null);

  // Valores atuais (incluem rendimentos acumulados)
  const saldo         = globalState?.saldo           ?? 0;
  const cdi           = globalState?.cdi             ?? 0;
  const cofre         = globalState?.cofre           ?? 0;
  const fii           = globalState?.fii             ?? 0;
  const lucroTotal    = globalState?.lucro           ?? 0;

  // Capital original aplicado (sem rendimentos)
  // Migração retroativa: se o jogador já tinha investimentos antes desta feature,
  // usamos o valor atual como estimativa do principal (lucro começa do próximo ciclo)
  const cdiPrincipalRaw   = globalState?.cdiPrincipal  ?? 0;
  const cofrePrincipalRaw = globalState?.cofrePrincipal ?? 0;
  const cdiPrincipal   = cdiPrincipalRaw   > 0 ? cdiPrincipalRaw   : cdi;   // fallback: valor atual
  const cofrePrincipal = cofrePrincipalRaw > 0 ? cofrePrincipalRaw : cofre; // fallback: valor atual

  // ── Cálculos de lucro por ativo ─────────────────────────────────────────────
  const lucroCDI   = Math.max(0, cdi   - cdiPrincipal);
  const lucroCofre = Math.max(0, cofre - cofrePrincipal);

  // ── Totais do portfólio ──────────────────────────────────────────────────────
  const totalPrincipal = cdiPrincipal + cofrePrincipal + fii;
  const totalAtual     = cdi + cofre + fii;
  // Usa o lucroTotal do contexto como fonte principal (mais preciso — registra cada ciclo)
  const totalLucro     = lucroTotal > 0 ? lucroTotal : (lucroCDI + lucroCofre);

  // % de rentabilidade geral
  const rentabilidadePercent = totalPrincipal > 0
    ? (totalLucro / totalPrincipal * 100)
    : 0;

  // ── Dados para o gráfico de distribuição (Pie) ──────────────────────────────
  const pieData = [
    { name: 'CDI/Selic',  value: cdi,   color: '#10b981' },
    { name: 'Cofrinho',   value: cofre,  color: '#3b82f6' },
    { name: 'FII',        value: fii,   color: '#f97316' },
  ].filter(d => d.value > 0);

  // ── Mapear ativos com dados reais ────────────────────────────────────────────
  const ativos = ATIVOS_META.map(meta => {
    let valorAtual  = 0;
    let principal   = 0;
    let lucro       = 0;

    if (meta.id === 'selic') {
      valorAtual = cdi;
      principal  = cdiPrincipal;
      lucro      = lucroCDI;
    } else if (meta.id === 'cdb') {
      valorAtual = cofre;
      principal  = cofrePrincipal;
      lucro      = lucroCofre;
    } else if (meta.id === 'fii') {
      valorAtual = fii;
      principal  = fii; // FII: cotas adquiridas, sem rendimento automático
      lucro      = 0;
    }

    const rentabilidade = principal > 0 ? (lucro / principal * 100) : 0;
    const temSaldo      = valorAtual > 0;

    // Dados para o mini gráfico de área — simula curva de crescimento
    const history = principal > 0 ? [
      { name: 'Início',   val: 0 },
      { name: '25%',      val: principal * 0.25 },
      { name: '50%',      val: principal * 0.5 },
      { name: '75%',      val: principal + lucro * 0.5 },
      { name: 'Atual',    val: valorAtual },
    ] : [
      { name: 'Sem dados', val: 0 },
      { name: 'Atual',     val: 0 },
    ];

    return { ...meta, valorAtual, principal, lucro, rentabilidade, temSaldo, history };
  });

  const ativoSelecionado = ativos.find(a => a.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-8">

      {/* ── Cabeçalho ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-2">
        <DollarSign className="text-primary" size={32} strokeWidth={2.5} />
        <h2 className="text-sidebar font-black text-2xl font-display">MEUS INVESTIMENTOS</h2>
      </div>

      {/* ── Cards de resumo (4 métricas) ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Saldo em Conta */}
        <div className="dashboard-card border-none flex flex-col justify-between gap-3 bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-emerald-400/30">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold text-[11px] tracking-wider uppercase">Saldo em Conta</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Wallet size={14} className="text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-emerald-500 font-black text-2xl font-display leading-none">{formatBRL(saldo)}</p>
            <p className="text-gray-400 text-xs font-bold mt-1">disponível para investir</p>
          </div>
        </div>

        {/* Capital Aplicado (Principal) */}
        <div className="dashboard-card border-none flex flex-col justify-between gap-3 bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-blue-400/30">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold text-[11px] tracking-wider uppercase">Capital Aplicado</span>
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Coins size={14} className="text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sidebar font-black text-2xl font-display leading-none">{formatBRL(totalPrincipal)}</p>
            <p className="text-gray-400 text-xs font-bold mt-1">investido pelo jogador</p>
          </div>
        </div>

        {/* Valor Atual (Principal + Rendimentos) */}
        <div className="dashboard-card border-none flex flex-col justify-between gap-3 bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold text-[11px] tracking-wider uppercase">Valor Atual</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={14} className="text-primary" />
            </div>
          </div>
          <div>
            <p className="text-primary font-black text-2xl font-display leading-none">{formatBRL(totalAtual)}</p>
            <p className="text-gray-400 text-xs font-bold mt-1 flex items-center gap-1">
              {totalPrincipal > 0 ? (
                <span className={rentabilidadePercent >= 0 ? 'text-primary' : 'text-danger'}>
                  {rentabilidadePercent >= 0 ? '+' : ''}{rentabilidadePercent.toFixed(2)}% de retorno
                </span>
              ) : 'sem posições abertas'}
            </p>
          </div>
        </div>

        {/* Lucro Total */}
        <div className={cx(
          "dashboard-card border-none flex flex-col justify-between gap-3 relative overflow-hidden",
          totalLucro > 0 ? "bg-gradient-to-br from-emerald-50 to-white" : "bg-gradient-to-br from-white to-gray-50"
        )}>
          <div className="absolute -right-4 -top-4 opacity-[0.07]">
            <TrendingUp size={80} className="text-primary" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-gray-400 font-bold text-[11px] tracking-wider uppercase">Lucro Acumulado</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight size={14} className="text-primary" />
            </div>
          </div>
          <div className="relative z-10">
            <p className={cx(
              "font-black text-2xl font-display leading-none",
              totalLucro > 0 ? "text-primary" : "text-gray-400"
            )}>
              {totalLucro > 0 ? '+' : ''}{formatBRL(totalLucro)}
            </p>
            <p className="text-gray-400 text-xs font-bold mt-1">
              {totalLucro > 0 ? 'rendimentos gerados' : 'invista para gerar lucro'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Layout principal: lista + detalhe ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Coluna Esquerda: Lista de ativos */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <BarChart3 className="text-sidebar" size={18} />
            <h3 className="text-sidebar font-black text-sm tracking-wider uppercase">Carteira de Ativos</h3>
          </div>

          {ativos.map(ativo => {
            const isSelected = selectedId === ativo.id;
            const Icon = ativo.icon;
            const temLucro = ativo.lucro > 0;

            return (
              <button
                key={ativo.id}
                onClick={() => setSelectedId(ativo.id)}
                className={cx(
                  "w-full text-left rounded-2xl p-5 border-2 transition-all duration-300 relative overflow-hidden shadow-sm outline-none",
                  isSelected
                    ? "border-primary ring-4 ring-primary/10 -translate-y-0.5 shadow-[0_8px_30px_rgba(16,185,129,0.15)]"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-[0.99]"
                )}
              >
                {/* Barra lateral colorida quando selecionado */}
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ backgroundColor: ativo.color }} />}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ativo.color}18` }}>
                      <Icon size={18} style={{ color: ativo.color }} />
                    </div>
                    <div>
                      <h4 className="font-black text-sidebar text-sm leading-tight font-display">{ativo.title}</h4>
                      <span className="text-[11px] text-gray-400 font-bold">{ativo.type} · {ativo.rate}</span>
                    </div>
                  </div>
                  <span className={cx(
                    "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white",
                    ativo.risk === 'BAIXO' ? 'bg-primary' : ativo.risk === 'MÉDIO' ? 'bg-warning' : 'bg-danger'
                  )}>
                    {ativo.risk}
                  </span>
                </div>

                {/* Linha de valores: Principal → Atual → Lucro */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Aplicado</span>
                    <span className="font-black text-sidebar text-sm">{formatBRL(ativo.principal)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Atual</span>
                    <span className="font-black text-primary text-sm">{formatBRL(ativo.valorAtual)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Lucro</span>
                    <span className={cx("font-black text-sm", temLucro ? "text-primary" : "text-gray-400")}>
                      {temLucro ? `+${formatBRL(ativo.lucro)}` : formatBRL(0)}
                    </span>
                  </div>
                </div>

                {/* Mini barra de rentabilidade */}
                {ativo.principal > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                      <span>Rentabilidade</span>
                      <span className={temLucro ? 'text-primary' : 'text-gray-400'}>
                        {ativo.rentabilidade >= 0 ? '+' : ''}{ativo.rentabilidade.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(ativo.rentabilidade * 10, 100)}%`, backgroundColor: ativo.color }}
                      />
                    </div>
                  </div>
                )}

                {/* Estado vazio */}
                {!ativo.temSaldo && (
                  <p className="text-[10px] text-gray-400 font-bold mt-2 text-center">
                    Nenhum capital alocado neste ativo
                  </p>
                )}
              </button>
            );
          })}

          {/* Gráfico pizza — distribuição do portfólio */}
          {pieData.length > 0 && (
            <div className="dashboard-card border-none bg-white mt-2">
              <h4 className="text-sidebar font-black text-sm mb-4 font-display">DISTRIBUIÇÃO DO PORTFÓLIO</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatBRL(v)} />
                  <Legend
                    formatter={(value) => <span className="text-xs font-bold text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Coluna Direita: Detalhe do ativo selecionado */}
        <div className="xl:col-span-7">
          {!ativoSelecionado ? (
            <div className="dashboard-card h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-sidebar/10 shadow-none bg-white/50 min-h-[500px]">
              <div className="w-24 h-24 bg-sidebar/5 rounded-full flex items-center justify-center mb-6">
                <BarChart3 size={48} className="text-gray-300" />
              </div>
              <h3 className="text-sidebar font-black text-xl font-display mb-2">SELECIONE UM ATIVO</h3>
              <p className="text-gray-400 max-w-sm text-sm">
                Clique em um ativo da sua carteira para visualizar o gráfico de evolução, lucro real e rentabilidade acumulada.
              </p>
            </div>
          ) : (
            <div className="dashboard-card flex flex-col animate-in slide-in-from-right-8 duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border-sidebar/10 relative overflow-hidden ring-1 ring-black/5 h-full">

              {/* Glow de fundo */}
              <div
                className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
                style={{ backgroundColor: ativoSelecionado.color }}
              />

              {/* Header do ativo */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${ativoSelecionado.color}20` }}>
                    <ativoSelecionado.icon size={26} style={{ color: ativoSelecionado.color }} />
                  </div>
                  <div>
                    <h3 className="text-sidebar font-black text-xl font-display leading-none">{ativoSelecionado.title}</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 max-w-xs">{ativoSelecionado.desc}</p>
                  </div>
                </div>
                <span className={cx(
                  "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full text-white shadow-sm",
                  ativoSelecionado.risk === 'BAIXO' ? 'bg-primary' : ativoSelecionado.risk === 'MÉDIO' ? 'bg-warning' : 'bg-danger'
                )}>
                  Risco {ativoSelecionado.risk}
                </span>
              </div>

              {/* Métricas detalhadas do ativo */}
              <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                {/* Capital Aplicado */}
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capital Aplicado</span>
                  <span className="text-sidebar font-black text-lg font-display leading-none">
                    {formatBRL(ativoSelecionado.principal)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">valor investido</span>
                </div>

                {/* Valor Atual */}
                <div className="rounded-2xl p-4 flex flex-col gap-1" style={{ backgroundColor: `${ativoSelecionado.color}12` }}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor Atual</span>
                  <span className="font-black text-lg font-display leading-none" style={{ color: ativoSelecionado.color }}>
                    {formatBRL(ativoSelecionado.valorAtual)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">com rendimentos</span>
                </div>

                {/* Lucro */}
                <div className={cx(
                  "rounded-2xl p-4 flex flex-col gap-1",
                  ativoSelecionado.lucro > 0 ? "bg-emerald-50" : "bg-gray-50"
                )}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lucro Real</span>
                  <div className="flex items-center gap-1">
                    {ativoSelecionado.lucro > 0
                      ? <ArrowUpRight size={14} className="text-primary" />
                      : <TrendingDown size={14} className="text-gray-400" />
                    }
                    <span className={cx(
                      "font-black text-lg font-display leading-none",
                      ativoSelecionado.lucro > 0 ? "text-primary" : "text-gray-400"
                    )}>
                      {ativoSelecionado.lucro > 0 ? '+' : ''}{formatBRL(ativoSelecionado.lucro)}
                    </span>
                  </div>
                  <span className={cx(
                    "text-[10px] font-bold",
                    ativoSelecionado.lucro > 0 ? "text-primary" : "text-gray-400"
                  )}>
                    {ativoSelecionado.rentabilidade > 0
                      ? `+${ativoSelecionado.rentabilidade.toFixed(2)}% de retorno`
                      : 'aguardando rendimento'}
                  </span>
                </div>
              </div>

              {/* Gráfico de evolução */}
              <div className="flex-1 w-full min-h-[220px] relative z-10">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Evolução do Valor</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ativoSelecionado.history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${ativoSelecionado.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={ativoSelecionado.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={ativoSelecionado.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                      tickFormatter={(v) => `R$${v > 999 ? `${(v/1000).toFixed(1)}k` : formatNum(v)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={ativoSelecionado.color}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={`url(#grad-${ativoSelecionado.id})`}
                      activeDot={{ r: 7, strokeWidth: 0, fill: ativoSelecionado.color }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Rodapé */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center z-10 relative">
                <div className="text-xs font-bold text-gray-400">
                  Taxa: <span className="text-sidebar">{ativoSelecionado.rate}</span>
                </div>
                <button className="bg-sidebar hover:bg-black text-white font-black py-3 px-6 rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-2 text-sm">
                  VENDER POSIÇÃO
                  <ArrowUpRight size={16} strokeWidth={3} />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
