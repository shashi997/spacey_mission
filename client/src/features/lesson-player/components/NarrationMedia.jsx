import React from 'react';

/**
 * Renders the media (image) for a narration node in the interaction panel.
 * @param {{ node: Object }} props
 */
const NarrationMedia = ({ node }) => {
  if (!node || !node.data || !node.data.imageUrl) {
    return null;
  }

  const { imageUrl, label } = node.data;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={imageUrl}
        alt={label || 'Narration Media'}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  );
};

export default NarrationMedia;