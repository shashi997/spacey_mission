import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ChoiceNode = ({ data }) => {
  const { label, prompt, options = [] } = data;

  // A simple function to create a unique and valid handle ID from the option text
  const createHandleId = (optionText, index) => {
    const sanitized = (optionText || '').trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `choice-${index}-${sanitized}`;
  };

  return (
    <div className="p-4 border-2 border-green-500 rounded-md bg-white shadow-lg w-64">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-green-500" />
      <div className="font-bold text-green-800 mb-2">{label || 'Choice'}</div>
      <p className="text-sm text-gray-700 mb-4">{prompt || 'No prompt set.'}</p>
      
      <div className="space-y-2 text-sm">
        {options.length > 0 ? (
          options.map((option, index) => (
            <div key={index} className="relative bg-gray-50 p-2 rounded-md text-left">
              {option || `Option ${index + 1}`}
              <Handle
                type="source"
                position={Position.Right}
                id={createHandleId(option, index)}
                className="!bg-green-500"
                style={{ top: '50%', right: -16 }}
              />
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-400">No options configured.</div>
        )}
      </div>
    </div>
  );
};

export default ChoiceNode;