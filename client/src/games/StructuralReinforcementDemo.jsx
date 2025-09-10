import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, Target, Timer, Scan } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// --- HELPER COMPONENTS ---

const StatusBar = ({ label, value, max, icon, colorClass }) => (
    <div className="bg-black/50 rounded-lg p-3 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
            <span className="text-sm font-bold flex items-center gap-1.5">{icon} {label}</span>
            <span className={`text-lg font-mono font-bold ${colorClass}`}>{value}{label !== 'Time Remaining' && '%'}{label === 'Time Remaining' && 's'}</span>
        </div>
        <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${(value / max) * 100}%` }} />
        </div>
    </div>
);

const WeakPoint = ({ point, isReinforced, onClick }) => {
    const isCritical = point.severity === 'critical';
    let stateClasses = '';
    if (isReinforced) {
        stateClasses = 'bg-green-500/30 border-green-400';
    } else if (isCritical) {
        stateClasses = 'bg-red-500/30 border-red-400 animate-pulse cursor-pointer hover:scale-110';
    } else {
        stateClasses = 'bg-yellow-500/30 border-yellow-400 cursor-pointer hover:scale-110';
    }

    return (
        <button
            onClick={onClick}
            disabled={isReinforced}
            className={`absolute w-8 h-8 rounded-full border-2 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${stateClasses}`}
            style={{ left: `${point.x}%`, top: `${point.y}%`, animationDuration: isCritical ? '1s' : '2s' }}
        >
            {isReinforced ? (
                 <div className="relative w-full h-full animate-clamp">
                    <div className="clamp-arm absolute top-1/2 left-0 w-2 h-0.5 bg-green-300 -translate-y-1/2"></div>
                    <div className="clamp-arm absolute top-1/2 right-0 w-2 h-0.5 bg-green-300 -translate-y-1/2"></div>
                    <div className="clamp-arm absolute top-0 left-1/2 h-2 w-0.5 bg-green-300 -translate-x-1/2"></div>
                    <div className="clamp-arm absolute bottom-0 left-1/2 h-2 w-0.5 bg-green-300 -translate-x-1/2"></div>
                    <CheckCircle size={16} className="text-green-300 z-10 clamp-check" />
                </div>
            ) : isCritical ? (
                <AlertTriangle size={16} className="text-red-300" />
            ) : (
                <Target size={16} className="text-yellow-300" />
            )}
        </button>
    );
};

const StructuralReinforcementDemo = ({ node }) => {
    const handleGameComplete = useGameOutcomeHandler(node);
    const outcomes = node?.data?.options || [];

    const [gameStatus, setGameStatus] = useState('booting'); // booting, scanning, reinforcing, success, failed
    const [integrity, setIntegrity] = useState(100);
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [weakPoints, setWeakPoints] = useState([]);
    const [reinforcedPoints, setReinforcedPoints] = useState([]);
    const [log, setLog] = useState([]);
    const [scannerPos, setScannerPos] = useState({ x: -200, y: -200 });

    const schematicRef = useRef(null);
    const gameLoopRef = useRef(null);
    const totalCritical = weakPoints.filter(p => p.severity === 'critical').length;
    const reinforcedCriticalCount = reinforcedPoints.filter(id => weakPoints.find(p => p.id === id)?.severity === 'critical').length;

    const addLog = (message, type = 'info') => setLog(prev => [...prev.slice(-5), { message, type, time: new Date().toLocaleTimeString() }]);

    // Game initialization and dynamic styles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes storm-interference {
                0% { opacity: 0.05; }
                50% { opacity: 0.15; }
                100% { opacity: 0.05; }
            }
            .storm-bg::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJ0dXJidWxlbmNlIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuMDIgMC4wMiIgbnVtT2N0YXZlcz0iMyIgc2VlZD0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIj48L2ZlVHVyYnVsZW5jZT48ZmVTaW5lIGlkPSJzaW5lIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiB0eXBlPSJmcmFjdGFsTm9pc2UiPjwvZmVTaW5lPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjdHVyYnVsZW5jZSkgCIgb3BhY2l0eT0iMC4yNSI+PC9yZWN0Pjwvc3ZnPg==');
                animation: storm-interference 5s linear infinite;
                pointer-events: none;
            }
            @keyframes clamp-anim {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            .clamp-check { animation: clamp-anim 0.5s ease-out; }
            .clamp-arm { transform-origin: center; animation: clamp-anim 0.5s ease-out; }
        `;
        document.head.appendChild(style);

        addLog('Booting structural scanner...');
        const points = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
            severity: Math.random() > 0.65 ? 'critical' : 'moderate',
            isRevealed: false
        }));
        setWeakPoints(points);
        setTimeout(() => {
            setGameStatus('scanning');
            addLog('Scanner active. Sweep schematic to detect weak points.');
        }, 2000);

        return () => document.head.removeChild(style);
    }, []);
    
    // Game loop for timer and integrity decay
    useEffect(() => {
        if (gameStatus !== 'reinforcing') {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            return;
        }
        
        gameLoopRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setGameStatus('failed');
                    addLog('Time limit reached. Catastrophic failure imminent.', 'error');
                    return 0;
                }
                if (prev <= 10 && prev > 9) addLog('TIMER CRITICAL', 'error');
                return prev - 1;
            });

            const unreinforcedCritical = weakPoints.filter(p => p.isRevealed && p.severity === 'critical' && !reinforcedPoints.includes(p.id));
            if (unreinforcedCritical.length > 0) {
                setIntegrity(prev => {
                    const newIntegrity = Math.max(0, prev - (unreinforcedCritical.length * 0.75));
                    if (newIntegrity <= 0) setGameStatus('failed');
                    if (prev > 70 && newIntegrity <= 70) addLog('Hull integrity dropping to warning levels.', 'warn');
                    if (prev > 30 && newIntegrity <= 30) addLog('HULL INTEGRITY CRITICAL', 'error');
                    return newIntegrity;
                });
            }
        }, 1000);

        return () => clearInterval(gameLoopRef.current);
    }, [gameStatus, weakPoints, reinforcedPoints]);

    // Win/Loss condition handling
    useEffect(() => {
        if (gameStatus === 'reinforcing' && totalCritical > 0 && reinforcedCriticalCount === totalCritical) {
            setGameStatus('success');
            addLog('All critical points reinforced! Structural integrity stabilized.', 'success');
        }
        if (gameStatus === 'success' || gameStatus === 'failed') {
            setTimeout(() => {
                const outcome = outcomes.find(o => o.text?.toLowerCase().includes(gameStatus)) || outcomes[0];
                handleGameComplete(outcome);
            }, 3000);
        }
    }, [gameStatus, reinforcedCriticalCount, totalCritical]);

    const handleMouseMove = (e) => {
        if (gameStatus !== 'scanning' || !schematicRef.current) return;
        const rect = schematicRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setScannerPos({ x, y });

        const newlyRevealed = [];
        const updatedPoints = weakPoints.map(p => {
            const pointX = (p.x / 100) * rect.width;
            const pointY = (p.y / 100) * rect.height;
            const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
            if (distance < 50 && !p.isRevealed) {
                newlyRevealed.push(p);
                return { ...p, isRevealed: true };
            }
            return p;
        });
        
        if (newlyRevealed.length > 0) {
            setWeakPoints(updatedPoints);
            const criticals = newlyRevealed.filter(p => p.severity === 'critical').length;
            if (criticals > 0) addLog(`CRITICAL stress point(s) detected!`, 'warn');
        }

        if (updatedPoints.every(p => p.isRevealed)) {
            setGameStatus('reinforcing');
            addLog('Scan complete. Prioritize critical reinforcements!', 'system');
        }
    };

    const handleReinforce = (pointId) => {
        if (gameStatus !== 'reinforcing' || reinforcedPoints.includes(pointId)) return;
        setReinforcedPoints(prev => [...prev, pointId]);
        addLog(`Magnetic clamp deployed at point ${pointId}.`, 'success');
        setIntegrity(prev => Math.min(100, prev + 2));
    };

    return (
        <div className="w-full max-w-5xl mx-auto h-[750px] bg-black rounded-lg flex flex-col items-center justify-between text-white font-sans select-none overflow-hidden relative p-8">
            <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
            
            <header className="text-center z-20">
                <h3 className="text-3xl font-bold text-cyan-300 flex items-center justify-center gap-3 tracking-widest"><Shield /> STRUCTURAL INTEGRITY ANALYSIS</h3>
                <p className="text-sm text-yellow-400 mt-2 font-semibold flex items-center gap-2"><AlertTriangle size={16}/> WARNING: HULL STRESS DETECTED. REINFORCE CRITICAL WEAK POINTS.</p>
            </header>

            <main className="w-full flex-1 grid grid-cols-3 gap-6 z-20 mt-4">
                <div className="flex flex-col gap-4">
                    <StatusBar label="Structural Integrity" value={Math.round(integrity)} max={100} icon={<Shield size={16}/>} colorClass={integrity > 70 ? 'text-green-400' : integrity > 30 ? 'text-yellow-400' : 'text-red-500'}/>
                    <StatusBar label="Time Remaining" value={timeRemaining} max={30} icon={<Timer size={16}/>} colorClass={timeRemaining > 10 ? 'text-cyan-400' : 'text-red-500'}/>
                    <div className="bg-black/50 rounded-lg p-3 h-full flex flex-col justify-center">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold flex items-center gap-1.5"><AlertTriangle size={16}/> Critical Points</span>
                            <span className="text-lg font-mono font-bold text-yellow-400">{reinforcedCriticalCount}/{totalCritical || '?'}</span>
                        </div>
                    </div>
                </div>

                <div 
                    ref={schematicRef}
                    className="col-span-2 relative bg-gray-900/50 rounded-lg border-2 border-cyan-500/30 overflow-hidden storm-bg"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setScannerPos({ x: -200, y: -200 })}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                        <path d="M 50 15 L 150 15 Q 180 50 150 85 L 50 85 Q 20 50 50 15 Z" fill="none" stroke="#0891b2" strokeOpacity="0.3" strokeWidth="1" />
                        <path d="M 60 25 L 140 25 M 60 75 L 140 75 M 100 15 V 85" stroke="#0891b2" strokeOpacity="0.1" strokeWidth="0.5" />
                    </svg>

                    {gameStatus === 'scanning' && <div className="absolute w-24 h-24 bg-cyan-400/20 rounded-full border-2 border-cyan-400 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" style={{ left: scannerPos.x, top: scannerPos.y }} />}

                    {weakPoints.map(p => p.isRevealed && <WeakPoint key={p.id} point={p} isReinforced={reinforcedPoints.includes(p.id)} onClick={() => handleReinforce(p.id)} />)}

                    {gameStatus === 'booting' && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-cyan-300 font-bold text-xl animate-pulse"><Scan size={48} className="mb-4"/>INITIALIZING SCANNER...</div>}
                    {gameStatus === 'success' && <div className="absolute inset-0 bg-green-900/80 flex flex-col items-center justify-center text-white font-bold text-2xl"><CheckCircle size={64} className="mb-4 text-green-400"/>STRUCTURE SECURED</div>}
                    {gameStatus === 'failed' && <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white font-bold text-2xl"><AlertTriangle size={64} className="mb-4 text-red-400"/>HULL FAILURE</div>}
                </div>
            </main>
            
            <footer className="w-full h-24 bg-black/50 rounded-lg border border-cyan-400/20 p-2 font-mono text-xs backdrop-blur-sm z-20 mt-4 overflow-y-auto">
                {log.map((entry, i) => {
                    const color = { info: 'text-gray-400', warn: 'text-yellow-400', error: 'text-red-500', success: 'text-green-400', system: 'text-cyan-400'}[entry.type]
                    return <p key={i} className={`whitespace-nowrap ${color}`}><span className="text-gray-600 mr-2">{entry.time}</span>&gt; {entry.message}</p>
                })}
            </footer>
        </div>
    );
};

export default StructuralReinforcementDemo;
