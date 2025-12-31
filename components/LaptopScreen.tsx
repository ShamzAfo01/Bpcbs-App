
import React from 'react';
import { GameState } from '../types';

interface LaptopScreenProps {
  state: GameState;
}

const LaptopScreen: React.FC<LaptopScreenProps> = ({ state }) => {
  const isCharging = state === GameState.CHARGING;
  
  return (
    <div className={`relative w-48 h-32 md:w-64 md:h-44 bg-zinc-900 border-4 border-zinc-800 rounded-t-lg transition-all duration-1000 ${isCharging ? 'brightness-110 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'brightness-50'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden rounded-sm flex flex-col items-center justify-center p-2">
        {/* Mock OS UI */}
        <div className="w-full flex justify-between text-[6px] md:text-[8px] text-zinc-500 font-mono mb-2">
          <span>JuiceOS v1.0</span>
          <span>14:42</span>
        </div>

        {isCharging ? (
          <div className="flex flex-col items-center animate-pulse">
             <div className="text-green-500 text-xl md:text-2xl">⚡</div>
             <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[8px] md:text-[10px] font-bold border border-green-500/30">
               CHARGING: FAST
             </div>
             <div className="text-green-300 text-[6px] md:text-[8px] mt-1">45 min to full</div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`w-12 h-6 border-2 border-red-500/50 rounded-sm relative p-0.5 ${state === GameState.OBSERVING ? 'animate-pulse' : ''}`}>
              <div className="bg-red-600 h-full w-[8%]"></div>
              <div className="absolute -right-1.5 top-1.5 w-1 h-2 bg-red-500/50 rounded-r-sm"></div>
            </div>
            <div className="text-red-500 text-[8px] md:text-[10px] font-bold mt-2">LOW BATTERY</div>
          </div>
        )}

        <div className="mt-auto w-full flex gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500/20"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
        </div>
      </div>
      {/* Laptop Keyboard Area (Base) */}
      <div className="absolute -bottom-4 left-[-10%] w-[120%] h-4 bg-zinc-800 rounded-b-lg skew-x-[-10deg]"></div>
    </div>
  );
};

export default LaptopScreen;
