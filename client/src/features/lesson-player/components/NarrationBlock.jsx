import React, { useEffect } from 'react';
import { useLessonStore } from '../hooks/useLessonStore';
import useSound from 'use-sound';
import buttonSound from '../../../assets/sounds/Button01.wav';
import { speak, cancelSpeech } from '../services/ttsService';

/**
 * Renders a narration block in the chat panel.
 * It displays text, plays narration, and provides a button to continue.
 * @param {{ node: Object, isActive: boolean }} props
 */
const NarrationBlock = ({ node, isActive }) => {
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  const [play] = useSound(buttonSound, { volume: 0.25 });

  if (!node || !node.data) {
    return null;
  }

  const narrationText = node.data.text || 'No narration content available.';

  useEffect(() => {
    if (isActive && narrationText) {
      speak(narrationText);
    }

    // Cleanup function to stop speech when the component is no longer active or unmounts
    return () => {
      cancelSpeech();
    };
  }, [isActive, narrationText]);

  const handleContinue = () => {
    play();
    // This is a workaround for some browsers (like Firefox) that prevent audio
    // from playing without a recent user gesture. Calling cancel() inside a
    // click handler helps "unlock" the speech synthesis engine for the next
    // utterance that will be triggered by `advanceLesson()`.
    cancelSpeech();
    advanceLesson();
  };

  return (
    <div className="bg-blue-800/30 border border-blue-600/40 p-4 rounded-lg text-white animate-fade-in">
      <p className="mb-4 whitespace-pre-wrap">{narrationText}</p>
      {isActive && (
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
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