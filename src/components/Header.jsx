import React from 'react';
import { Trophy, Plus, UserCircle2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 bg-background flex items-center justify-between px-8 z-10 sticky top-0 relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-sidebar/10 before:to-transparent">
      
      {/* Brand logo Area */}
      <div className="flex items-center gap-2">
        <span className="text-warning text-3xl font-black heading tracking-tighter drop-shadow-md">
          $
        </span>
        <h1 className="text-2xl font-black text-sidebar tracking-tight font-display">
          Educa<span className="text-primary">$</span>h
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Trophies */}
        <button className="text-warning hover:scale-110 transition-transform">
          <Trophy size={28} strokeWidth={2.5} fill="#f97316" />
        </button>

        {/* Level / XP Progress */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-sidebar text-base">NÍVEL 12</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">XP 1450/2000</span>
            </div>
          </div>
          
          <div className="w-48 h-3 bg-gray-200 rounded-full mt-1.5 overflow-hidden ring-1 ring-inset ring-gray-300">
            <div className="h-full bg-primary rounded-full relative" style={{ width: '72.5%' }}>
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Add XP Button */}
        <button className="btn-xp flex items-center gap-2">
          <Plus size={16} strokeWidth={3} />
          <span>XP</span>
        </button>

        {/* Profile Avatar */}
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(17,24,39,0.06)] border-2 border-sidebar/10 hover:border-primary/50 transition-colors overflow-hidden">
           <UserCircle2 size={32} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
