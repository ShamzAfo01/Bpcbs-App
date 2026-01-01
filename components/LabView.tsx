import React, { useState } from 'react';

const LabView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Mock AI Generation delay
        setTimeout(() => {
            setResult({
                name: "Custom PCB Node",
                components: ["ESP32-S3", "DHT22 Sensor", "LiPo Charger"],
                specs: { voltage: "3.3V", current: "150mA" }
            });
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="h-full w-full p-6 flex flex-col gap-6 overflow-y-auto pb-24">
            <h1 className="text-2xl font-black text-slate-700 tracking-tight">Hardware Lab ⚡</h1>

            {/* Prompt Input */}
            <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff]">
                <label className="block text-slate-500 text-sm font-bold mb-2 uppercase tracking-wide">Synthesis Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 bg-[#e0e5ec] rounded-xl p-4 text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] resize-none font-mono text-sm"
                    placeholder="Describe the hardware you want to build..."
                />
            </div>

            {/* Action Button */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-white shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] transition-all active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] active:scale-95 ${isGenerating ? 'bg-slate-400' : 'bg-[#0038DF]'}`}
            >
                {isGenerating ? 'Synthesizing...' : 'Generate Schematic'}
            </button>

            {/* Result Display */}
            {result && (
                <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-700">{result.name}</h2>
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold border border-green-200">READY</span>
                    </div>
                    <div className="space-y-2 mb-6">
                        {result.components.map((comp: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-[#0038DF] rounded-full"></span>
                                {comp}
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 rounded-lg border-2 border-[#0038DF] text-[#0038DF] font-bold uppercase tracking-wide hover:bg-[#0038DF] hover:text-white transition-colors">
                        Go to EDA Viewer →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LabView;
