import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AvatarProgress() {
  return (
    <div className="dashboard-card border-none shadow-md">
      <h3 className="text-sidebar font-extrabold text-xl font-display mb-6">MEU AVATAR & PROGRESSO</h3>
      
      <div className="bg-sidebar rounded-3xl p-6 relative overflow-hidden flex items-center gap-6">
        {/* Mock Graphic Container */}
        <div className="w-24 h-32 bg-[#1a263d] rounded-xl flex items-end justify-center pb-4 shrink-0 shadow-inner border border-white/5 mx-auto">
           <ShieldAlert size={64} className="text-gray-400" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-warning w-max px-4 py-1 rounded-full text-white font-black text-xs mb-2">
            NÍVEL 12
          </div>
          
          <div className="mb-2">
            <span className="text-white font-bold text-sm">XP 1450/2000</span>
            <div className="w-full h-3 bg-xpBarEmpty rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-xpBarFill rounded-full" style={{ width: '72.5%' }}></div>
            </div>
          </div>
          
          <div className="text-gray-400 text-xs mt-2 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-warning before:rounded-full pl-4 font-medium">
            Nível up: <span className="text-warning font-bold">15 15</span> <br/>
            <span className="text-white">+XP por aprendizado</span>
          </div>
          
          <button className="bg-warning hover:bg-orange-400 text-white font-black py-3 rounded-2xl w-32 mt-4 shadow-lg shadow-warning/30 transition-transform active:scale-95">
            EVOLUIR
          </button>
        </div>
      </div>
    </div>
  );
}
