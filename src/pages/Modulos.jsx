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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-pixel selection:bg-[#fadb5f] selection:text-[#4a3319]">
      
      {/* Header Topic */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-4 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#734c31] border-4 border-[#4a3319] flex items-center justify-center pixel-shadow-sm">
             <BookOpen className="text-white" size={20} />
          </div>
          <h2 className="text-[#52331c] text-lg font-bold uppercase tracking-wider">DIÁRIO DE ESTUDOS</h2>
        </div>
        
        {/* Quest Tracker Display */}
        <div className="bg-[#fff4e0] border-4 border-[#734c31] text-[#52331c] px-5 py-3 flex items-center gap-3 pixel-shadow-sm select-none">
           <Star size={16} fill="#f97316" className="text-[#f97316]" />
           <span className="font-bold text-[10px] tracking-wider uppercase">MISSÕES: 3/9 COMPLETAS</span>
        </div>
      </div>

      {/* Grid of Cards styled as RPG wooden boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {modulosData.map((mod) => {
          const isConcluido = mod.status === 'CONCLUÍDO';
          const isDisponivel = mod.status === 'DISPONÍVEL';
          const isBloqueado = mod.status === 'BLOQUEADO';

          // Determina o ícone reativo da missão
          let MainIcon = Play;
          if (isBloqueado) MainIcon = Lock;
          else if (mod.type === 'QUIZ') MainIcon = isConcluido ? CheckCircle2 : ClipboardList;
          else if (isConcluido) MainIcon = CheckCircle2;

          return (
            <div 
              key={mod.id} 
              className={cx(
                "bg-[#e5c59a] border-[6px] border-[#734c31] pixel-shadow-sm p-4 flex flex-col justify-between h-[270px] relative transition-transform hover:-translate-y-1 hover:brightness-105 active:scale-[0.98] duration-150 rounded-none",
                isBloqueado && "opacity-75 bg-[#d2bfa6] border-[#8a6851] shadow-[4px_4px_0px_0px_#5c4535]"
              )}
            >
              {/* Corner Pixel Hinges */}
              <div className="absolute -top-[6px] -left-[6px] w-2 h-2 bg-[#4a3319]"></div>
              <div className="absolute -top-[6px] -right-[6px] w-2 h-2 bg-[#4a3319]"></div>
              <div className="absolute -bottom-[6px] -left-[6px] w-2 h-2 bg-[#4a3319]"></div>
              <div className="absolute -bottom-[6px] -right-[6px] w-2 h-2 bg-[#4a3319]"></div>

              <div>
                {/* Card Header Section */}
                <div className="flex items-start gap-3 border-b-2 border-[#734c31] pb-3">
                  
                  {/* Square Pixel Icon Container */}
                  <div className={cx(
                    "w-11 h-11 border-4 shrink-0 flex items-center justify-center rounded-none",
                    isConcluido && "bg-[#5cb85c] border-[#2b612b] text-white",
                    isDisponivel && mod.type === 'QUIZ' && "bg-[#2563eb] border-[#1d4ed8] text-white",
                    isDisponivel && mod.type === 'VÍDEO' && "bg-[#10b981] border-[#047857] text-white",
                    isBloqueado && "bg-[#9ca3af] border-[#4b5563] text-[#d1d5db]"
                  )}>
                    <MainIcon size={18} strokeWidth={3} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      {/* Quest Status Badge */}
                      <span className={cx(
                        "text-[7px] font-bold px-1.5 py-0.5 border uppercase rounded-none tracking-widest",
                        isConcluido && "bg-[#5cb85c] border-[#2b612b] text-white",
                        isDisponivel && "bg-[#fadb5f] border-[#baa07b] text-[#52331c]",
                        isBloqueado && "bg-[#9ca3af] border-[#4b5563] text-[#d1d5db]"
                      )}>
                        {mod.status}
                      </span>
                      <span className="text-[7px] text-[#52331c] font-black uppercase tracking-wider">
                        {mod.type}
                      </span>
                    </div>

                    <h3 className={cx(
                      "font-bold text-[10px] leading-relaxed tracking-wide uppercase break-words font-display",
                      isBloqueado ? "text-[#7a5d48]" : "text-[#52331c]"
                    )}>
                      {mod.title}
                    </h3>
                  </div>
                </div>

                {/* Quest/Card Description */}
                <p className="text-[8px] text-[#52331c]/80 font-bold leading-loose my-3 line-clamp-3 uppercase">
                  {mod.description}
                </p>
              </div>

              {/* Card Footer (XP rewards & Button Action) */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-[#baa07b]/40">
                <div className="flex items-center gap-1">
                  <Star size={11} fill={isBloqueado ? "none" : "#f97316"} className={isBloqueado ? "text-[#7a5d48]" : "text-[#f97316] fill-[#f97316]"} />
                  <span className={cx(
                    "text-[8px] font-black tracking-wider",
                    isBloqueado ? "text-[#7a5d48]" : "text-[#f97316]"
                  )}>
                    +{mod.xp} XP
                  </span>
                </div>
                
                {/* Submit Action Button */}
                {isBloqueado ? (
                  <button 
                    disabled 
                    className="text-[8px] font-bold px-3 py-2 bg-[#9ca3af] border-x-2 border-t-2 border-[#9ca3af] border-b-4 border-[#4b5563] text-[#d1d5db] cursor-not-allowed rounded-none opacity-80"
                  >
                    BLOQUEADO
                  </button>
                ) : isConcluido ? (
                  <button 
                    className="text-[8px] font-bold px-3 py-2 bg-[#fadb5f] border-x-2 border-t-2 border-[#fadb5f] border-b-4 border-[#baa07b] text-[#52331c] hover:brightness-105 active:translate-y-0.5 active:border-b-2 rounded-none transition-all cursor-pointer"
                  >
                    {mod.btn}
                  </button>
                ) : (
                  <button 
                    className="text-[8px] font-bold px-3 py-2 bg-[#5cb85c] border-x-2 border-t-2 border-[#5cb85c] border-b-4 border-[#2b612b] text-white hover:brightness-105 active:translate-y-0.5 active:border-b-2 rounded-none transition-all cursor-pointer"
                  >
                    {mod.btn}
                  </button>
                )}
              </div>
              
            </div>
          )
        })}
      </div>
    </div>
  );
}
