import React from 'react';

const DePINView: React.FC<{ activeBuild: any }> = ({ activeBuild }) => {
    return (
        <div className="h-full w-full p-6 flex flex-col gap-6 overflow-y-auto pb-24">
            <h1 className="text-2xl font-black text-slate-700 tracking-tight">DePIN Network 🌐</h1>

            {/* Network Status */}
            <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] flex items-center justify-between">
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Network Status</div>
                    <div className="text-slate-700 font-black text-lg">ONLINE</div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </div>

            {/* Active Build Card */}
            {activeBuild ? (
                <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#0038DF]"></div>
                    <h2 className="text-lg font-bold text-slate-700 mb-1">Manufacturing: {activeBuild.name}</h2>
                    <div className="text-slate-500 text-xs mb-4">Node ID: #8X-2991</div>

                    {/* Timeline */}
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-300 ml-1">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#e0e5ec]"></div>
                            <div className="text-xs font-bold text-slate-700">Order Received</div>
                            <div className="text-[10px] text-slate-400">10:04 AM</div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#e0e5ec] animate-ping"></div>
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#e0e5ec]"></div>
                            <div className="text-xs font-bold text-blue-600">Pick & Place (In Progress)</div>
                            <div className="text-[10px] text-slate-400">Processing...</div>
                        </div>
                        <div className="relative opacity-50">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-400 rounded-full border-2 border-[#e0e5ec]"></div>
                            <div className="text-xs font-bold text-slate-700">Reflow Soldering</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#e0e5ec] rounded-2xl p-10 shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] flex flex-col items-center justify-center text-center">
                    <div className="text-4xl mb-4 opacity-30">🏭</div>
                    <div className="text-slate-500 font-bold mb-2">No Active Builds</div>
                    <div className="text-slate-400 text-xs">Generate a design in the Lab to start manufacturing.</div>
                </div>
            )}
        </div>
    );
};

export default DePINView;
