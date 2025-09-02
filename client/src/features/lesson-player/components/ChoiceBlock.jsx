import React from 'react';
import { useLessonStore } from '../hooks/useLessonStore';

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
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  const recordAnswer = useLessonStore((state) => state.recordAnswer);
  const selectedOptionIndex = useLessonStore((state) =>
    state.userAnswers.get(node.id),
  );

  if (!node || !node.data) {
    return null;
  }

  const { prompt, options, uiStyle = 'buttons' } = node.data;

  // Handler for when a user clicks an option.
  // It calls advanceLesson with the index of the option as the sourceHandle.
  const handleOptionClick = (optionText, optionIndex) => {
    if (isActive) {
      // The sourceHandle format from the database is "choice-index-kebab-case-text"
      const sourceHandle = `choice-${optionIndex}-${toKebabCase(optionText)}`;
      recordAnswer(node.id, optionIndex);
      advanceLesson(sourceHandle);
    }
  };

  return (
    <div className="bg-gray-700/20 border border-gray-600/30 p-4 rounded-lg text-white animate-fade-in">
      {/* Display the prompt */}
      <p className="mb-4 whitespace-pre-wrap">{prompt || 'Choose an option:'}</p>

      {/* Render the options based on the uiStyle */}
      {uiStyle === 'buttons' && (
        <div className="flex flex-col space-y-2">
          {options?.map((optionText, index) => {
            const isSelected = selectedOptionIndex === index;
            return (
              <button
                key={index}
                onClick={() => handleOptionClick(optionText, index)}
                disabled={!isActive}
                className={`w-full text-left p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-green ${
                  isActive
                    ? 'bg-blue-600/50 hover:bg-blue-500/70'
                    : isSelected
                    ? 'bg-green-600/50 ring-2 ring-green-500 cursor-default'
                    : 'bg-gray-600/30 opacity-70 cursor-not-allowed'
                }`}
              >
                {optionText}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChoiceBlock;