
import React, { useState, useEffect, useRef } from 'react';
import { GameState, INITIAL_PARTS } from './types';
import ThreeScene from './components/ThreeScene';
import SplitterBuilder from './components/SplitterBuilder';
import FloatingHud from './components/FloatingHud';
import TetheredTooltip from './components/TetheredTooltip';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.DASHBOARD);
  const [activeQuestId, setActiveQuestId] = useState<number>(0);
  const [isHoveringQuest, setIsHoveringQuest] = useState(false);
  const [activeSplitterPart, setActiveSplitterPart] = useState<string | null>(null);
  const [questStates, setQuestStates] = useState([{ solved: false }, { solved: false }, { solved: false }, { solved: false }]);
  const [tooltipPositions, setTooltipPositions] = useState<Record<string, { x: number, y: number }>>({
    Power_Status: { x: 0, y: 0 },
    Socket_Conflict: { x: 0, y: 0 },
    Moisture_Lvl: { x: 0, y: 0 },
    Light_Lvl: { x: 0, y: 0 },
    LCD_Info: { x: 0, y: 0 },
    Power_Input: { x: 0, y: 0 },
    Illuminance: { x: 0, y: 0 },
    Motion_Radius: { x: 0, y: 0 }
  });
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Proposed Solution Data
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
    setGameState(GameState.ZOOMING);
    setTimeout(() => setGameState(GameState.BUILDING), 1000);
  };

  const handleQuestStart = (questId: number) => {
    setActiveQuestId(questId);
    setGameState(GameState.OBSERVING);
  };

  const currentPart = INITIAL_PARTS.find(p => p.id === activeSplitterPart);

  return (
    <div className="relative min-h-screen w-full bg-[#020205] overflow-hidden text-stone-200 font-mono flex items-center justify-center">

      {/* Three.js Background Layer - Always active but camera changes */}
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

      {/* Interface Manager */}
      <div className="absolute inset-0 z-[999] pointer-events-none flex items-center justify-center">

        {/* State: Dashboard Hub */}
        {gameState === GameState.DASHBOARD && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <Dashboard
              onStartQuest={handleQuestStart}
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

        {/* State: Agent Building (Shimmer UI) */}
        {gameState === GameState.BUILDING && (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-500">
            <div className="relative w-[500px] h-[300px] bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col p-8">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="text-cyan-400 font-mono text-sm tracking-[0.2em] font-bold">AGENT_RUNTIME_ACTIVE</div>
              </div>

              {/* Terminal Logs */}
              <div className="flex-1 font-mono text-xs text-stone-300 space-y-3 leading-relaxed">
                <TypewriterLog activeQuestId={activeQuestId} onComplete={() => setGameState(GameState.READY_TO_DEPLOY)} />
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-stone-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-cyan-500 animate-progres-fill"></div>
              </div>
            </div>
          </div>
        )}

        {/* State: Ready to Deploy (Manual Confirmation) */}
        {gameState === GameState.READY_TO_DEPLOY && (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 animate-in zoom-in-95 duration-300">
            <div className="relative w-[400px] bg-stone-900 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="text-cyan-400 font-black tracking-widest uppercase text-sm">Solution Proposed</div>
                <div className="text-green-500 text-[10px] font-mono border border-green-500/50 px-2 py-0.5 rounded">READY</div>
              </div>

              <div className="space-y-1">
                <div className="text-stone-400 text-[10px] uppercase tracking-wider">Hardware Component</div>
                <div className="text-white text-2xl font-black">{solutions[activeQuestId].name}</div>
                <p className="text-stone-300 text-xs leading-relaxed">{solutions[activeQuestId].desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="text-stone-500 text-[8px] uppercase">Efficiency</div>
                  <div className="text-green-400 font-mono text-sm">{solutions[activeQuestId].efficiency}</div>
                </div>
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="text-stone-500 text-[8px] uppercase">Input Type</div>
                  <div className="text-cyan-400 font-mono text-sm">{solutions[activeQuestId].input}</div>
                </div>
              </div>

              <button
                onClick={() => setGameState(GameState.REVEALING)}
                className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group"
              >
                <span>Deploy Fix</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.REVEALING && (
          // Hidden state primarily for ThreeScene to handle animations, but we can show a subtle "Installing..." UI
          <div className="absolute bottom-10 left-10 text-cyan-500 font-mono text-xs animate-pulse tracking-[0.2em]">
            INSTALLING_HARDWARE...
          </div>
        )}

        {/* State: Solved / manifest (CHARGING) */}
        {gameState === GameState.CHARGING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {activeQuestId === 0 && activeSplitterPart && currentPart && (
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

            {activeQuestId === 1 && (
              <div className="bg-black/95 border border-green-500 p-5 rounded-2xl backdrop-blur-2xl animate-in zoom-in-95 pointer-events-auto max-w-[320px] shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <div className="text-green-500 font-black text-xl mb-2">SYSTEM STABILIZED</div>
                <div className="text-stone-300 text-xs">Moisture levels optimal. Plant health restoring.</div>
              </div>
            )}

            {activeQuestId === 2 && (
              <div className="bg-stone-900/95 border-2 border-green-500 p-6 rounded-sm backdrop-blur-xl animate-in zoom-in-95 pointer-events-auto max-w-[350px] shadow-[0_0_50px_rgba(0,255,0,0.2)] font-mono">
                <div className="text-green-500 font-bold text-2xl mb-2 tracking-tighter blink">SYSTEM RESTORED</div>
                <div className="w-full h-[1px] bg-green-900 mb-2"></div>
                <div className="text-green-300 text-xs leading-5">
                  {'>'} BACKLIGHT_VOLTAGE: STABLE<br />
                  {'>'} DISPLAY_DRIVER: ONLINE<br />
                  {'>'} GAME_LOADED: TETRIS_1989.ROM
                </div>
              </div>
            )}

            {activeQuestId === 3 && (
              <div className="bg-blue-950/95 border-2 border-yellow-400 p-6 rounded-xl backdrop-blur-xl animate-in zoom-in-95 pointer-events-auto max-w-[350px] shadow-[0_0_50px_rgba(250,204,21,0.3)] font-mono">
                <div className="text-yellow-400 font-bold text-2xl mb-2 tracking-widest flex items-center gap-2">
                  <span>💡</span> MOTION DETECTED
                </div>
                <div className="text-blue-200 text-xs uppercase font-bold">Lighting Zones: Active</div>
                <div className="text-[10px] text-blue-400 mt-2">PWM Dimmer: 60% Duty Cycle</div>
              </div>
            )}

            <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8">
              <div className="text-green-500 text-[10px] flex items-center gap-2 tracking-[0.5em] font-black uppercase">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {activeQuestId === 0 ? 'Hardware_Verified' : activeQuestId === 1 ? 'Biological_Asset_Saved' : activeQuestId === 2 ? 'Retro_Hardware_Fixed' : 'Lighting_Optimized'}
              </div>
              <button onClick={() => setGameState(GameState.DASHBOARD)} className="pointer-events-auto bg-[#0038DF] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/20">
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tooltips for 3D anchors - QUEST 1 */}
      {activeQuestId === 0 && (
        <>
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
        </>
      )}

      {/* Tooltips for 3D anchors - QUEST 2 */}
      {activeQuestId === 1 && (
        <>
          <TetheredTooltip
            id="Moisture_Lvl"
            label="MOISTURE_LVL"
            text="12% | STATUS: CRITICAL"
            anchorSide="left"
            active={gameState === GameState.OBSERVING}
            position={{ top: '20%', left: '20%', anchorX: `${tooltipPositions.Moisture_Lvl.x}px`, anchorY: `${tooltipPositions.Moisture_Lvl.y}px` }}
            isCritical={true}
          />
          <TetheredTooltip
            id="Light_Lvl"
            label="LIGHT_LVL"
            text="SUNLIGHT: OPTIMAL"
            anchorSide="right"
            active={gameState === GameState.OBSERVING}
            position={{ top: '20%', left: '70%', anchorX: `${tooltipPositions.Light_Lvl.x}px`, anchorY: `${tooltipPositions.Light_Lvl.y}px` }}
          />
        </>
      )}

      {/* Tooltips for 3D anchors - QUEST 3 (RETRO REVIVAL) */}
      {activeQuestId === 2 && (
        <>
          <TetheredTooltip
            id="LCD_Info"
            label="DIAGNOSTIC_TOOL_V1.0"
            text="REFLECTIVE_LCD_PANEL // NO_BACKLIGHT_FOUND"
            anchorSide="left"
            active={gameState === GameState.OBSERVING}
            position={{ top: '15%', left: '25%', anchorX: `${tooltipPositions.LCD_Info?.x}px`, anchorY: `${tooltipPositions.LCD_Info?.y}px` }}
            isCritical={true}
          />
          <TetheredTooltip
            id="Power_Input"
            label="VOLTAGE_METER"
            text="V_INPUT: 4.5V // STABLE"
            anchorSide="right"
            active={gameState === GameState.OBSERVING}
            position={{ top: '60%', left: '75%', anchorX: `${tooltipPositions.Power_Input?.x}px`, anchorY: `${tooltipPositions.Power_Input?.y}px` }}
          />
        </>
      )}

      {/* Tooltips for 3D anchors - QUEST 4 (MIDNIGHT SNACK) */}
      {activeQuestId === 3 && (
        <>
          <TetheredTooltip
            id="Illuminance"
            label="LIGHT_METER"
            text="ILLUMINANCE: < 1.0 LUX // EYE_STRAIN_RISK"
            anchorSide="left"
            active={gameState === GameState.OBSERVING}
            position={{ top: '30%', left: '20%', anchorX: `${tooltipPositions.Illuminance?.x}px`, anchorY: `${tooltipPositions.Illuminance?.y}px` }}
            isCritical={true}
          />
          <TetheredTooltip
            id="Motion_Radius"
            label="SENSOR_PROJECTION"
            text="MOTION_DETECTION_RADIUS: 1.5M"
            anchorSide="right"
            active={gameState === GameState.OBSERVING}
            position={{ top: '65%', left: '60%', anchorX: `${tooltipPositions.Motion_Radius?.x}px`, anchorY: `${tooltipPositions.Motion_Radius?.y}px` }}
          />
        </>
      )}


      <style>{`
        @keyframes solve-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        .animate-solve-pulse { animation: solve-pulse 1.2s ease-in-out infinite; }
        
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
        
        @keyframes progress-fill { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progres-fill { animation: progress-fill 2s linear forwards; }
      `}</style>
    </div>
  );
};

// Sub-component for Typewriter Logs
const TypewriterLog: React.FC<{ activeQuestId: number, onComplete: () => void }> = ({ activeQuestId, onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const prompts = [
      [ // Quest 1
        "> ANALYZING_POWER_TOPOLOGY...",
        "> DETECTED: SOCKET_CONTENTION",
        "> GENERATING_SOLUTION: PASS_THROUGH_SPLITTER_V2",
        "> COMPILING_HARDWARE_NODE..."
      ],
      [ // Quest 2
        "> SCANNING_SOIL_CONDUCTIVITY...",
        "> MOISTURE_LEVEL: CRITICAL_LOW",
        "> CONFIGURING_SENSOR: CAPACITIVE_V3",
        "> COMPILING_MOISTURE_ALARM_PCB..."
      ],
      [ // Quest 3
        "> DIAGNOSING_DISPLAY_FAILURE...",
        "> BACKLIGHT_RAIL: 0V",
        "> ROUTING_POWER: 5V_BOOST_CONVERTER",
        "> COMPILING_FLEX_LED_STRIP..."
      ],
      [ // Quest 4
        "> MEASURING_ILLUMINANCE...",
        "> DETECTED: < 1 LUX",
        "> CONFIGURING: PIR_MOTION_SENSOR_NODE",
        "> COMPILING_LIGHTING_CONTROLLER..."
      ]
    ][activeQuestId];

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < prompts.length) {
        setLines(prev => [...prev, prompts[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 200); // 200ms delay after last line
      }
    }, 400); // 4 lines * 400ms = ~1.6s

    return () => clearInterval(interval);
  }, [activeQuestId, onComplete]);

  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="opacity-50 mr-2">{(i + 1).toString().padStart(2, '0')}</span>
          {line}
        </div>
      ))}
    </>
  );
};

export default App;
