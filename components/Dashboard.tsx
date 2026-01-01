
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
    <div className="relative w-[402px] h-[874px] bg-white rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto border-[8px] border-black scale-90 md:scale-100">
      {/* Header */}
      <div className="absolute left-[149px] top-[47px] flex items-center gap-[5.25px]">
        <LogoSVG />
        <span className="text-[#444444] font-medium text-[18px] leading-[23px] tracking-[-0.04em] font-['DM Sans']">
          buildPCBs
        </span>
      </div>

      {/* Title */}
      <div className="absolute left-[16px] top-[123px] w-[356px] text-[#888888] font-extrabold text-[22px] leading-[120%] tracking-[0.01em]">
        Solve one of the scenes to earn.
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pt-[179px] px-[16px]">
        <div className="grid grid-cols-2 gap-[10px]">
          {/* Tile 1: Juice Box */}
          <div
            onClick={() => onStartQuest(0)}
            className={`relative rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 active:scale-95 overflow-hidden duration-300 shadow-md border-2 border-transparent hover:border-blue-300 group ${questStates[0].solved ? 'bg-blue-50' : 'bg-[#F0F4F8]'}`}
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
            className={`relative rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 active:scale-95 overflow-hidden duration-300 shadow-md border-2 border-transparent hover:border-green-300 group ${questStates[1].solved ? 'bg-green-50' : 'bg-[#FDFBE6]'}`}
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

          {/* Tile 3: The Retro Revival (Unlocked) */}
          <div
            onClick={() => onStartQuest(2)}
            className={`relative rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 active:scale-95 overflow-hidden duration-300 shadow-md border-2 border-transparent hover:border-gray-500 group ${questStates[2]?.solved ? 'bg-gray-200' : 'bg-[#1a1a1a]'}`}
          >
            {/* Playlet: Retro Static Noise */}
            {!questStates[2]?.solved && (
              <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-[20%] left-[10%] w-[80%] h-[2px] bg-green-500 animate-pulse shadow-[0_0_10px_#0F0]"></div>
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

          {/* Tile 4: Locked */}
          <div className="w-[180px] h-[256px] bg-[#EDEDED] border-[0.3px] border-[#AEAEAE] rounded-[12px] mt-[9px] opacity-40 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
        </div>
      </div>

      {/* Start Button Group */}
      <div className="absolute left-[64px] top-[762px] w-[274px] h-[75px]">
        <div className="absolute w-[274px] h-[75px] bg-[#0038DF] border border-black rounded-[99px]"></div>
        <button
          onClick={() => onStartQuest(0)}
          className="absolute w-[274px] h-[65px] border border-black rounded-[99px] flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(180deg, #0038DF 20.77%, #6C90FF 112.31%)' }}
        >
          <span className="text-white font-black text-[22px] font-['Google Sans Flex']">Start</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
