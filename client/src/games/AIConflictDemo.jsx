import React from 'react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

const AIConflictDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = node.data.options || [];
  const successOutcomeText = outcomes.length > 0 ? outcomes[0] : null;

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center gap-4 text-white">
      <h3 className="text-2xl font-bold text-purple-500">AI Conflict Demo</h3>
      <p className="text-center">This is a placeholder for the AI Conflict Resolution Demo game.</p>
      <div className="flex gap-4 mt-4">
        {successOutcomeText ? (
          <button
            onClick={() => handleGameComplete(successOutcomeText)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Simulate Success
          </button>
        ) : (
          <p className="text-sm text-gray-400">No outcomes defined for this game node.</p>
        )}
      </div>
    </div>
  );
};

export default AIConflictDemo;