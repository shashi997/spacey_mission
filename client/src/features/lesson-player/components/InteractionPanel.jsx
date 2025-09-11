import React from 'react';
import { useLessonStore } from '../hooks/useLessonStore';
import { GameRegistry } from '../../../games';

const InteractionPanel = () => {
  const currentNode = useLessonStore((state) => state.currentNode);

  // DEBUG: Log current node information
  // console.log('InteractionPanel - Current Node:', currentNode);
  // console.log('InteractionPanel - Node Type:', currentNode?.type);
  // console.log('InteractionPanel - Game ID:', currentNode?.data?.game_id);

  const renderContent = () => {
    if (currentNode?.type === 'gameInteraction') {
      const GameComponent = GameRegistry[currentNode.data.game_id];
      // console.log('Looking for game:', currentNode.data.game_id);
      // console.log('Found component:', GameComponent);
      // console.log('Available games:', Object.keys(GameRegistry));
      
      if (GameComponent) {
        return <GameComponent node={currentNode} />;
      }
      return <p>Game '{currentNode.data.game_id}' not found in registry.</p>;
    }

    return <p>Content for the current lesson node will be rendered here.</p>;
  };

  return (
    <div className="bg-black/40 p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-cyan-green mb-4">Interaction Panel</h2>
      <div className="flex-grow flex items-center justify-center text-white/50">
        {renderContent()}
      </div>
    </div>
  );
};

export default InteractionPanel;
