import React, { useState, useMemo } from 'react';
import { Bot, Binary, AlertTriangle } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// The "correct" AI for this puzzle
const CORRECT_AI = "Helios";

const AIConflictDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = useMemo(() => node.data.options || [], [node.data.options]);
  const successOutcome = useMemo(() => outcomes.find(o => o.text?.toLowerCase() === 'success'), [outcomes]);
  const failureOutcome = useMemo(() => outcomes.find(o => o.text?.toLowerCase() === 'failure'), [outcomes]);

  const [chosenAI, setChosenAI] = useState(null);

  const handleRetry = () => {
    setChosenAI(null);
  };

  const handleChoice = (aiName) => {
    setChosenAI(aiName);
    const isCorrect = aiName === CORRECT_AI;

    if (isCorrect) {
      // If correct, advance the lesson after a short delay.
      if (successOutcome) {
        setTimeout(() => handleGameComplete(successOutcome), 1500);
      }
    }
  };

  return (
    <div className="w-full max-w-md h-full bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-around text-white font-sans">
      <h3 className="text-2xl font-bold text-purple-400 flex items-center gap-2"><AlertTriangle /> AI Conflict</h3>
      <p className="text-center text-sm text-gray-400">Two AIs report conflicting energy readings. Choose which AI protocol to trust.</p>

      <div className="w-full flex justify-around gap-4">
        {/* AI Helios */}
        <div className="flex-1 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h4 className="text-lg font-bold text-orange-400 flex items-center gap-2"><Bot /> AI Helios</h4>
          <p className="text-xs text-gray-300 mt-2">Core Temp: <span className="text-red-400">98.5°C (Critical)</span></p>
          <p className="text-xs text-gray-300">Efficiency: <span className="text-green-400">99.2%</span></p>
          <button
            onClick={() => handleChoice("Helios")}
            disabled={!!chosenAI}
            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50"
          >
            Trust Helios
          </button>
        </div>

        {/* AI Selene */}
        <div className="flex-1 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h4 className="text-lg font-bold text-blue-400 flex items-center gap-2"><Bot /> AI Selene</h4>
          <p className="text-xs text-gray-300 mt-2">Core Temp: <span className="text-green-400">75.1°C (Optimal)</span></p>
          <p className="text-xs text-gray-300">Efficiency: <span className="text-red-400">82.4%</span></p>
          <button
            onClick={() => handleChoice("Selene")}
            disabled={!!chosenAI}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50"
          >
            Trust Selene
          </button>
        </div>
      </div>
      
      <div className="h-8 text-lg mt-2">
        {chosenAI && (chosenAI === CORRECT_AI ? 
          <p className="text-green-400">Correct! System stabilizing.</p> :
          <p className="text-red-400">Incorrect! Energy flux detected.</p>
        )}
      </div>

      <div className="h-12">
        {chosenAI && chosenAI !== CORRECT_AI && (
          <div className="flex gap-4 mt-2">
            <button onClick={handleRetry} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">Retry</button>
            <button
              onClick={() => handleGameComplete(failureOutcome)}
              disabled={!failureOutcome}
              className="bg-red-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Accept Failure
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConflictDemo;