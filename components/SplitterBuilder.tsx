
import React, { useState } from 'react';
import { Part, INITIAL_PARTS } from '../types';

interface SplitterBuilderProps {
  onComplete: () => void;
}

const LogoSVG = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.478174" y="0.47793" width="18.8062" height="16.2562" fill="#0038DF"/>
    <rect x="0.478174" y="0.47793" width="18.8062" height="16.2562" stroke="black" stroke-width="0.95625"/>
    <path d="M0.956299 16.2563V8.48196H5.19189L8.21732 3.50635L11.8478 13.4576L14.8732 8.79293H18.8063V16.2563H0.956299Z" fill="white"/>
    <path d="M9.88135 8.60635L7.96885 3.50635L4.78135 8.60635H1.59385" stroke="black" stroke-width="1.275" stroke-linecap="square"/>
    <path d="M9.88135 8.60605L11.7938 13.7061L14.9813 8.60605H18.1688" stroke="black" stroke-width="1.275" stroke-linecap="square"/>
  </svg>
);

const SplitterBuilder: React.FC<SplitterBuilderProps> = ({ onComplete }) => {
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);

  const togglePart = (id: string) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, isPlaced: !p.isPlaced } : p));
  };

  const isComplete = parts.every(p => p.isPlaced);

  return (
    <div className="relative w-[402px] h-[874px] bg-white rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden scale-[0.85] md:scale-100 border-[10px] border-black">
      {/* buildPCBs Logo Section */}
      <div className="absolute left-[149px] top-[47px] w-[104.85px] h-[23px] flex items-center gap-[5.25px]">
        <div className="w-[17.85px] h-[15.3px]">
          <LogoSVG />
        </div>
        <span className="text-[#444444] font-medium text-[18px] leading-[23px] tracking-[-0.04em] font-['DM Sans']">
          buildPCBs
        </span>
      </div>

      {/* Subtitle */}
      <div className="absolute left-[16px] top-[123px] w-[356px] text-[#888888] font-extrabold text-[22px] leading-[120%] tracking-[0.01em] font-['Google Sans Flex']">
        Solve one of the scenes to earn.
      </div>

      {/* Grid of 4 Tiles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Frame 1 - Top Left */}
        <div 
          onClick={() => togglePart(parts[0].id)}
          className={`pointer-events-auto absolute w-[180px] h-[256px] left-[16px] top-[179px] bg-[#EDEDED] border-[0.3px] border-[#AEAEAE] rounded-[12px] flex flex-col items-center justify-center p-4 transition-all ${parts[0].isPlaced ? 'bg-blue-50 ring-2 ring-[#0038DF]' : ''}`}
        >
           <span className="text-4xl mb-4 grayscale opacity-40">{parts[0].icon}</span>
           <span className="text-[#444444] font-bold text-center text-xs uppercase tracking-widest">{parts[0].name}</span>
           {parts[0].isPlaced && <div className="absolute top-3 right-3 w-5 h-5 bg-[#0038DF] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
        </div>

        {/* Frame 2 - Top Right */}
        <div 
          onClick={() => togglePart(parts[1].id)}
          className={`pointer-events-auto absolute w-[180px] h-[256px] left-[206px] top-[179px] bg-[#EDEDED] border-[0.3px] border-[#AEAEAE] rounded-[12px] flex flex-col items-center justify-center p-4 transition-all ${parts[1].isPlaced ? 'bg-blue-50 ring-2 ring-[#0038DF]' : ''}`}
        >
           <span className="text-4xl mb-4 grayscale opacity-40">{parts[1].icon}</span>
           <span className="text-[#444444] font-bold text-center text-xs uppercase tracking-widest">{parts[1].name}</span>
           {parts[1].isPlaced && <div className="absolute top-3 right-3 w-5 h-5 bg-[#0038DF] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
        </div>

        {/* Frame 3 - Bottom Left */}
        <div 
          onClick={() => togglePart(parts[2].id)}
          className={`pointer-events-auto absolute w-[180px] h-[256px] left-[16px] top-[444px] bg-[#EDEDED] border-[0.3px] border-[#AEAEAE] rounded-[12px] flex flex-col items-center justify-center p-4 transition-all ${parts[2].isPlaced ? 'bg-blue-50 ring-2 ring-[#0038DF]' : ''}`}
        >
           <span className="text-4xl mb-4 grayscale opacity-40">{parts[2].icon}</span>
           <span className="text-[#444444] font-bold text-center text-xs uppercase tracking-widest">{parts[2].name}</span>
           {parts[2].isPlaced && <div className="absolute top-3 right-3 w-5 h-5 bg-[#0038DF] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
        </div>

        {/* Frame 4 - Bottom Right */}
        <div 
          onClick={() => togglePart(parts[3].id)}
          className={`pointer-events-auto absolute w-[180px] h-[256px] left-[206px] top-[444px] bg-[#EDEDED] border-[0.3px] border-[#AEAEAE] rounded-[12px] flex flex-col items-center justify-center p-4 transition-all ${parts[3].isPlaced ? 'bg-blue-50 ring-2 ring-[#0038DF]' : ''}`}
        >
           <span className="text-4xl mb-4 grayscale opacity-40">{parts[3].icon}</span>
           <span className="text-[#444444] font-bold text-center text-xs uppercase tracking-widest">{parts[3].name}</span>
           {parts[3].isPlaced && <div className="absolute top-3 right-3 w-5 h-5 bg-[#0038DF] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
        </div>
      </div>

      {/* Start Button Group */}
      <div className="absolute left-[64px] top-[762px] w-[274px] h-[75px]">
        {/* Rectangle 3 (Border/Background) */}
        <div className="absolute w-[274px] h-[75px] bg-[#0038DF] border border-black rounded-[99px]"></div>
        
        {/* Rectangle 2 (Gradient Overlay) */}
        <button 
          onClick={() => isComplete && onComplete()}
          className={`absolute w-[274px] h-[65px] border border-black rounded-[99px] flex items-center justify-center transition-all ${isComplete ? 'cursor-pointer active:scale-95' : 'grayscale cursor-not-allowed opacity-50'}`}
          style={{ background: 'linear-gradient(180deg, #0038DF 20.77%, #6C90FF 112.31%)' }}
        >
          <span className="text-white font-black text-[22px] leading-[120%] tracking-[0.005em] font-['Google Sans Flex']">
            Start
          </span>
        </button>
      </div>

      {/* Progress Footer */}
      <div className="absolute bottom-[20px] left-0 w-full text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest">
        {parts.filter(p => p.isPlaced).length} / {parts.length} Components Configured
      </div>
    </div>
  );
};

export default SplitterBuilder;
