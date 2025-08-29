import React from 'react';
import { useReactFlow } from '@xyflow/react';

const NodePalette = () => {
  const { addNodes } = useReactFlow();

  const createNode = (nodeType) => {
    // TODO: Add node in the center of the current viewport
    const position = { x: Math.random() * 400, y: Math.random() * 400 };
    const newNode = {
      id: `node_${+new Date()}`,
      type: nodeType,
      position,
      data: {},
    };

    if (nodeType === 'quiz') {
      newNode.data = { label: 'New Quiz', question: '', options: ['Option 1', 'Option 2'], correctAnswer: 'Option 1' };
    } else if (nodeType === 'narration') {
      newNode.data = { label: 'New Narration', text: '' };
    }

    addNodes(newNode);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Blocks</h3>
      <div className="space-y-2">
        <button
          onClick={() => createNode('narration')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Narration
        </button>
        <button
          onClick={() => createNode('quiz')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Multiple Choice
        </button>
        <button
          onClick={() => createNode('quiz')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add Quiz
        </button>
        <button
          onClick={() => createNode('narration')} // Placeholder type
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Add AI Trigger
        </button>
      </div>
    </div>
  );
};

export default NodePalette;
