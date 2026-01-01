import React from 'react';

const MarketView: React.FC = () => {
    const listings = [
        { id: 1, name: "Solar Harvester V1", price: "240 BUILD", author: "@dev_one" },
        { id: 2, name: "LoRa Mesh Node", price: "450 BUILD", author: "@net_runner" },
        { id: 3, name: "Haptic Glove PCB", price: "1200 BUILD", author: "@vr_lab" },
    ];

    return (
        <div className="h-full w-full p-6 flex flex-col gap-6 overflow-y-auto pb-24">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-slate-700 tracking-tight">Marketplace 💎</h1>
                <div className="text-[#0038DF] font-bold bg-blue-100 px-3 py-1 rounded-full text-xs shadow-sm">
                    1,250 $BUILD
                </div>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-r from-[#0038DF] to-cyan-500 rounded-2xl p-6 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-white">
                <h2 className="font-black text-lg mb-1">Publish Your Design</h2>
                <p className="text-blue-100 text-xs mb-4">Earn royalties on every manufacture.</p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold transition-all">
                    Start Verification
                </button>
            </div>

            {/* Listings */}
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide mt-2">Latest Hardware</h3>
            <div className="grid grid-cols-1 gap-4">
                {listings.map((item) => (
                    <div key={item.id} className="bg-[#e0e5ec] rounded-xl p-4 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] flex justify-between items-center cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-300 rounded-lg shadow-[inset_2px_2px_4px_#a3b1c6,inset_-2px_-2px_4px_#ffffff]"></div>
                            <div>
                                <div className="font-bold text-slate-700">{item.name}</div>
                                <div className="text-xs text-slate-400">{item.author}</div>
                            </div>
                        </div>
                        <div className="text-[#0038DF] font-mono font-bold text-sm">
                            {item.price}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketView;
