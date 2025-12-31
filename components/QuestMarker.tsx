
import React from 'react';

interface QuestMarkerProps {
  onTap: () => void;
}

const QuestMarker: React.FC<QuestMarkerProps> = ({ onTap }) => {
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onTap(); }}
      className="absolute cursor-pointer pointer-events-auto z-50 group"
      style={{ top: '35%', left: '20%', transform: 'translate(-50%, -50%)' }}
    >
      <div className="relative animate-float-3d transform-gpu preserve-3d">
        {/* Neon Glow */}
        <div className="absolute inset-0 bg-cyan-500/40 blur-2xl rounded-full scale-150 animate-pulse group-hover:bg-amber-500/40" />
        
        {/* Question Mark Mesh Simulation */}
        <div className="relative text-7xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] flex flex-col items-center select-none group-hover:text-amber-400 group-hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
          <span className="leading-none transform-gpu animate-rotate-y">?</span>
          <div className="w-4 h-4 bg-cyan-400 rounded-full mt-2 shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:bg-amber-400" />
        </div>
      </div>
      
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes float-3d {
          0%, 100% { transform: translateY(0) rotateX(10deg); }
          50% { transform: translateY(-15px) rotateX(-5deg); }
        }
        @keyframes rotate-y {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .animate-float-3d {
          animation: float-3d 3s ease-in-out infinite;
        }
        .animate-rotate-y {
          animation: rotate-y 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QuestMarker;
