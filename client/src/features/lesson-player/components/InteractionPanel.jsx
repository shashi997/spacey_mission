import React from 'react';

const InteractionPanel = ({ lesson }) => {
  return (
    <div className="bg-black/40 p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-cyan-green mb-4">Interaction Panel</h2>
      <div className="flex-grow flex items-center justify-center text-white/50">
        <p>Content for the current lesson node will be rendered here.</p>
      </div>
    </div>
  );
};

export default InteractionPanel;

