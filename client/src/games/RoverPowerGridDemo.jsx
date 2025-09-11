import React, { useState, useEffect, useRef } from 'react';
import { Battery, CheckCircle, XCircle, Zap, RefreshCw, Cpu, Wifi, Map, HeartPulse, MousePointerClick } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';


// --- HELPER COMPONENTS ---


const PowerCore = ({ connections, onClick, isConnecting }) => {
    const remaining = 2 - connections.length;
    let stateClass = "bg-orange-500/20 border-orange-500/50 hover:border-orange-400/80 hover:scale-105 animate-pulse";
    if (isConnecting) {
        stateClass = "bg-yellow-500/20 border-yellow-500/50 scale-110 shadow-[0_0_25px_rgba(234,179,8,0.7)]";
    }


    return (
        <div 
            onClick={onClick}
            className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 text-white shadow-lg border-2 backdrop-blur-sm ${remaining > 0 ? 'cursor-pointer' : 'cursor-not-allowed'} ${stateClass}`}
        >
            <Battery size={48} />
            <span className="text-sm font-bold tracking-wider mt-1">RTG CORE</span>
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="relative inline-flex rounded-full h-6 w-6 bg-cyan-400 items-center justify-center font-bold">{remaining}</span>
            </span>
        </div>
    );
};


const SystemNode = ({ system, isConnected, isTarget, onClick, nodeRef }) => {
    const isSelectable = !isConnected;
    const baseClasses = "relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 text-white shadow-lg border-2 backdrop-blur-sm";
    
    let stateClass = "bg-black/20 border-gray-500/50 opacity-60 cursor-not-allowed";
    if (isConnected) {
        stateClass = "bg-green-500/20 border-green-500/50";
    } else if (isTarget) {
        stateClass = "bg-yellow-500/20 border-yellow-500/50 scale-110 animate-pulse cursor-pointer";
    } else if (isSelectable) {
        stateClass = "bg-cyan-500/20 border-cyan-500/50 cursor-default";
    }


    return (
        <div 
            ref={nodeRef} 
            className={`absolute ${system.position} flex flex-col items-center gap-3 group`}
            onClick={onClick}
        >
            <div className={`${baseClasses} ${stateClass}`}>
                {system.icon}
                {isConnected && <CheckCircle size={32} className="absolute z-10 text-green-400" />}
            </div>
            <span className={`text-sm text-center font-bold tracking-wider transition-colors duration-300 ${isConnected ? 'text-green-300' : 'text-cyan-300'}`}>{system.name}</span>
        </div>
    );
};


// --- MAIN DEMO COMPONENT ---


const RoverPowerGridDemo = ({ node }) => {
    const handleGameComplete = useGameOutcomeHandler(node);
    const outcomes = node?.data?.options || [];


    const systems = [
        { id: 'core_computer', name: 'CORE COMPUTER', position: 'top-0 left-0', required: true, icon: <Cpu size={40} /> },
        { id: 'communications', name: 'COMMUNICATIONS', position: 'top-0 right-0', required: true, icon: <Wifi size={40} /> },
        { id: 'navigation', name: 'NAVIGATION', position: 'bottom-0 left-0', required: false, icon: <Map size={40} /> },
        { id: 'life_support', name: 'LIFE SUPPORT', position: 'bottom-0 right-0', required: false, icon: <HeartPulse size={40} /> },
    ];
    const maxConnections = 2;


    const [connections, setConnections] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, success, failure
    const [lines, setLines] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);


    const mainRef = useRef(null);
    const coreRef = useRef(null);
    const systemRefs = useRef({});
    const nodePositions = useRef({});


    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
          .line-draw { stroke-dasharray: 1000; animation: drawLine 0.8s ease-out forwards; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    
    const calculateNodePositions = () => {
        if (!mainRef.current) return;
        const parentRect = mainRef.current.getBoundingClientRect();
        const positions = {};
        const getCenter = (el) => {
            if (!el) return { x: 0, y: 0 };
            const rect = el.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top + rect.height / 2,
            };
        };
        positions.core = getCenter(coreRef.current);
        systems.forEach(sys => {
            positions[sys.id] = getCenter(systemRefs.current[sys.id]);
        });
        nodePositions.current = positions;
    };


    useEffect(() => {
        calculateNodePositions();
        window.addEventListener('resize', calculateNodePositions);
        return () => window.removeEventListener('resize', calculateNodePositions);
    }, []);


    useEffect(() => {
        if (connections.length === maxConnections) {
            const hasCore = connections.includes('core_computer');
            const hasComms = connections.includes('communications');
            setStatus(hasCore && hasComms ? 'success' : 'failure');
        }
    }, [connections]);


    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                const outcome = outcomes.find(o => o.text?.toLowerCase().includes('success')) || outcomes[0] || { id: 'success' };
                handleGameComplete(outcome);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [status, outcomes, handleGameComplete]);


    const handleCoreClick = () => {
        if (status !== 'idle' || connections.length >= maxConnections) return;
        setIsConnecting(prev => !prev);
    };
    
    const handleSystemClick = (system) => {
        if (isConnecting && !connections.includes(system.id)) {
            const newConnections = [...connections, system.id];
            setConnections(newConnections);


            const coreCenter = nodePositions.current.core;
            const systemCenter = nodePositions.current[system.id];
            setLines(prev => [...prev, { id: system.id, from: coreCenter, to: systemCenter }]);
            
            setIsConnecting(false);
        }
    };


    const handleRetry = () => {
        setConnections([]);
        setStatus('idle');
        setLines([]);
    };


    const getStatusMessage = () => {
        if (status === 'success') return <div className="flex items-center gap-2 text-green-300 font-bold"><CheckCircle /> POWER GRID NOMINAL. CORE SYSTEMS ONLINE.</div>;
        if (status === 'failure') return <div className="flex items-center gap-2 text-red-400 font-bold"><XCircle /> CRITICAL POWER FAILURE. WRONG SYSTEMS CONNECTED.</div>;
        if (isConnecting) return <div className="text-yellow-400 flex items-center gap-2 animate-pulse"><MousePointerClick/> SELECT A SYSTEM NODE TO CONNECT.</div>;
        return <div className="text-cyan-300">CLICK THE RTG CORE TO INITIATE POWER CONNECTION.</div>;
    };


    return (
        <div className="w-full max-w-4xl mx-auto h-full bg-black rounded-lg flex flex-col items-center justify-center text-white font-sans select-none overflow-hidden relative p-8 gap-8">
            <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%,white_95%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900 z-10"></div>
            
            <header className="text-center z-20">
                <h3 className="text-3xl font-bold text-cyan-300 flex items-center justify-center gap-3 tracking-widest"><Zap /> CURIOSITY II POWER GRID</h3>
                <p className="text-sm text-yellow-400 mt-2 font-semibold">Mission Critical: Connect Core Computer & Communications.</p>
            </header>


            <main ref={mainRef} className="relative w-[500px] h-[500px] z-20">
                <svg className="absolute w-full h-full pointer-events-none" fill="none">
                    {lines.map(line => (
                        <g key={line.id}>
                            <path d={`M ${line.from.x} ${line.from.y} L ${line.to.x} ${line.to.y}`} stroke={status === 'failure' ? '#b91c1c' : '#047857'} strokeWidth="10" strokeLinecap="round" />
                            <path d={`M ${line.from.x} ${line.from.y} L ${line.to.x} ${line.to.y}`} stroke={status === 'failure' ? '#ef4444' : '#22c55e'} strokeWidth="4" strokeLinecap="round" className="line-draw" />
                        </g>
                    ))}
                </svg>
                
                <div ref={coreRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <PowerCore connections={connections} onClick={handleCoreClick} isConnecting={isConnecting}/>
                </div>


                {systems.map(sys => (
                    <SystemNode 
                        key={sys.id}
                        nodeRef={el => systemRefs.current[sys.id] = el}
                        system={sys} 
                        isConnected={connections.includes(sys.id)}
                        isTarget={isConnecting && !connections.includes(sys.id)}
                        onClick={() => handleSystemClick(sys)}
                    />
                ))}
            </main>


            <footer className="w-full max-w-2xl h-20 bg-black/50 rounded-lg border border-cyan-400/20 p-4 font-mono text-sm backdrop-blur-sm z-20 flex items-center justify-center text-center">
                {getStatusMessage()}
                {status === 'failure' && (
                     <button onClick={handleRetry} className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                        <RefreshCw size={16} /> RESET GRID
                    </button>
                )}
            </footer>
        </div>
    );
};

export default RoverPowerGridDemo;
