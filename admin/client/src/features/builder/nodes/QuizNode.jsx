import React from 'react';
import { Handle, Position } from '@xyflow/react';

const QuizNode = ({ data }) => {
  return (
    <div className="p-4 border-2 border-purple-500 rounded-md bg-white shadow-lg w-64">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-purple-500" />
      <div className="font-bold text-purple-800 mb-2">{data.label || 'Quiz'}</div>
      <div className="text-sm text-gray-700">{data.question || 'No question set.'}</div>
      {data.options && (
        <div className="text-xs text-gray-500 mt-2">
          {data.options.length} options
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-purple-500" />
    </div>
  );
};

export default QuizNode;

