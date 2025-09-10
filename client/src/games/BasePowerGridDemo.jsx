import React, { useState, useEffect, useRef } from 'react';
import { Zap, Power, FlaskConical, Radio, Wrench, Eye, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// --- HELPER COMPONENTS ---

const PowerGauge = ({ usage, max, safe, status }) => {
    const percentage = Math.min((usage / max) * 100, 100);
    const circumference = 2 * Math.PI * 60; // 2 * pi * radius
    const offset = circumference - (percentage / 100) * circumference;

    let color = "text-green-400";
    if (status === 'warning') color = "text-yellow-400";
    if (status === 'critical') color = "text-red-500";

    return (
        <div className="relative w-48 h-48 flex flex-col items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="60" cx="70" cy="70" />
                <circle
                    className={`transition-all duration-500 ${color}`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="60"
                    cx="70"
                    cy="70"
                />
            </svg>
            <div className={`text-4xl font-mono font-bold transition-colors duration-500 ${color}`}>{usage}</div>
            <div className="text-sm text-gray-400">MW / {max} MW</div>
            {status === 'critical' && <div className="absolute text-sm font-bold text-red-500 animate-pulse">OVERLOAD</div>}
        </div>
    );
};

const SystemModule = ({ system, onToggle, onHover, isActive }) => {
    const isLocked = system.isEssential;
    let borderColor = isActive ? "border-cyan-500/50" : "border-gray-600/50";
    if (isLocked) borderColor = "border-red-500/50";

    return (
        <div 
            className={`relative rounded-lg p-4 backdrop-blur-sm transition-all duration-300 border-2 ${borderColor} ${isActive ? 'bg-black/40' : 'bg-black/60'} ${!isLocked && 'hover:border-cyan-400 cursor-pointer'}`}
            style={{ gridArea: system.id }}
            onClick={() => !isLocked && onToggle(system.id)}
            onMouseEnter={() => onHover(system)}
            onMouseLeave={() => onHover(null)}
        >
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full transition-colors duration-300 ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
            <div className="flex flex-col items-center justify-center h-full">
                {React.cloneElement(system.icon, { className: `w-8 h-8 transition-colors duration-300 ${isActive ? system.color : 'text-gray-500'}` })}
                <span className={`mt-2 text-xs font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{system.name}</span>
            </div>
        </div>
    );
};

// --- MAIN DEMO COMPONENT ---

const BasePowerGridDemo = ({ node }) => {
    const handleGameComplete = useGameOutcomeHandler(node);
    const outcomes = node?.data?.options || [];

    const [systems, setSystems] = useState([
        { id: 'life_support', name: 'Life Support', power: 15, isEssential: true, isActive: true, icon: <ShieldCheck />, color: 'text-red-400', description: "Maintains breathable air, temperature, and pressure. Critical for crew survival. Cannot be disabled." },
        { id: 'research_wing', name: 'Research Wing', power: 8, isEssential: false, isActive: true, icon: <FlaskConical />, color: 'text-purple-400', description: "Houses scientific experiments and sample analysis equipment. Pauses all ongoing research if disabled." },
        { id: 'communications', name: 'Comms Array', power: 6, isEssential: false, isActive: true, icon: <Radio />, color: 'text-blue-400', description: "Long-range antenna for Earth communication. Disabling will cut off external data links." },
        { id: 'hangar_bay', name: 'Hangar Bay', power: 12, isEssential: false, isActive: true, icon: <Wrench />, color: 'text-orange-400', description: "Rover maintenance and storage facility. Disabling halts all vehicle diagnostics and preparation." },
        { id: 'external_sensors', name: 'Sensor Array', power: 4, isEssential: false, isActive: true, icon: <Eye />, color: 'text-cyan-400', description: "External weather and radiation sensors. Provides early warnings. Disabling limits storm tracking." },
    ]);

    const [gameStatus, setGameStatus] = useState('active');
    const [hoveredSystem, setHoveredSystem] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    const MAX_POWER = 45;
    const SAFE_THRESHOLD = 20;

    const currentPowerUsage = systems.reduce((total, s) => total + (s.isActive ? s.power : 0), 0);
    const powerStatus = currentPowerUsage <= SAFE_THRESHOLD ? 'safe' : (currentPowerUsage <= MAX_POWER ? 'warning' : 'critical');

    const toggleSystem = (systemId) => {
        if (gameStatus !== 'active') return;
        
        const system = systems.find(s => s.id === systemId);
        if (system?.isEssential) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 2000);
            return;
        }
        
        setSystems(prev => prev.map(s => s.id === systemId ? { ...s, isActive: !s.isActive } : s));
    };

    useEffect(() => {
        if (powerStatus === 'safe' && gameStatus === 'active') {
            setGameStatus('success');
            setTimeout(() => {
                const outcome = outcomes.find(o => o.text?.toLowerCase().includes('success')) || outcomes[0] || { id: 'success' };
                handleGameComplete(outcome);
            }, 2000);
        }
    }, [powerStatus, gameStatus, outcomes, handleGameComplete]);
    
    // Add CSS grid styles dynamically
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .schematic-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr 1fr;
                gap: 1rem;
                grid-template-areas:
                    "research_wing . communications"
                    ". life_support ."
                    "hangar_bay . external_sensors";
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto h-[700px] bg-black rounded-lg flex flex-col items-center justify-between text-white font-sans select-none overflow-hidden relative p-8">
            <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_95%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
            
            <header className="text-center z-20">
                <h3 className="text-3xl font-bold text-cyan-300 flex items-center justify-center gap-3 tracking-widest"><Power /> ARES-X POWER GRID</h3>
                <p className="text-sm text-yellow-400 mt-2 font-semibold flex items-center justify-center gap-2"><AlertTriangle size={16}/> INCOMING STORM: REDUCE POWER CONSUMPTION TO SAFE LEVELS</p>
            </header>

            {/* Warning Message */}
            {showWarning && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-900/50 border border-red-600 rounded-lg p-3 animate-pulse z-30">
                    <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={20} />
                        <span className="font-bold">CRITICAL SYSTEM: Life Support cannot be disabled!</span>
                    </div>
                </div>
            )}

            <main className="w-full flex items-center justify-center gap-8 z-20">
                <div className="w-[300px] h-[300px] flex flex-col items-center justify-center bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-lg text-cyan-300 mb-2">SYSTEM READOUT</h4>
                    {hoveredSystem ? (
                        <div className="text-center">
                            <h5 className="font-bold text-xl text-white">{hoveredSystem.name}</h5>
                            <p className="text-sm text-gray-300 mt-2 h-20">{hoveredSystem.description}</p>
                            <div className="mt-4 text-2xl font-mono font-bold">{hoveredSystem.power} MW</div>
                            <div className="text-xs text-gray-400">POWER DRAW</div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 h-full flex flex-col justify-center">
                            <Eye size={40} className="mx-auto"/>
                            <p className="mt-2 text-sm">Hover over a module for details.</p>
                        </div>
                    )}
                </div>

                <div className="w-[400px] h-[400px] schematic-grid">
                    {systems.map(sys => <SystemModule key={sys.id} system={sys} onToggle={toggleSystem} onHover={setHoveredSystem} isActive={sys.isActive} />)}
                </div>
            </main>

            <footer className="w-full max-w-2xl h-28 bg-black/50 rounded-lg border border-cyan-400/20 p-4 z-20 flex items-center justify-around text-center">
                <div>
                    <h4 className="font-bold text-lg text-cyan-300">RTG POWER CORE</h4>
                    <p className="text-xs text-gray-400">Total Consumption</p>
                </div>
                <PowerGauge usage={currentPowerUsage} max={MAX_POWER} safe={SAFE_THRESHOLD} status={powerStatus} />
                <div className="w-48">
                    {gameStatus === 'success' ? (
                        <div className="text-green-400 font-bold flex flex-col items-center gap-1">
                            <CheckCircle size={32} />
                            <span>GRID STABLE</span>
                        </div>
                    ) : (
                         <div className={`font-bold flex flex-col items-center gap-1 ${powerStatus === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                            <AlertTriangle size={32} className="animate-pulse" />
                            <span>
                                {powerStatus === 'safe' ? 'SAFE' : 'OVERLOAD'}
                            </span>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default BasePowerGridDemo;
