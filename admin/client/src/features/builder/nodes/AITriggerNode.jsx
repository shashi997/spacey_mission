import React from 'react';
import { Handle, Position } from '@xyflow/react';

const AITriggerNode = ({ data }) => {
  const { label, ai_action } = data;

  return (
    <div className="p-4 border-2 border-cyan-500 rounded-md bg-white shadow-lg w-64">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-cyan-500" />
      <div className="font-bold text-cyan-800 mb-2">{label || 'AI Trigger'}</div>
      <p className="text-sm text-gray-700">
        Action: <span className="font-mono bg-gray-100 p-1 rounded text-xs">{ai_action || 'Not set'}</span>
      </p>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-cyan-500" />
    </div>
  );
};

export default AITriggerNode;