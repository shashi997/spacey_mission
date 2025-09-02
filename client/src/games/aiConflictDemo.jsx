import React, { useState, useEffect, useCallback } from 'react';

/**
 * AI Conflict Resolution Demo
 * @param {object} props
 * @param {string} props.prompt - The instructional text to display.
 * @param {object} props.config - Configuration object, e.g., { balancedNode: 'path-a', logicNode: 'path-b', empathyNode: 'path-c' }.
 * @param {function} props.onComplete - Callback function to proceed to the next lesson node.
 */
const AIConflictDemo = ({ prompt, config, onComplete }) => {
    const [logicValue, setLogicValue] = useState(50);
    const [empathyValue, setEmpathyValue] = useState(50);
    const [outcome, setOutcome] = useState("Awaiting directive...");

    const analyzeOutcome = useCallback(() => {
        if (logicValue > 80 && empathyValue < 20) {
            setOutcome("Decision: Purely logical. Efficient, but potentially unethical.");
        } else if (empathyValue > 80 && logicValue < 20) {
            setOutcome("Decision: Purely empathetic. Fosters morale, but may compromise objectives.");
        } else if (Math.abs(logicValue - empathyValue) < 15) {
            setOutcome("Decision: Balanced. A sustainable compromise.");
        } else if (logicValue > empathyValue) {
             setOutcome("Decision: Leans logical. Prioritizes mission goals.");
        } else {
             setOutcome("Decision: Leans empathetic. Prioritizes crew well-being.");
        }
    }, [logicValue, empathyValue]);

    useEffect(() => {
       const handler = setTimeout(() => analyzeOutcome(), 300);
       return () => clearTimeout(handler);
    }, [logicValue, empathyValue, analyzeOutcome]);

    const handleFinalize = () => {
        let nextNodeId = config.balancedNode; // Default
        if (logicValue > 80 && empathyValue < 20) {
            nextNodeId = config.logicNode;
        } else if (empathyValue > 80 && logicValue < 20) {
            nextNodeId = config.empathyNode;
        }
        onComplete(nextNodeId);
    };

    return (
        <div className="p-6 bg-slate-800 rounded-lg text-white font-sans flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2 text-center">AI Conflict Resolution</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">{prompt || "Set the directives for the ship's AI to resolve a crew dispute."}</p>
            
            <div className="w-full max-w-lg space-y-8">
                <div>
                    <label className="text-lg font-semibold text-blue-300">Directive A: Pure Logic ({logicValue}%)</label>
                    <p className="text-xs text-slate-400 mb-2">Prioritize mission efficiency and resource preservation.</p>
                    <input type="range" min="0" max="100" value={logicValue} onChange={(e) => setLogicValue(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                    <label className="text-lg font-semibold text-green-300">Directive B: Empathetic Reasoning ({empathyValue}%)</label>
                    <p className="text-xs text-slate-400 mb-2">Prioritize crew morale and psychological well-being.</p>
                     <input type="range" min="0" max="100" value={empathyValue} onChange={(e) => setEmpathyValue(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                </div>
            </div>

            <div className="mt-8 text-center bg-slate-900/50 p-4 rounded-lg w-full max-w-lg">
                <p className="font-semibold text-cyan-300">Predicted Outcome:</p>
                <p className="text-slate-200">{outcome}</p>
            </div>
            
            <button onClick={handleFinalize} className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                Finalize Directive
            </button>
        </div>
    );
};

export default AIConflictDemo;
