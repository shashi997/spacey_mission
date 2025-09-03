import { useLessonStore } from './useLessonStore';

const toKebabCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
};

/**
 * A custom hook to handle the logic for completing a game and advancing the lesson.
 * It standardizes how game outcomes are processed and how the lesson progresses.
 *
 * @param {object} node - The current gameInteraction node from the lesson.
 * @returns {function(string): void} A function to call with the outcome text to complete the game.
 */
export const useGameOutcomeHandler = (node) => {
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  // Read from `options` first, with a fallback to `outcomes` for compatibility.
  const outcomes = node.data.options || node.data.outcomes || [];

  const handleGameComplete = (outcomeText) => {
    if (!outcomeText) {
      console.error('handleGameComplete called with an empty outcome.');
      return;
    }

    const outcomeIndex = outcomes.findIndex((o) => o.toLowerCase() === outcomeText.toLowerCase());

    if (outcomeIndex === -1) {
      console.error(`Outcome "${outcomeText}" not found in node.data.options/outcomes:`, outcomes);
      return;
    }

    const sourceHandle = `game-outcome-${outcomeIndex}-${toKebabCase(outcomeText)}`;
    advanceLesson(sourceHandle);
  };

  return handleGameComplete;
};