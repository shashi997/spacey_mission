import React from 'react';
import { Handle, Position } from '@xyflow/react';

const GameInteractionNode = ({ data }) => {
  const { label, game_id, prompt, options = [] } = data;

  // A simple function to create a unique and valid handle ID from the option text
  const createHandleId = (optionText, index) => {
    const sanitized = (optionText || '').trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `game-outcome-${index}-${sanitized || 'empty'}`;
  };

  return (
    <div className="p-4 border-2 border-orange-500 rounded-md bg-white shadow-lg w-72">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-orange-500" />

      <div className="font-bold text-orange-800 mb-2">{label || 'Game Interaction'}</div>
      <div className="text-xs font-mono bg-gray-100 p-1 rounded mb-2">ID: {game_id || 'Not set'}</div>
      <p className="text-sm text-gray-700 mb-4">{prompt || 'No prompt set.'}</p>

      <div className="space-y-2 text-sm">
        <div className="text-xs text-gray-500 font-semibold">Outcomes (Options):</div>
        {options.length > 0 ? (
          options.map((option, index) => (
            <div key={index} className="relative bg-gray-50 p-2 rounded-md text-left">
              {option || `Outcome ${index + 1}`}
              <Handle
                type="source"
                position={Position.Right}
                id={createHandleId(option, index)}
                className="!bg-orange-500"
                style={{ top: '50%', right: -16 }}
              />
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-400">No outcomes configured.</div>
        )}
      </div>
    </div>
  );
};

export default GameInteractionNode;