import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import ThreeScene from './components/ThreeScene';
import QuestsView from './components/QuestsView';
import LabView from './components/LabView';
import DePINView from './components/DePINView';
import MarketView from './components/MarketView';
import SuccessModal from './components/SuccessModal';
import { Backend } from './services/mockBackend';
import { NetworkId, UserProfile } from './types/web3';

const App: React.FC = () => {
  // === Global State ===
  const [gameState, setGameState] = useState<GameState>(GameState.DASHBOARD);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [activeQuestId, setActiveQuestId] = useState<number>(0);
  const [questStates, setQuestStates] = useState<{ solved: boolean }[]>([
    { solved: false }, // Quest 0: Juice Box (Splitter)
    { solved: false }, // Quest 1: Thirsty Monstera (Soil/Moisture)
    { solved: false }, // Quest 2: Retro Revival (Backlight)
    { solved: false }  // Quest 3: Midnight Snack (Sensors)
  ]);
  const [tooltipPositions, setTooltipPositions] = useState<{ [id: string]: { x: number, y: number } }>({
    Power_Status: { x: 0, y: 0 },
    Socket_Conflict: { x: 0, y: 0 },
    Moisture_Lvl: { x: 0, y: 0 },
    Light_Lvl: { x: 0, y: 0 },
    LCD_Info: { x: 0, y: 0 },
    Power_Input: { x: 0, y: 0 },
    Illuminance: { x: 0, y: 0 },
    Motion_Radius: { x: 0, y: 0 }
  });

  // === ForgeOS State ===
  const [activeView, setActiveView] = useState<'LAB' | 'QUESTS' | 'DEP' | 'MARKET'>('QUESTS');
  const [activeBuild, setActiveBuild] = useState<any>(null); // Shared Build State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Audio Context (Reserved)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // === Web3 Logic: Auth & Identity ===
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Simulating Wallet Connect
        const { user } = await Backend.login("0x71C...9A", NetworkId.POLYGON);
        setUserProfile(user);
        console.log("Web3 Auth Success:", user);
      } catch (e) {
        console.error("Auth Failed:", e);
        // In a real app, show "Switch Network" modal here
      }
    };
    initAuth();
  }, []);

  // Proposed Solution Data (for Solve Flow)
  const solutions = [
    { name: "Splitter Node V2", desc: "Pass-through power distribution.", efficiency: "98%", input: "USB-C PD" },
    { name: "Moisture Alarm V3", desc: "Capacitive soil monitoring.", efficiency: "100%", input: "3.3V GPIO" },
    { name: "Flex LED Strip", desc: "Edge-lit backlight retrofit.", efficiency: "95%", input: "5V Boost" },
    { name: "PIR Controller", desc: "Motion-activated dimmer.", efficiency: "99%", input: "12V Rail" }
  ];

  const updateTooltipPos = (id: string, x: number, y: number) => {
    setTooltipPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  const handleQuestTap = () => {
    // Placeholder for tapping 3D objects logic if needed
  };

  const setIsHoveringQuest = (isHovering: boolean) => {
    // Cursor logic
    document.body.style.cursor = isHovering ? 'pointer' : 'auto';
  };

  const setActiveSplitterPart = (partId: string | null) => {
    // Logic for parts hover
  };

  const handleStartQuest = (questId: number) => {
    setActiveQuestId(questId);
    setGameState(GameState.OBSERVING);
  };

  // Override: If in Solve Mode, we take over the screen.
  // Otherwise, we show the ForgeOS Shell.
  const isImmersiveMode = gameState !== GameState.DASHBOARD;

  return (
    <div className="relative w-full h-screen bg-[#e0e5ec] overflow-hidden font-sans text-slate-700 selection:bg-[#0038DF] selection:text-white">

      {/* === LAYER 0: Persistent 3D Scene === */}
      {/* Always rendered, z-0. We control visibility via opacity or passing props if needed. 
                In Dashboard mode, it might show a subtle background or be hidden. 
                For now, we keep it active as requested. */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isImmersiveMode || activeView === 'QUESTS' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ThreeScene
          gameState={gameState}
          activeQuestId={activeQuestId}
          onQuestTap={handleQuestTap}
          onQuestHover={setIsHoveringQuest}
          onSplitterHover={setActiveSplitterPart}
          updateTooltipPos={updateTooltipPos}
          setGameState={setGameState}
          setQuestStates={setQuestStates}
        />
      </div>

      {/* === LAYER 1: ForgeOS Shell (Main Views) === */}
      {/* Only visible when NOT in immersive solve mode */}
      {!isImmersiveMode && (
        <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">

          {/* View Container */}
          <div className="flex-1 relative overflow-hidden pointer-events-auto">
            {activeView === 'LAB' && <LabView />}
            {activeView === 'QUESTS' && <QuestsView questStates={questStates} onStartQuest={handleStartQuest} />}
            {activeView === 'DEP' && <DePINView activeBuild={activeBuild} />}
            {activeView === 'MARKET' && <MarketView />}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="h-20 bg-[#e0e5ec] shadow-[0_-4px_12px_rgba(163,177,198,0.3)] shrink-0 flex items-center justify-around px-2 pointer-events-auto z-20 pb-4">
            <NavButton label="LAB" icon="⚡" active={activeView === 'LAB'} onClick={() => setActiveView('LAB')} />
            <NavButton label="QUESTS" icon="🚩" active={activeView === 'QUESTS'} onClick={() => setActiveView('QUESTS')} />
            <NavButton label="DePIN" icon="🌐" active={activeView === 'DEP'} onClick={() => setActiveView('DEP')} />
            <NavButton label="MARKET" icon="💎" active={activeView === 'MARKET'} onClick={() => setActiveView('MARKET')} />
          </div>
        </div>
      )}

      {/* === LAYER 2: Immersive Overlays (Tooltips, Solver UI) === */}
      {/* Logic from original App.tsx regarding tooltips and solver overlays */}

      {/* Tooltips Layer (Only active in OBSERVE/BUILD modes) */}
      {gameState === GameState.OBSERVING && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* ... (Existing Tooltip Logic Mapped Here if we want full fidelity, simplified for brevity but re-injecting core ones) */}
          {/* For now, just a "Solve" button overlay if in Observe Mode */}
          <div className="absolute bottom-10 left-0 w-full flex justify-center pointer-events-auto">
            <button
              onClick={async () => {
                try {
                  if (userProfile) {
                    const session = await Backend.startSession(userProfile.walletAddress, activeQuestId);
                    setCurrentSessionId(session.id);
                    setGameState(GameState.BUILDING);
                  }
                } catch (e) {
                  alert("Session Start Failed: " + e);
                }
              }}
              className="bg-[#0038DF] text-white font-black text-xl py-4 px-12 rounded-full uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse"
            >
              Tap Here to Solve
            </button>
          </div>
          {/* Back Button */}
          <button
            onClick={() => setGameState(GameState.DASHBOARD)}
            className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold pointer-events-auto hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      )}

      {/* Solver UI (Agent Build) */}
      {gameState === GameState.BUILDING && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <AgentBuildOverlay activeQuestId={activeQuestId} onComplete={() => setGameState(GameState.READY_TO_DEPLOY)} />
        </div>
      )}

      {/* Manual Deploy Step */}
      {gameState === GameState.READY_TO_DEPLOY && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-95">
          <SolutionCard
            solution={solutions[activeQuestId]}
            onDeploy={async () => {
              if (currentSessionId) {
                // Submit Score Logic
                try {
                  await Backend.submitScore({
                    sessionId: currentSessionId,
                    score: 100,
                    clientTimestamp: Date.now(),
                    signature: "mock_sig_123"
                  });
                  console.log("Score Submitted to Ledger");
                } catch (e) {
                  console.error("Score Verification Failed:", e);
                }
              }
              setGameState(GameState.REVEALING);
            }}
          />
        </div>
      )}

      {/* Success Modal (Placeholder shown after Reveal if needed, or we rely on 3D result) */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

    </div>
  );
};

// --- Sub Comps ---

const NavButton: React.FC<{ label: string, icon: string, active: boolean, onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 w-16 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${active ? 'bg-[#e0e5ec] text-[#0038DF] shadow-[inset_3px_3px_6px_#a3b1c6,inset_-3px_-3px_6px_#ffffff]' : 'text-slate-400'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-bold tracking-wider transition-colors ${active ? 'text-[#0038DF]' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const AgentBuildOverlay: React.FC<{ activeQuestId: number, onComplete: () => void }> = ({ activeQuestId, onComplete }) => {
  // Re-implementation of the Shimmer UI
  return (
    <div className="w-full max-w-md bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
        <div className="text-cyan-500 font-mono text-xs tracking-[0.2em]">AGENT_RUNTIME_ACTIVE</div>
      </div>
      <div className="font-mono text-xs text-stone-300 space-y-3 leading-relaxed min-h-[100px]">
        <TypewriterLog activeQuestId={activeQuestId} onComplete={onComplete} />
      </div>
      <div className="h-1 w-full bg-stone-800 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-cyan-500 animate-progres-fill"></div>
      </div>
      <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                .animate-shimmer { animation: shimmer 2s infinite; }
                @keyframes progress-fill { 0% { width: 0%; } 100% { width: 100%; } }
                .animate-progres-fill { animation: progress-fill 2s linear forwards; }
            `}</style>
    </div>
  );
};

const TypewriterLog: React.FC<{ activeQuestId: number, onComplete: () => void }> = ({ activeQuestId, onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const prompts = [
      ["> ANALYZING_POWER...", "> SOCKET_CONTENTION", "> SOLVING: SPLITTER_V2", "> COMPILING..."], // Q0
      ["> SOIL_SCAN: CRITICAL", "> MOISTURE: 12%", "> SOLVING: SENSOR_V3", "> COMPILING..."], // Q1
      ["> DIAGNOSTIC: 0V", "> BACKLIGHT: FAIL", "> SOLVING: LED_STRIP", "> COMPILING..."], // Q2
      ["> LUX_METER: LOW", "> MOTION: NONE", "> SOLVING: PIR_NODE", "> COMPILING..."] // Q3
    ][activeQuestId];

    let i = 0;
    const interval = setInterval(() => {
      if (i < prompts.length) {
        setLines(prev => [...prev, prompts[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [activeQuestId, onComplete]);

  return <div>{lines.map((l, i) => <div key={i}>{l}</div>)}</div>;
};

const SolutionCard: React.FC<{ solution: any, onDeploy: () => void }> = ({ solution, onDeploy }) => (
  <div className="relative w-[400px] bg-stone-900 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] flex flex-col gap-4">
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div className="text-cyan-400 font-black tracking-widest uppercase text-sm">Solution Proposed</div>
      <div className="text-green-500 text-[10px] font-mono border border-green-500/50 px-2 py-0.5 rounded">READY</div>
    </div>
    <div className="space-y-1">
      <div className="text-stone-400 text-[10px] uppercase tracking-wider">Hardware Component</div>
      <div className="text-white text-2xl font-black">{solution.name}</div>
      <p className="text-stone-300 text-xs leading-relaxed">{solution.desc}</p>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="bg-black/40 p-3 rounded-lg border border-white/5">
        <div className="text-stone-500 text-[8px] uppercase">Efficiency</div>
        <div className="text-green-400 font-mono text-sm">{solution.efficiency}</div>
      </div>
      <div className="bg-black/40 p-3 rounded-lg border border-white/5">
        <div className="text-stone-500 text-[8px] uppercase">Input Type</div>
        <div className="text-cyan-400 font-mono text-sm">{solution.input}</div>
      </div>
    </div>
    <button
      onClick={onDeploy}
      className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group">
      <span>Deploy Fix</span>
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </button>
  </div>
);

export default App;
