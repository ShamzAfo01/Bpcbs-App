
import React from 'react';

interface TetheredTooltipProps {
  id: string;
  text: string;
  label: string;
  anchorSide: 'left' | 'right';
  active: boolean;
  position: { top: string; left: string; anchorX: string; anchorY: string };
}

const TetheredTooltip: React.FC<TetheredTooltipProps> = ({ label, text, anchorSide, active, position }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* SVG Line Renderer */}
      <svg className="absolute inset-0 w-full h-full">
        <line 
          x1={position.anchorX} 
          y1={position.anchorY} 
          x2={position.left} 
          y2={position.top} 
          stroke="rgba(251, 191, 36, 0.4)" 
          strokeWidth="1" 
          strokeDasharray="4 2"
          className="animate-dash"
        />
        <circle cx={position.anchorX} cy={position.anchorY} r="3" fill="#fbbf24" className="animate-pulse" />
      </svg>

      {/* Tooltip Box */}
      <div 
        className={`absolute p-2 bg-stone-900/90 border border-stone-700 backdrop-blur-md transition-all duration-500 transform ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
      >
        <div className="text-[8px] font-mono text-amber-500 uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-[10px] font-bold text-stone-100 whitespace-nowrap">{text}</div>
        <div className={`absolute ${anchorSide === 'left' ? '-left-1' : '-right-1'} top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rotate-45 border border-stone-700`} />
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -12; }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TetheredTooltip;
