import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider, useNodesState, useEdgesState } from '@xyflow/react';
import LessonBuilder from '../features/builder/components/LessonBuilder';
import NodePalette from '../features/builder/components/NodePalette';
import InspectorPanel from '../features/builder/components/InspectorPanel';

// Centralizing initial state for the lesson builder
const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 50 }, data: { label: 'Lesson Start' } },
  { id: '2', type: 'output', position: { x: 250, y: 350 }, data: { label: 'Lesson End' } },
];
const initialEdges = [];

const LessonDesigner = () => {
  const { lessonId } = useParams();
  const [selectedNode, setSelectedNode] = useState(null);

  // State for nodes and edges is now managed here, at the top level.
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // This callback is passed to the LessonBuilder to update the selected node
  // which in turn determines which sidebar panel to show.
  const handleSelectionChange = useCallback(({ nodes }) => {
    // We only show the inspector if a single node is selected
    setSelectedNode(nodes.length === 1 ? nodes[0] : null);
  }, []);

  // This callback is passed to the InspectorPanel to update node data.
  const handleNodeUpdate = useCallback((nodeId, data) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } }
          : n
      )
    );
  }, [setNodes]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full bg-gray-100 font-sans">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-white shadow-lg p-4 overflow-y-auto border-r border-gray-200">
          {selectedNode ? (
            <InspectorPanel
              key={selectedNode.id} // Force re-mount on node change
              node={selectedNode}
              onNodeUpdate={handleNodeUpdate}
            />
          ) : (
            <NodePalette />
          )}
        </aside>
  
        {/* Main Canvas Area */}
        <main className="flex-grow h-full">
          <LessonBuilder
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setEdges={setEdges}
            onSelectionChange={handleSelectionChange}
          />
        </main>
      </div>
    </ReactFlowProvider>
  );
};

export default LessonDesigner;