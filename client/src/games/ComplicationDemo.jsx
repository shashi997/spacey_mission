import React, { useState, useEffect, useMemo } from 'react';

// --- SVG ICONS ---
const HeartIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const RefreshCwIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-refresh-cw ${className}`}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M20.49 9A9 9 0 0 0 12 3c-2.61 0-4.96.97-6.73 2.59L3.27 7.59"></path><path d="M3.51 15A9 9 0 0 0 12 21c2.61 0-4.96-.97-6.73-2.59l2.02-2.02"></path></svg>);

/**
 * Medical Complication Demo
 * @param {object} props
 * @param {string} props.prompt - The instructional text to display.
 * @param {object} props.config - Configuration object, e.g., { successNode: 'path-a', failureNode: 'path-b' }.
 * @param {function} props.onComplete - Callback function to proceed to the next lesson node.
 */
const ComplicationDemo = ({ prompt, config, onComplete }) => {
    const [heartRate, setHeartRate] = useState(130); // Target: 70-90
    const [bloodPressure, setBloodPressure] = useState(80); // Target: 110-130
    const [stabilizer, setStabilizer] = useState(5); // Adjusts HR down, BP up
    const [stimulant, setStimulant] = useState(5); // Adjusts HR up, BP up slightly
    const [status, setStatus] = useState("Patient is Unstable");
    const [isComplete, setIsComplete] = useState(false);

    const isStable = heartRate >= 70 && heartRate <= 90 && bloodPressure >= 110 && bloodPressure <= 130;
    const isCritical = heartRate > 180 || heartRate < 40 || bloodPressure > 200 || bloodPressure < 50;
    
    useEffect(() => {
        if (isComplete) return;

        const timer = setInterval(() => {
            // Natural drift + effect of drugs
            const hrDrift = (Math.random() - 0.5) * 4;
            const bpDrift = (Math.random() - 0.5) * 4;
            
            setHeartRate(hr => Math.max(30, hr + hrDrift - (stabilizer * 0.5) + (stimulant * 0.3)));
            setBloodPressure(bp => Math.min(220, bp + bpDrift + (stabilizer * 0.4) + (stimulant * 0.2)));

        }, 1000);
        return () => clearInterval(timer);
    }, [stabilizer, stimulant, isComplete]);
    
    useEffect(() => {
        if (isComplete) return;
        if (isStable) {
            setStatus("Patient Stabilized");
            setIsComplete(true);
            setTimeout(() => onComplete(config.successNode), 2000);
        } else if (isCritical) {
            setStatus("CRITICAL - Vitals Failing");
            setIsComplete(true);
            setTimeout(() => onComplete(config.failureNode), 2000);
        } else {
            setStatus("Patient is Unstable");
        }
    }, [heartRate, bloodPressure, isStable, isCritical, isComplete, onComplete, config]);

    const getStatusColor = (val, low, high) => val >= low && val <= high ? 'text-green-400' : 'text-yellow-400';

    return (
        <div className="p-6 bg-slate-800 rounded-lg text-white font-sans flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2 text-center">Medical Complication</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">{prompt || "Adjust medication to stabilize the patient's vitals."}</p>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg">
                {/* Vitals Display */}
                <div className="space-y-4">
                    <h4 className="font-bold text-lg text-cyan-300">Patient Vitals</h4>
                    <div className="flex justify-between items-baseline">
                        <span>Heart Rate (BPM):</span>
                        <span className={`font-mono text-2xl ${getStatusColor(heartRate, 70, 90)}`}>{Math.round(heartRate)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span>Blood Pressure (SYS):</span>
                        <span className={`font-mono text-2xl ${getStatusColor(bloodPressure, 110, 130)}`}>{Math.round(bloodPressure)}</span>
                    </div>
                    <div className="mt-4 text-center">
                        <p className={`text-xl font-bold ${isStable ? 'text-green-400' : isCritical ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>{status}</p>
                    </div>
                </div>
                {/* Controls */}
                <div className="space-y-4">
                     <h4 className="font-bold text-lg text-cyan-300">Medication Controls</h4>
                    <div>
                        <label>Stabilizer Dose: {stabilizer}</label>
                        <input type="range" min="0" max="10" value={stabilizer} onChange={e => setStabilizer(Number(e.target.value))} disabled={isComplete} className="w-full accent-blue-500" />
                    </div>
                    <div>
                        <label>Stimulant Dose: {stimulant}</label>
                        <input type="range" min="0" max="10" value={stimulant} onChange={e => setStimulant(Number(e.target.value))} disabled={isComplete} className="w-full accent-purple-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplicationDemo;
