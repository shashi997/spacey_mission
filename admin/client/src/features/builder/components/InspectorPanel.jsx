import React from 'react';
import NarrationInspector from '../inspectors/NarrationInspector';
import QuizInspector from '../inspectors/QuizInspector' ;
import ChoiceInspector from '../inspectors/ChoiceInspector';
import AITriggerInspector from '../inspectors/AITriggerInspector';
import GameInteractionInspector from '../inspectors/GameInteractionInspector';

const InspectorMap = {
  narration: NarrationInspector,
  quiz: QuizInspector,
  choice: ChoiceInspector,
  aiTrigger: AITriggerInspector,
  gameInteraction: GameInteractionInspector,
};

const InspectorPanel = ({ node, onNodeUpdate }) => {
  const InspectorComponent = InspectorMap[node.type];

  if (InspectorComponent) {
    return <InspectorComponent node={node} onNodeUpdate={onNodeUpdate} />;
  }

  switch (node.type) {
    case 'input':
    case 'output':
      return <h3 className="text-xl font-semibold mb-4 text-gray-800">{node.data.label}</h3>;
    default:
      return <p>No inspector for this node type.</p>;
  }
};

export default InspectorPanel;
