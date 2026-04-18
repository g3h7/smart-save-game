import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ResumoMensal from '../components/ResumoMensal';
import AvatarProgress from '../components/AvatarProgress';
import XpTracker from '../components/XpTracker';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top row: Welcome Banner */}
      <HeroBanner />
      
      {/* Middle row: Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Wider): Financial Summary */}
        <div className="xl:col-span-2">
          <ResumoMensal />
        </div>
        
        {/* Right Column: Avatar/XP Progress */}
        <div className="space-y-6">
          <AvatarProgress />
          <XpTracker />
        </div>
      </div>
    </div>
  );
}
