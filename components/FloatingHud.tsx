
import React from 'react';

const HudSnippet: React.FC<{ 
  label: string; 
  value: string; 
  className?: string; 
  delay?: string 
}> = ({ label, value, className, delay = '0s' }) => (
  <div 
    className={`absolute p-2 border-l-2 border-amber-500/50 bg-stone-900/40 backdrop-blur-sm pointer-events-none animate-float-slow ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="text-[8px] font-mono text-stone-500 uppercase tracking-widest">{label}</div>
    <div className="text-[10px] font-bold text-amber-100">{value}</div>
    <div className="absolute -right-1 top-0 w-1 h-1 bg-amber-500" />
    <div className="absolute -right-1 bottom-0 w-1 h-1 bg-amber-500" />
  </div>
);

const FloatingHud: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-stone-800 opacity-50" />
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-stone-800 opacity-50" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-stone-800 opacity-50" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-stone-800 opacity-50" />

      {/* Floating Intel */}
      <HudSnippet 
        label="Environment" 
        value="Rainy / 14:42" 
        className="top-1/4 left-10" 
        delay="0.2s"
      />
      <HudSnippet 
        label="Status" 
        value="Critical Battery" 
        className="top-1/3 right-12 text-right" 
        delay="1s"
      />
      <HudSnippet 
        label="Detected Obstruct" 
        value="Lamp_V2 (Low Wattage)" 
        className="bottom-1/4 left-12" 
        delay="0.5s"
      />
      <HudSnippet 
        label="Scanning" 
        value="Searching for splitter..." 
        className="bottom-1/3 right-10 text-right" 
        delay="1.5s"
      />

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingHud;
