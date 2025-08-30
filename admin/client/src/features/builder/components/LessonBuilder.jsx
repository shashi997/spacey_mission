import React from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NarrationNode from '../nodes/NarrationNode';
import QuizNode from '../nodes/QuizNode';
import ChoiceNode from '../nodes/ChoiceNode';
import AITriggerNode from '../nodes/AITriggerNode';
import GameInteractionNode from '../nodes/GameInteractionNode';

const LessonBuilder = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
}) => {
  const nodeTypes = {
    narration: NarrationNode,
    quiz: QuizNode,
    choice: ChoiceNode,
    aiTrigger: AITriggerNode,
    gameInteraction: GameInteractionNode,
  };

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
