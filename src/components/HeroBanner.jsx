import React, { useState, useEffect } from 'react';
import { Gamepad2, Map as MapIcon, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "BEM-VINDO, AVENTUREIRO!",
    description: "Sua jornada rumo à inteligência financeira começa aqui. Preparado para o desafio?",
    icon: Gamepad2,
    iconColor: "text-warning"
  },
  {
    id: 2,
    title: "DESBRAVE O MAPA!",
    description: "Explore nosso mundo isométrico em 32x32 pixels! Conclua minigames no cenário para juntar moedas virtuais.",
    icon: MapIcon,
    iconColor: "text-primary"
  },
  {
    id: 3,
    title: "MÓDULOS E RECOMPENSAS",
    description: "Assista pequenos vídeos na aba 'Módulos' e responda aos questionários para farmar XP e elevar seu nível no jogo.",
    icon: BookOpen,
    iconColor: "text-blue-400"
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  // Auto-play do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // Troca a cada 6 segundos
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="w-full bg-[#0a1128] rounded-[32px] p-8 md:p-10 flex items-center shadow-xl relative overflow-hidden group min-h-[220px]">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.02] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>
      
      {/* Area de slides */}
      <div className="relative w-full h-full flex items-center">
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = index === current;
          
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 w-full transition-all duration-700 ease-in-out ${
                isActive 
                  ? 'opacity-100 translate-y-0 md:translate-x-0 pointer-events-auto z-10' 
                  : 'opacity-0 translate-y-4 md:translate-y-0 md:translate-x-8 pointer-events-none z-0'
              }`}
            >
              {/* O quadrado placeholder para Pixel Art / Ícones */}
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#1a263d] rounded-2xl flex items-center justify-center border-2 border-[#273859] shadow-inner rotate-3 hover:rotate-0 transition-transform">
                <Icon size={40} className={slide.iconColor} />
              </div>
              
              <div className="flex flex-col gap-2">
                <h2 className="text-white text-2xl md:text-4xl font-black tracking-tight font-display drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-gray-400 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navegação Manual Inferior Direita */}
      <div className="absolute bottom-6 right-8 hidden md:flex items-center gap-2 z-20">
        <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all active:scale-90">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all active:scale-90">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Navegação Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              i === current ? 'w-10 bg-warning shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'w-2 bg-white/20 hover:bg-white/50'
            }`}
            aria-label={`Ir para o slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
