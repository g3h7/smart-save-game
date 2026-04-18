import React from 'react';
import { BookOpen, Star, CheckCircle2, Play, ClipboardList, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

const modulosData = [
  { id: 1, title: 'PRIMEIROS PASSOS', type: 'QUIZ', status: 'CONCLUÍDO', description: 'Aprenda os conceitos básicos de educação financeira', xp: 50, btn: 'JOGAR QUIZ' },
  { id: 2, title: 'AULA 1: O QUE É DINHEIRO?', type: 'VÍDEO', status: 'CONCLUÍDO', description: 'Entenda a história e o papel do dinheiro na sociedade', xp: 30, btn: 'REVER' },
  { id: 3, title: 'AULA 2: ORÇAMENTO PESSOAL', type: 'VÍDEO', status: 'CONCLUÍDO', description: 'Como organizar suas receitas e despesas mensais', xp: 30, btn: 'REVER' },
  { id: 4, title: 'QUIZ DE REVISÃO 1', type: 'QUIZ', status: 'DISPONÍVEL', description: 'Teste seus conhecimentos sobre dinheiro e orçamento', xp: 80, btn: 'JOGAR QUIZ' },
  { id: 5, title: 'AULA 3: POUPANÇA E RESERVA', type: 'VÍDEO', status: 'DISPONÍVEL', description: 'A importância de poupar e criar sua reserva de emergência', xp: 30, btn: 'COMEÇAR' },
  { id: 6, title: 'AULA 4: JUROS COMPOSTOS', type: 'VÍDEO', status: 'BLOQUEADO', description: 'O poder dos juros compostos nos seus investimentos', xp: 40, btn: 'COMEÇAR' },
  { id: 7, title: 'AULA 5: FUNDOS IMOBILIÁRIOS', type: 'VÍDEO', status: 'BLOQUEADO', description: 'Entenda como funcionam os FIIs e como investir', xp: 40, btn: 'COMEÇAR' },
  { id: 8, title: 'AULA 6: RENDA FIXA', type: 'VÍDEO', status: 'BLOQUEADO', description: 'CDB, Tesouro Direto e outros investimentos seguros', xp: 40, btn: 'COMEÇAR' },
  { id: 9, title: 'QUIZ FINAL', type: 'QUIZ', status: 'BLOQUEADO', description: 'Prove que você domina educação financeira!', xp: 150, btn: 'JOGAR QUIZ' }
];

export default function Modulos() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Topic */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="text-sidebar" size={32} strokeWidth={2.5} />
          <h2 className="text-sidebar font-black text-2xl font-display">MÓDULOS DE APRENDIZADO</h2>
        </div>
        
        <div className="bg-white rounded-full shadow-sm border-2 border-sidebar/5 px-6 py-2.5 flex items-center gap-2">
           <Star size={18} fill="#f97316" className="text-warning mb-0.5" />
           <span className="font-extrabold text-sidebar text-sm tracking-wide">3/9 completos</span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulosData.map((mod) => {
          // Determina os estilos condicionalmente com as nossas cores de marca
          const isConcluido = mod.status === 'CONCLUÍDO';
          const isDisponivel = mod.status === 'DISPONÍVEL';
          const isBloqueado = mod.status === 'BLOQUEADO';

          // Definicao do ícone circular principal
          let MainIcon = Play;
          if (isBloqueado) MainIcon = Lock;
          else if (mod.type === 'QUIZ') MainIcon = isConcluido ? CheckCircle2 : ClipboardList;
          else if (isConcluido) MainIcon = CheckCircle2; // Video concluído
          
          return (
            <div key={mod.id} className={cx(
              "dashboard-card flex flex-col justify-between h-[220px]",
              isBloqueado && "opacity-75 bg-gray-50 border-gray-200 shadow-none hover:border-gray-200"
            )}>
              {/* Card Header */}
              <div className="flex items-start gap-4">
                {/* Icon Background */}
                <div className={cx(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isConcluido && "bg-primary text-white",
                  isDisponivel && mod.type === 'QUIZ' && "bg-[#2563eb] text-white",
                  isDisponivel && mod.type === 'VÍDEO' && "bg-[#147a6b] text-white", // Variante pro play do mockup (dark green)
                  isBloqueado && "bg-gray-300 text-gray-500"
                )}>
                  <MainIcon size={24} strokeWidth={2.5} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cx(
                      "text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider",
                      isConcluido && "bg-primary text-white",
                      isDisponivel && "bg-warning text-white",
                      isBloqueado && "text-gray-400 font-bold"
                    )}>
                      {mod.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{mod.type}</span>
                  </div>
                  <h3 className={cx(
                    "font-bold text-base font-display leading-tight",
                    isBloqueado ? "text-gray-500" : "text-sidebar"
                  )}>
                    {mod.title}
                  </h3>
                </div>
              </div>

              {/* Card Description */}
              <p className="text-xs text-gray-400 font-medium leading-relaxed my-3 line-clamp-2">
                {mod.description}
              </p>

              {/* Card Footer (XP & Button) */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 opacity-80">
                  <Star size={14} className={cx("mb-0.5", isBloqueado ? "text-gray-400" : "text-warning", !isBloqueado && "fill-warning")} />
                  <span className={cx(
                    "text-xs font-black",
                    isBloqueado ? "text-gray-400" : "text-warning"
                  )}>
                    +{mod.xp} XP
                  </span>
                </div>
                
                <button className={cx(
                  "text-xs font-black px-5 py-2.5 rounded-full shadow-sm transition-all active:scale-95",
                  isBloqueado 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed active:scale-100"
                    : "bg-[#147a6b] hover:bg-[#0f6154] text-white" // Teal color from mockup
                )}>
                  {mod.btn}
                </button>
              </div>
              
            </div>
          )
        })}
      </div>
    </div>
  );
}
