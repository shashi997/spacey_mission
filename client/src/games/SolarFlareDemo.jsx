import React, { useState, useEffect, useMemo } from 'react';

// --- SVG ICONS ---
const RefreshCwIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-refresh-cw ${className}`}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M20.49 9A9 9 0 0 0 12 3c-2.61 0-4.96.97-6.73 2.59L3.27 7.59"></path><path d="M3.51 15A9 9 0 0 0 12 21c2.61 0-4.96-.97-6.73-2.59l2.02-2.02"></path></svg>
);

/**
 * Solar Flare Defense Demo
 * @param {object} props
 * @param {string} props.prompt - The instructional text to display.
 * @param {object} props.config - Configuration object, e.g., { successNode: 'next-on-win', failureNode: 'next-on-loss' }.
 * @param {function} props.onComplete - Callback function to proceed to the next lesson node, e.g., onComplete('next-node-id').
 */
const SolarFlareDemo = ({ prompt, config, onComplete }) => {
    const [shieldLevel, setShieldLevel] = useState(50);
    const [flareIntensity, setFlareIntensity] = useState(0);
    const [systemStatus, setSystemStatus] = useState('Nominal');
    const [gameOver, setGameOver] = useState(false);
    const [survivalTime, setSurvivalTime] = useState(0);

    const resetDemo = () => {
        setShieldLevel(50);
        setFlareIntensity(0);
        setSystemStatus('Nominal');
        setGameOver(false);
        setSurvivalTime(0);
    };

    // Game loop for flare intensity and survival timer
    useEffect(() => {
        if (gameOver) return;
        const gameInterval = setInterval(() => {
            setFlareIntensity(prev => Math.min(prev + Math.random() * 7, 100));
            setSurvivalTime(prev => prev + 0.5);
        }, 500);

        return () => clearInterval(gameInterval);
    }, [gameOver]);

    // Check for win/loss conditions
    useEffect(() => {
        if (gameOver) return;

        // Loss condition
        if (flareIntensity > shieldLevel + 10) {
            setSystemStatus('CRITICAL FAILURE');
            setGameOver(true);
            setTimeout(() => onComplete(config.failureNode), 1500); // Proceed after a delay
        } 
        // Win condition
        else if (survivalTime >= 20) {
            setSystemStatus('SYSTEM STABLE. FLARE PASSED.');
            setGameOver(true);
            setTimeout(() => onComplete(config.successNode), 1500); // Proceed after a delay
        }
        else if (flareIntensity > shieldLevel) {
            setSystemStatus('Warning: Shield Integrity Compromised');
        } else {
            setSystemStatus('Nominal');
        }
    }, [flareIntensity, shieldLevel, survivalTime, gameOver, onComplete, config]);

    const statusColor = useMemo(() => {
        if (systemStatus.includes('CRITICAL')) return 'text-red-400';
        if (systemStatus.includes('STABLE')) return 'text-green-400';
        if (systemStatus.includes('Warning')) return 'text-yellow-400';
        return 'text-green-400';
    }, [systemStatus]);

    return (
        <div className="p-6 bg-slate-800 rounded-lg text-white font-sans flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2 text-center">Solar Flare Defense</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">{prompt || "Adjust shield power to counteract the incoming solar flare."}</p>
            
            <div className="w-full max-w-md space-y-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-slate-300">Flare Intensity</label>
                    <div className="w-full bg-slate-700 rounded-full h-6"><div className="bg-red-500 h-6 rounded-full transition-all duration-300" style={{ width: `${flareIntensity}%` }}></div></div>
                </div>
                <div>
                    <label htmlFor="shield-slider" className="block mb-2 text-sm font-medium text-slate-300">Shield Power: {shieldLevel}%</label>
                    <input id="shield-slider" type="range" min="0" max="100" value={shieldLevel} onChange={(e) => setShieldLevel(parseInt(e.target.value))} disabled={gameOver} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-lg font-semibold">System Status:</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${statusColor}`}>{systemStatus}</p>
            </div>

            {gameOver && (
                <button onClick={resetDemo} className="mt-6 flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    <RefreshCwIcon className="w-5 h-5" />
                    Reset Simulation
                </button>
            )}
        </div>
    );
};

export default SolarFlareDemo;
