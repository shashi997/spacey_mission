import React, { useEffect } from 'react';
import { useLessonStore } from '../hooks/useLessonStore';
import useSound from 'use-sound';
import choiceSound from '../../../assets/sounds/Button02.wav';
import { speak, cancelSpeech } from '../services/ttsService';
import { saveChoice } from '../services/progressApi';
import { auth } from '../../../lib/firebase';

/**
 * Converts a string to kebab-case.
 * e.g., "Scan for solar interference" -> "scan-for-solar-interference"
 * @param {string} text The text to convert.
 * @returns {string} The kebab-cased string.
 */
const toKebabCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
};

/**
 * Renders a choice block in the chat panel.
 * It displays a prompt and a set of options as buttons for the user to choose from.
 * @param {{ node: Object, isActive: boolean }} props
 */
const ChoiceBlock = ({ node, isActive }) => {
  const [playChoice] = useSound(choiceSound, { volume: 0.25 });
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  const recordAnswer = useLessonStore((state) => state.recordAnswer);
  const lesson = useLessonStore((state) => state.lesson);
  const selectedOptionIndex = useLessonStore((state) =>
    state.userAnswers.get(node.id),
  );

  if (!node || !node.data) {
    return null;
  }

  const { prompt, options, uiStyle = 'buttons' } = node.data;

  useEffect(() => {
    if (isActive) {
      const optionTexts = options?.map(o => o.text).filter(Boolean) || [];
      let optionsSpeech = '';

      if (optionTexts.length > 0) {
        if (optionTexts.length === 1) {
          optionsSpeech = optionTexts[0];
        } else {
          // Creates a more natural-sounding list like "A, B, or C"
          const lastOption = optionTexts.pop();
          optionsSpeech = `${optionTexts.join(', ')}, or ${lastOption}`;
        }
      }

      // Combine prompt and options with a good pause in between.
      // An ellipsis '...' is often spoken as a longer pause than a period.
      const textToSpeak = [prompt, optionsSpeech].filter(Boolean).join('... ');

      if (textToSpeak) {
        speak(textToSpeak);
      }
    }

    // Cleanup function to stop speech when the component is no longer active or unmounts
    return () => {
      cancelSpeech();
    };
  }, [isActive, prompt, options]);

  /**
   * Handler for when a user clicks an option.
   * It calls advanceLesson with a sourceHandle derived from the option's unique ID.
   * @param {object} option - The selected option object, containing id and text.
   * @param {number} optionIndex - The index of the selected option.
   */
  const handleOptionClick = async (option, optionIndex) => {
    
    if (isActive) {
      playChoice();
      // From NarrationBlock: calling cancel() inside a click handler helps "unlock"
      // the speech synthesis engine for the next utterance.
      cancelSpeech();
      // The sourceHandle format is derived from the node type and output handle ID in the builder.
      const sourceHandle = `${node.type}-out-${option.id}`;
      recordAnswer(node.id, optionIndex);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("Please log in to save your progress.");
        return;
      }
      const missionId = lesson?.id || 'unknown_mission';
      const blockId = node?.id || 'unknown_block';
      const choiceText = option?.text || 'choice';
      const tag = option?.tag || null; // add 'tag' to your option data if you want traits counted

    try {
      await saveChoice(userId, missionId, blockId, { text: choiceText, tag });
    } catch (err) {
      console.warn('Failed to save choice:', err);
      // (optional) you could still advance even if the save fails
    }
      advanceLesson(sourceHandle);
    }
  };

  return (
    <div className="bg-orange-900/30 border border-orange-700/40 p-4 rounded-lg text-white animate-fade-in">
      <p className="mb-4 whitespace-pre-wrap">{prompt || 'Choose an option:'}</p>
      {uiStyle === 'buttons' && (
        <div className="flex flex-col space-y-2">
          {options?.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            return (
              <button
                key={option.id || index}
                onClick={() => handleOptionClick(option, index)}
                disabled={!isActive}
                className={`w-full text-left p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isActive
                    ? 'bg-orange-600/50 hover:bg-orange-500/70'
                    : isSelected
                    ? 'bg-green-600/50 ring-2 ring-green-500 cursor-default'
                    : 'bg-orange-900/20 opacity-70 cursor-not-allowed'
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChoiceBlock;