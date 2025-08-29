import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'Lesson Start' } },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Content Block' } },
  { id: '3', position: { x: 250, y: 200 }, data: { label: 'Quiz' } },
  { id: '4', type: 'output', position: { x: 250, y: 300 }, data: { label: 'Lesson End' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

const LessonDesigner = () => {
  const { lessonId } = useParams();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Lesson Design: {lessonId}</h2>
      <p className="mb-4 text-gray-600">Visually design the flow of your lesson by adding, connecting, and arranging nodes.</p>
      <div className="flex-grow border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default LessonDesigner;