
import React from 'react';
import { GameState } from '../types';

interface DashboardProps {
  onStartQuest: (questId: number) => void;
  questStates: { solved: boolean }[];
}

const LogoSVG = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.478174" y="0.47793" width="18.8062" height="16.2562" fill="#0038DF" />
    <rect x="0.478174" y="0.47793" width="18.8062" height="16.2562" stroke="black" stroke-width="0.95625" />
    <path d="M0.956299 16.2563V8.48196H5.19189L8.21732 3.50635L11.8478 13.4576L14.8732 8.79293H18.8063V16.2563H0.956299Z" fill="white" />
    <path d="M9.88135 8.60635L7.96885 3.50635L4.78135 8.60635H1.59385" stroke="black" stroke-width="1.275" stroke-linecap="square" />
    <path d="M9.88135 8.60605L11.7938 13.7061L14.9813 8.60605H18.1688" stroke="black" stroke-width="1.275" stroke-linecap="square" />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ onStartQuest, questStates }) => {
  return (

    <div className="relative w-full h-full bg-[#e0e5ec] overflow-y-auto pb-24 px-4 pt-4">
      {/* Header & Title - Hidden/Embedded in QuestsView shell or simplified here */}
      {/* We rely on QuestsView for the main header, but if we keep it generic: */}
      <div className="mb-6">
        <h2 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Current Operations</h2>
        <h1 className="text-slate-700 font-black text-3xl tracking-tight">Active Scenarios</h1>
      </div>

      {/* Quest Feed (Vertical List) */}
      <div className="flex flex-col gap-6">
        {/* Tile 1: Juice Box */}
        {/* Tile 1: Juice Box */}
        <div
          onClick={() => onStartQuest(0)}
          className={`relative w-full h-64 rounded-3xl p-6 cursor-pointer transition-all active:scale-95 overflow-hidden shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] border-2 border-transparent group ${questStates[0].solved ? 'bg-blue-50' : 'bg-[#e0e5ec]'}`}
        >
          {/* Playlet: Subtle tech pulse */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 bg-blue-400 animate-pulse"></div>
          </div>

          {questStates[0].solved ? (
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-[10px] font-black text-[#0038DF] uppercase tracking-tighter">Juice Box Solved</div>
              <div className="mt-2 text-[8px] text-stone-500 font-mono">Status: Charging</div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2 transition-transform duration-700 group-hover:scale-110">☕</div>
              <div className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Cafe Chronicles</div>
              <div className="mt-2 text-[8px] text-stone-400">Preview: Power Management</div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
          </div>
        </div>

        {/* Tile 2: The Thirsty Monstera */}
        <div
          onClick={() => onStartQuest(1)}
          className={`relative w-full h-64 rounded-3xl p-6 cursor-pointer transition-all active:scale-95 overflow-hidden shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] border-2 border-transparent group ${questStates[1].solved ? 'bg-green-50' : 'bg-[#e0e5ec]'}`}
        >
          {/* Playlet Background Animation for Tile 2 */}
          {!questStates[1].solved && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {/* Simulating a plant swaying or rising */}
              <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[80%] bg-green-900 rounded-t-full animate-pulse blur-xl"></div>
              <div className="absolute top-[30%] left-[30%] text-[80px] animate-bounce duration-[3000ms] opacity-50">🍂</div>
            </div>
          )}

          {questStates[1].solved ? (
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2">🌿</div>
              <div className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Monstera Saved</div>
              <div className="mt-2 text-[8px] text-stone-500 font-mono">Status: Thriving</div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2 transition-transform duration-1000 group-hover:rotate-12">🍂</div>
              <div className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">The Thirsty Monstera</div>
              <div className="mt-2 text-[8px] text-stone-400">Preview: Biological Asset Recovery</div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
          </div>
        </div>

        {/* Tile 3: The Retro Revival */}
        <div
          onClick={() => onStartQuest(2)}
          className={`relative w-full h-64 rounded-3xl p-6 cursor-pointer transition-all active:scale-95 overflow-hidden shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] border-2 border-transparent group ${questStates[2]?.solved ? 'bg-gray-200' : 'bg-[#1a1a1a]'}`}
        >
          {/* Playlet: Retro Pong */}
          {!questStates[2]?.solved && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#2A321B]/80 flex flex-col p-4 font-mono text-[#1a2012]">
              <div className="flex justify-between text-[8px] mb-8 font-bold opacity-50">
                <span>P1: 04</span>
                <span>HI: 99</span>
              </div>
              <div className="relative w-full h-24 border border-[#1a2012]/30 bg-[#2A321B]">
                <div className="absolute left-2 top-8 w-1 h-6 bg-[#1a2012] animate-pong-paddle"></div>
                <div className="absolute right-2 top-4 w-1 h-6 bg-[#1a2012] animate-pong-paddle-enemy"></div>
                <div className="absolute w-2 h-2 bg-[#1a2012] animate-pong-ball"></div>
              </div>
            </div>
          )}

          {questStates[2]?.solved ? (
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-gray-800">
              <div className="text-4xl mb-2">💾</div>
              <div className="text-[10px] font-black uppercase tracking-tighter">System Restored</div>
              <div className="mt-2 text-[8px] font-mono">Status: Online</div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2 transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0">👾</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Retro Revival</div>
              <div className="mt-2 text-[8px] text-green-500 font-mono animate-pulse">Preview: Display Repair</div>
            </div>
          )}

          {/* Status Dots */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
          </div>
        </div>

        {/* Tile 4: The Midnight Snack */}
        <div
          onClick={() => onStartQuest(3)}
          className={`relative w-full h-64 rounded-3xl p-6 cursor-pointer transition-all active:scale-95 overflow-hidden shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] border-2 border-transparent group ${questStates[3]?.solved ? 'bg-blue-950' : 'bg-[#000022]'}`}
        >
          {/* Playlet: Motion Sensor Cone */}
          {!questStates[3]?.solved && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-700 rounded-full shadow-lg"></div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-blue-500/20 rounded-t-full animate-sensor-scan origin-bottom"></div>
                <div className="absolute bottom-10 w-4 h-4 bg-red-500 rounded-full animate-intruder-move opacity-0"></div>
              </div>
            </div>
          )}

          {questStates[3]?.solved ? (
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-blue-100">
              <div className="text-4xl mb-2">💡</div>
              <div className="text-[10px] font-black uppercase tracking-tighter text-yellow-200">Motion Detected</div>
              <div className="mt-2 text-[8px] font-mono text-blue-300">Zone: Active</div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2 transition-transform duration-1000 group-hover:translate-y-[-5px]">🌙</div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest text-center">The Midnight Snack</div>
              <div className="mt-2 text-[8px] text-yellow-100 font-mono opacity-60">Preview: Sensor Logic</div>
            </div>
          )}

          {/* Status Dots */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
          </div>
        </div>
      </div>

      {/* spacer to prevent nav overlap */}
      <div className="h-20"></div>

      {/* Start Button Group (Removed as Cards are clickable) */}
      <style>{`
        @keyframes battery-charge { 0% { height: 0%; } 100% { height: 100%; } }
        .animate-battery-charge { animation: battery-charge 2s linear infinite; }
        
        @keyframes sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        
        @keyframes scale-x { 0%, 100% { transform: scaleX(0.8); } 50% { transform: scaleX(1.1); } }
        .animate-scale-x { animation: scale-x 3s ease-in-out infinite; }
        
        @keyframes pong-ball { 
           0% { left: 10%; top: 30%; } 
           25% { left: 50%; top: 10%; }
           50% { left: 90%; top: 60%; }
           75% { left: 50%; top: 90%; }
           100% { left: 10%; top: 30%; }
        }
        .animate-pong-ball { animation: pong-ball 2s linear infinite; }
        
        @keyframes pong-paddle { 0%, 100% { top: 20%; } 50% { top: 60%; } }
        .animate-pong-paddle { animation: pong-paddle 2s ease-in-out infinite alternate; }

        @keyframes pong-paddle-enemy { 0%, 100% { top: 50%; } 50% { top: 10%; } }
        .animate-pong-paddle-enemy { animation: pong-paddle-enemy 2.5s ease-in-out infinite alternate; }
        
        @keyframes sensor-scan { 0%, 100% { transform: rotate(-20deg); opacity: 0.1; } 50% { transform: rotate(20deg); opacity: 0.3; } }
        .animate-sensor-scan { animation: sensor-scan 4s ease-in-out infinite; }
        
        @keyframes intruder-move { 0% { left: -10%; } 100% { left: 110%; } }
        .animate-intruder-move { animation: intruder-move 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;

