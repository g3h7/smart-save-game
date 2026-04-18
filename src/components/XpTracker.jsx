import React from 'react';

export default function XpTracker() {
  return (
    <div className="dashboard-card border-none shadow-md">
      <h3 className="text-sidebar font-extrabold text-xl font-display mb-6">ACOMPANHAR XP</h3>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-primary text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-sm">+15 XP</span>
        <span className="bg-primary text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-sm">+15 XP</span>
        <span className="bg-gray-200 text-gray-500 font-extrabold text-xs px-4 py-2 rounded-full">+20 XP</span>
        <span className="bg-warning text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-sm">+XP</span>
      </div>

      <div className="relative pt-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full relative w-3/4"></div>
        </div>
        
        <div className="flex justify-between w-full mt-2 text-xs font-bold text-gray-400">
          <span>R$ XP</span>
          <span className="translate-x-4">+15 XP</span>
          <span>+20 XP</span>
        </div>
      </div>
    </div>
  );
}
