import React from 'react';


const NodePalette = ({ onAddNode }) => {
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Blocks</h3>
      <div className="space-y-2">
        <button
          onClick={() => onAddNode('narration')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Narration
        </button>
        <button
          onClick={() => onAddNode('quiz')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Multiple Choice
        </button>
        <button
          onClick={() => onAddNode('choice')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Choice (Branch)
        </button>
        <button
          onClick={() => onAddNode('aiTrigger')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add AI Trigger
        </button>
        <button
          onClick={() => onAddNode('gameInteraction')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Game Interaction
        </button>
      </div>
    </div>
  );
};

export default NodePalette;
