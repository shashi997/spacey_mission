import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider, useNodesState, useEdgesState, useReactFlow, useStore  } from '@xyflow/react';
import LessonBuilder from '../features/builder/components/LessonBuilder';
import NodePalette from '../features/builder/components/NodePalette';
import InspectorPanel from '../features/builder/components/InspectorPanel';

// Centralizing initial state for the lesson builder
const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 50 }, data: { label: 'Lesson Start' } },
  { id: '2', type: 'output', position: { x: 250, y: 350 }, data: { label: 'Lesson End' } },
];
const initialEdges = [];

const LessonDesignerContent = () => {
  const { lessonId } = useParams();
  const [selectedNode, setSelectedNode] = useState(null);

  // State for nodes and edges is now managed here, at the top level.
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const flowWidth = useStore((state) => state.width);
  const flowHeight = useStore((state) => state.height);

  // Handler for adding a new node from the palette
  const handleAddNode = useCallback((nodeType) => {
    // This logic places the new node in the center of the viewport.
    const position = screenToFlowPosition({
      x: flowWidth / 2,
      y: flowHeight / 2,
    });

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
    } else if (nodeType === 'choice') {
      newNode.data = { label: 'New Choice', prompt: 'Make a choice:', options: ['Path A', 'Path B'], uiStyle: 'buttons' };
    } else if (nodeType === 'aiTrigger') {
      newNode.data = { label: 'AI Analysis', ai_action: 'analyze_behavior', fallback_text: "Spacey says: 'You've got this, let's keep going!'" };
    } else if (nodeType === 'gameInteraction') {
      newNode.data = {
        label: 'New Game',
        game_id: '',
        prompt: '',
        configuration: {},
        options: ['Success', 'Failure'],
      };
    }

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes, flowWidth, flowHeight]);

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
          ? { ...n, data }
          : n
      )
    );
    }, [setNodes]);

    return (
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
              <NodePalette onAddNode={handleAddNode} />
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
    );
};

const LessonDesigner = () => {
  

  return (
    <ReactFlowProvider>
      <LessonDesignerContent />
    </ReactFlowProvider>
  );
};

export default LessonDesigner;