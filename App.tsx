
import React, { useState, useEffect, useRef } from 'react';
import { GameState, INITIAL_PARTS } from './types';
import ThreeScene from './components/ThreeScene';
import SplitterBuilder from './components/SplitterBuilder';
import FloatingHud from './components/FloatingHud';
import TetheredTooltip from './components/TetheredTooltip';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.DASHBOARD);
  const [isHoveringQuest, setIsHoveringQuest] = useState(false);
  const [activeSplitterPart, setActiveSplitterPart] = useState<string | null>(null);
  const [questStates, setQuestStates] = useState([{ solved: false }]);
  const [tooltipPositions, setTooltipPositions] = useState<Record<string, { x: number, y: number }>>({
    Power_Status: { x: 0, y: 0 },
    Socket_Conflict: { x: 0, y: 0 }
  });
  const audioCtxRef = useRef<AudioContext | null>(null);

  const updateTooltipPos = (id: string, x: number, y: number) => {
    setTooltipPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  const handleQuestTap = () => {
    setGameState(GameState.ZOOMING);
    setTimeout(() => setGameState(GameState.BUILDING), 1000);
  };

  const currentPart = INITIAL_PARTS.find(p => p.id === activeSplitterPart);

  return (
    <div className="relative min-h-screen w-full bg-[#020205] overflow-hidden text-stone-200 font-mono flex items-center justify-center">
      
      {/* Three.js Background Layer - Always active but camera changes */}
      <ThreeScene 
        gameState={gameState} 
        onQuestTap={handleQuestTap} 
        onQuestHover={setIsHoveringQuest}
        onSplitterHover={setActiveSplitterPart}
        updateTooltipPos={updateTooltipPos} 
      />

      {/* Interface Manager */}
      <div className="absolute inset-0 z-[999] pointer-events-none flex items-center justify-center">
        
        {/* State: Dashboard Hub */}
        {gameState === GameState.DASHBOARD && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <Dashboard 
              onStartQuest={(id) => setGameState(GameState.OBSERVING)} 
              questStates={questStates} 
            />
          </div>
        )}

        {/* State: Observing / Quest Active */}
        {gameState === GameState.OBSERVING && (
          <>
            <FloatingHud />
            <div className="absolute bottom-16 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
               <button onClick={handleQuestTap} className="pointer-events-auto bg-black/80 border-2 border-cyan-400 text-cyan-400 px-12 py-5 font-black text-xl tracking-[0.3em] uppercase animate-solve-pulse transition-all hover:scale-110 hover:bg-cyan-400 hover:text-black shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                TAP HERE TO SOLVE
              </button>
               <button onClick={() => setGameState(GameState.DASHBOARD)} className="pointer-events-auto text-[10px] text-stone-500 underline uppercase tracking-widest hover:text-stone-300">Return to Hub</button>
            </div>
          </>
        )}

        {/* State: Builder Interface */}
        {gameState === GameState.BUILDING && (
          <div className="pointer-events-auto animate-in zoom-in-105 duration-500">
             <SplitterBuilder onComplete={() => {
                setGameState(GameState.CHARGING);
                setQuestStates([{ solved: true }]);
             }} />
          </div>
        )}

        {/* State: Solved / manifest */}
        {gameState === GameState.CHARGING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {activeSplitterPart && currentPart && (
              <div className="bg-black/95 border border-[#0038DF] p-5 rounded-2xl backdrop-blur-2xl animate-in zoom-in-95 pointer-events-auto max-w-[280px] shadow-[0_0_50px_rgba(0,56,223,0.4)]">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[#0038DF] text-[8px] font-black tracking-[0.2em] uppercase">{currentPart.technicalSpecs?.id}</div>
                  <div className="text-green-500 text-[8px] font-bold uppercase">{currentPart.technicalSpecs?.efficiency} Efficient</div>
                </div>
                <div className="text-white font-black text-xl mb-1 leading-tight">{currentPart.name}</div>
                <p className="text-stone-400 text-[10px] leading-relaxed mb-4">{currentPart.description}</p>
                <div className="p-2 bg-stone-900/50 rounded-lg border border-stone-800">
                  <div className="text-[8px] text-stone-500 uppercase tracking-widest mb-1">Input Topology</div>
                  <div className="text-xs font-bold text-white">{currentPart.technicalSpecs?.input}</div>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8">
              <div className="text-green-500 text-[10px] flex items-center gap-2 tracking-[0.5em] font-black uppercase">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Hardware_Verified
              </div>
              <button onClick={() => setGameState(GameState.DASHBOARD)} className="pointer-events-auto bg-[#0038DF] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/20">
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tooltips for 3D anchors */}
      <TetheredTooltip 
        id="Socket_Conflict"
        label="HW_CONFLICT_DETECTED"
        text="SOCKET: OCCUPIED BY LAMP_V2"
        anchorSide="right"
        active={gameState === GameState.OBSERVING && isHoveringQuest}
        position={{ top: '38%', left: '30%', anchorX: `${tooltipPositions.Socket_Conflict.x}px`, anchorY: `${tooltipPositions.Socket_Conflict.y}px` }}
      />

      <TetheredTooltip 
        id="Power_Status"
        label="LPT_BATT_STATUS"
        text="CRITICAL: 1% | REQ: 60W PD"
        anchorSide="left"
        active={gameState === GameState.ZOOMING || gameState === GameState.BUILDING}
        position={{ top: '25%', left: '15%', anchorX: `${tooltipPositions.Power_Status.x}px`, anchorY: `${tooltipPositions.Power_Status.y}px` }}
      />

      <style>{`
        @keyframes solve-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        .animate-solve-pulse { animation: solve-pulse 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
