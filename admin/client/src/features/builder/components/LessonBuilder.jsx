import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from '../nodes/CustomNodes';


const LessonBuilder = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  onSelectionChange,
}) => {
  
  // The onConnect callback is used to add new edges to the state.
  // It receives the `setEdges` function from the parent component.
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onSelectionChange={onSelectionChange}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-50"
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default LessonBuilder;
