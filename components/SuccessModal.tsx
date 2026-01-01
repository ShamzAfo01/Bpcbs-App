import React from 'react';

const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-[#e0e5ec] w-[90%] max-w-sm rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                {/* Confetti Background (Simulated) */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] mb-6 animate-bounce">
                    <span className="text-4xl">🏆</span>
                </div>

                <h2 className="text-2xl font-black text-slate-700 mb-2">QUEST COMPLETE!</h2>
                <p className="text-slate-500 text-sm mb-6">You've successfully repaired the hardware node. A standardized NFT has been minted to your wallet.</p>

                <div className="bg-slate-200 rounded-xl p-4 w-full mb-6 shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff]">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Reward</div>
                    <div className="text-[#0038DF] font-black text-xl">Analog Skill +1</div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-[#0038DF] text-white font-bold py-4 rounded-xl shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:scale-[1.02] active:scale-95 transition-all"
                >
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
