import React, { useState, useEffect } from 'react';
import { Zap, HeartPulse, Radio, FlaskConical } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// Helper to get an icon based on the system name
const getSystemIcon = (systemName = '') => {
  const name = systemName.toLowerCase();
  if (name.includes('life')) return <HeartPulse className="h-6 w-6 text-red-400" />;
  if (name.includes('comm')) return <Radio className="h-6 w-6 text-blue-400" />;
  if (name.includes('research')) return <FlaskConical className="h-6 w-6 text-purple-400" />;
  return <Zap className="h-6 w-6 text-yellow-400" />;
};

const ResourceAllocationDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const systems = node.data.options || []; // The possible outcomes are our systems

  const TOTAL_POWER = 10;
  const [powerUnits, setPowerUnits] = useState(TOTAL_POWER);
  const [allocations, setAllocations] = useState(() => {
    // Initialize allocations for each system to 0
    const initial = {};
    systems.forEach(system => {
      initial[system] = 0;
    });
    return initial;
  });

  // Handler to add power to a system
  const handleAddPower = (system) => {
    if (powerUnits > 0) {
      setPowerUnits(prev => prev - 1);
      setAllocations(prev => ({ ...prev, [system]: prev[system] + 1 }));
    }
  };

  // Handler to remove power from a system
  const handleRemovePower = (system) => {
    if (allocations[system] > 0) {
      setPowerUnits(prev => prev + 1);
      setAllocations(prev => ({ ...prev, [system]: prev[system] - 1 }));
    }
  };

  // Handler to finalize the decision
  const handleFinalize = () => {
    if (powerUnits > 0) {
      // This button should be disabled, but as a safeguard
      alert("You must allocate all power units before finalizing.");
      return;
    }

    // Find the system with the highest power allocation
    let chosenSystem = systems[0];
    let maxPower = 0;
    for (const system in allocations) {
      if (allocations[system] > maxPower) {
        maxPower = allocations[system];
        chosenSystem = system;
      }
    }

    // Advance the lesson with the chosen outcome
    handleGameComplete(chosenSystem);
  };

  return (
    <div className="w-full max-w-md h-full bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-white font-sans">
      <h3 className="text-2xl font-bold text-green-400">Resource Allocation</h3>
      <p className="text-sm text-gray-400">Allocate all power units to critical systems.</p>

      <div className="bg-black/30 rounded-full px-4 py-2 text-lg font-bold text-yellow-400 flex items-center gap-2">
        <Zap />
        <span>Power Units Remaining: {powerUnits}</span>
      </div>

      <div className="w-full space-y-3 mt-4">
        {systems.map(system => (
          <div key={system} className="bg-gray-800/50 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSystemIcon(system)}
              <span className="font-medium">{system}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRemovePower(system)}
                className="bg-red-600 hover:bg-red-700 rounded-full h-8 w-8 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={allocations[system] === 0}
              >
                -
              </button>
              <span className="text-xl font-mono w-8 text-center">{allocations[system]}</span>
              <button
                onClick={() => handleAddPower(system)}
                className="bg-green-600 hover:bg-green-700 rounded-full h-8 w-8 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={powerUnits === 0}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleFinalize}
        disabled={powerUnits > 0}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {powerUnits > 0 ? `Allocate ${powerUnits} more units` : 'Finalize Allocation'}
      </button>
    </div>
  );
};

export default ResourceAllocationDemo;