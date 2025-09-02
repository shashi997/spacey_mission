import React from 'react';
import { useLessonStore } from '../hooks/useLessonStore';

/**
 * Renders a narration block in the chat panel.
 * It displays text and provides a button to continue to the next lesson node.
 * @param {{ node: Object, isActive: boolean }} props
 */
const NarrationBlock = ({ node, isActive }) => {
  const advanceLesson = useLessonStore((state) => state.advanceLesson);

  if (!node || !node.data) {
    return null;
  }

  // Assuming narration text is stored in node.data.text
  const narrationText = node.data.text || 'No narration content available.';

  return (
    <div className="bg-blue-800/30 border border-blue-600/40 p-4 rounded-lg text-white animate-fade-in">
      <p className="mb-4 whitespace-pre-wrap">{narrationText}</p>
      {isActive && (
        <div className="flex justify-end">
          <button
            onClick={() => advanceLesson()}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default NarrationBlock;