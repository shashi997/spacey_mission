import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- SVG ICONS ---
const RefreshCwIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-refresh-cw ${className}`}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M20.49 9A9 9 0 0 0 12 3c-2.61 0-4.96.97-6.73 2.59L3.27 7.59"></path><path d="M3.51 15A9 9 0 0 0 12 21c2.61 0-4.96-.97-6.73-2.59l2.02-2.02"></path></svg>
);

/**
 * Circuit Repair Demo
 * @param {object} props
 * @param {string} props.prompt - The instructional text to display.
 * @param {object} props.config - Configuration object, e.g., { successNode: 'next-on-win' }.
 * @param {function} props.onComplete - Callback function to proceed to the next lesson node.
 */
const CircuitRepairDemo = ({ prompt, config, onComplete }) => {
    const initialGrid = useMemo(() => [
        ['start', 'h', 'h', 'bend-bl'],
        ['empty', 'empty', 'empty', 'v'],
        ['bend-tr', 'h', 'bend-bl', 'v'],
        ['v', 'empty', 'v', 'end'],
        ['bend-tr', 'h', 'bend-br', 'empty']
    ], []);

    const [tiles, setTiles] = useState(
        initialGrid.flat().map((type, i) => ({
            id: i,
            type,
            rotation: (type !== 'start' && type !== 'end' && type !== 'empty') ? Math.floor(Math.random() * 4) * 90 : 0,
        }))
    );
    const [isComplete, setIsComplete] = useState(false);

    const rotateTile = (id) => {
        if (isComplete) return;
        setTiles(prevTiles =>
            prevTiles.map(tile =>
                tile.id === id && tile.type !== 'start' && tile.type !== 'end'
                    ? { ...tile, rotation: (tile.rotation + 90) % 360 }
                    : tile
            )
        );
    };

    const resetDemo = () => {
        setTiles(initialGrid.flat().map((type, i) => ({
            id: i,
            type,
            rotation: (type !== 'start' && type !== 'end' && type !== 'empty') ? Math.floor(Math.random() * 4) * 90 : 0,
        })));
        setIsComplete(false);
    }
    
    const checkCompletion = useCallback(() => {
        const solution = tiles.every(tile => tile.rotation === 0);
        if (solution && !isComplete) {
            setIsComplete(true);
            setTimeout(() => onComplete(config.successNode), 1500);
        }
    }, [tiles, isComplete, onComplete, config]);

    useEffect(() => {
        checkCompletion();
    }, [tiles, checkCompletion]);

    const getTileComponent = (type, rotation) => {
        const style = { transform: `rotate(${rotation}deg)` };
        const pathClass = isComplete ? "bg-yellow-400 border-yellow-400" : "bg-cyan-400 border-cyan-400";

        switch(type) {
            case 'start': return <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold">IN</div>;
            case 'end': return <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center text-white font-bold">OUT</div>;
            case 'h': return <div className="w-full h-full flex items-center justify-center transition-transform duration-200" style={style}><div className={`w-full h-1/4 ${pathClass}`}></div></div>;
            case 'v': return <div className="w-full h-full flex items-center justify-center transition-transform duration-200" style={style}><div className={`w-1/4 h-full ${pathClass}`}></div></div>;
            case 'bend-bl': return <div className="w-full h-full relative transition-transform duration-200" style={style}><div className={`absolute bottom-0 left-0 w-1/2 h-1/2 border-b-8 border-l-8 ${pathClass} rounded-bl-lg`}></div></div>;
            case 'bend-tr': return <div className="w-full h-full relative transition-transform duration-200" style={style}><div className={`absolute top-0 right-0 w-1/2 h-1/2 border-t-8 border-r-8 ${pathClass} rounded-tr-lg`}></div></div>;
            case 'bend-br': return <div className="w-full h-full relative transition-transform duration-200" style={style}><div className={`absolute bottom-0 right-0 w-1/2 h-1/2 border-b-8 border-r-8 ${pathClass} rounded-br-lg`}></div></div>;
            default: return null;
        }
    }

    return (
        <div className="p-6 bg-slate-800 rounded-lg text-white font-sans flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-bold mb-2 text-center">Circuit Repair</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">{prompt || "Rotate the tiles to connect the power source (IN) to the output (OUT)."}</p>
            
            <div className="grid grid-cols-4 gap-2 p-4 bg-slate-900/50 rounded-lg">
                {tiles.map(tile => (
                    <div
                        key={tile.id}
                        className="w-16 h-16 md:w-20 md:h-20 bg-slate-700 rounded-md cursor-pointer flex items-center justify-center overflow-hidden"
                        onClick={() => rotateTile(tile.id)}
                    >
                       {getTileComponent(tile.type, tile.rotation)}
                    </div>
                ))}
            </div>

            {isComplete && <p className="mt-6 text-2xl font-bold text-green-400 animate-pulse">Circuit Complete!</p>}

            <button onClick={resetDemo} className="mt-6 flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                <RefreshCwIcon className="w-5 h-5" />
                Reset Board
            </button>
        </div>
    );
};

export default CircuitRepairDemo;
