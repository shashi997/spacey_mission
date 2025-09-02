import React, { useState, useEffect } from 'react';

// --- SVG ICONS ---
const UsersIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const ZapIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>);

/**
 * Resource Allocation Demo
 * @param {object} props
 * @param {string} props.prompt - The instructional text to display.
 * @param {object} props.config - Configuration object, e.g., { nextNode: 'path-a' }.
 * @param {function} props.onComplete - Callback function to proceed to the next lesson node.
 */
const ResourceAllocationDemo = ({ prompt, config, onComplete }) => {
    const TOTAL_RESOURCES = 100;
    const [civilian, setCivilian] = useState(25);
    const [industry, setIndustry] = useState(25);
    const [infrastructure, setInfrastructure] = useState(25);
    const [security, setSecurity] = useState(25);
    const [totalAllocated, setTotalAllocated] = useState(TOTAL_RESOURCES);

    useEffect(() => {
        setTotalAllocated(civilian + industry + infrastructure + security);
    }, [civilian, industry, infrastructure, security]);

    const handleAllocation = (setter) => (e) => {
        const value = parseInt(e.target.value, 10);
        const currentTotal = civilian + industry + infrastructure + security;
        const diff = value - (currentTotal - value);

        if (currentTotal > TOTAL_RESOURCES) {
             // Reduce others proportionally if over budget
             // This is a simple correction logic
        }
        setter(value);
    };
    
    const getOutcome = () => {
        if(totalAllocated !== TOTAL_RESOURCES) return "You must allocate exactly 100 resource points.";

        if(security < 20) return "Colony is vulnerable. Low security invites raids.";
        if(industry > 50) return "High industrial output, but pollution is causing civilian unrest.";
        if(civilian < 20) return "Civilian services are failing. Morale is at an all-time low.";
        if(infrastructure < 20) return "Crumbling infrastructure is causing supply chain issues.";
        return "A balanced allocation. The colony is stable for now.";
    }

    return (
        <div className="p-6 bg-slate-800 rounded-lg text-white font-sans flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2 text-center">Colony Resource Allocation</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">{prompt || "Allocate resources to ensure the colony's survival and prosperity."}</p>

            <div className="w-full max-w-lg space-y-4">
                <div>
                    <label>Civilian Services: {civilian}</label>
                    <input type="range" min="0" max="100" value={civilian} onChange={e => setCivilian(Number(e.target.value))} className="w-full accent-green-500"/>
                </div>
                 <div>
                    <label>Industry & Production: {industry}</label>
                    <input type="range" min="0" max="100" value={industry} onChange={e => setIndustry(Number(e.target.value))} className="w-full accent-blue-500"/>
                </div>
                 <div>
                    <label>Infrastructure: {infrastructure}</label>
                    <input type="range" min="0" max="100" value={infrastructure} onChange={e => setInfrastructure(Number(e.target.value))} className="w-full accent-yellow-500"/>
                </div>
                 <div>
                    <label>Security: {security}</label>
                    <input type="range" min="0" max="100" value={security} onChange={e => setSecurity(Number(e.target.value))} className="w-full accent-red-500"/>
                </div>
            </div>
            
            <div className="mt-6 text-lg font-bold">
                Total Allocated: <span className={totalAllocated > TOTAL_RESOURCES ? 'text-red-500' : 'text-green-400'}>{totalAllocated}</span> / {TOTAL_RESOURCES}
            </div>
            
            <div className="mt-4 text-center bg-slate-900/50 p-4 rounded-lg w-full max-w-lg">
                <p className="font-semibold text-cyan-300">Projected Outcome:</p>
                <p className="text-slate-200">{getOutcome()}</p>
            </div>

            <button 
                onClick={() => onComplete(config.nextNode)}
                disabled={totalAllocated !== TOTAL_RESOURCES}
                className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
            >
                Confirm Allocation
            </button>
        </div>
    );
};

export default ResourceAllocationDemo;
