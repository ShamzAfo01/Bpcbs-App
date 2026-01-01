import React from 'react';
import Dashboard from './Dashboard';

interface QuestsViewProps {
    questStates: { solved: boolean }[];
    onStartQuest: (id: number) => void;
}

const QuestsView: React.FC<QuestsViewProps> = ({ questStates, onStartQuest }) => {
    return (
        <div className="h-full w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-2 shrink-0 z-10">
                <h1 className="text-2xl font-black text-slate-700 tracking-tight">Active Scenarios 🚩</h1>
                <p className="text-slate-500 text-xs font-bold">Field Ops // Sector 4</p>
            </div>

            {/* Wrap Existing Dashboard Logic */}
            {/* We override some styles to fit the new layout if needed, but Dashboard.tsx manages its own grid/scroll */}
            <div className="flex-1 overflow-hidden relative">
                <Dashboard
                    questStates={questStates}
                    onStartQuest={onStartQuest}
                />
            </div>
        </div>
    );
};

export default QuestsView;
