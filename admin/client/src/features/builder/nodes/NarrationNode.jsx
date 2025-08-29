import React from 'react';
import { Handle, Position } from '@xyflow/react';

const NarrationNode = ({ data }) => {
  return (
    <div className="p-4 border-2 border-gray-400 rounded-md bg-white shadow-lg w-64">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-500" />
      <div className="font-bold text-gray-800 mb-2">{data.label || 'Narration'}</div>
        <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{data.text || 'No text set.'}</p>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-500" />
    </div>
  );
};

export default NarrationNode;

