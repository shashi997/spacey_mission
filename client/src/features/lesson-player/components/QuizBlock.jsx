import React, { useState, useMemo } from 'react';
import { useLessonStore } from '../hooks/useLessonStore';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Renders a quiz block in the chat panel.
 * It displays a question, multiple-choice options, and provides feedback on the user's answer.
 * @param {{ node: Object, isActive: boolean }} props
 */
const QuizBlock = ({ node, isActive }) => {
  const recordAnswer = useLessonStore((state) => state.recordAnswer);
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  const userAnswer = useLessonStore((state) => state.userAnswers.get(node.id));

  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);
  const isAnswered = useMemo(() => !!userAnswer || !!selectedAnswer, [userAnswer, selectedAnswer]);

  if (!node || !node.data) {
    return null;
  }

  const { question, options, correctAnswer } = node.data;

  const handleSelectAnswer = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    recordAnswer(node.id, option);
  };

  const getButtonClass = (option) => {
    if (!isAnswered) {
      return 'bg-gray-700 hover:bg-gray-600';
    }

    const isCorrect = option === correctAnswer;
    const isSelected = option === (selectedAnswer || userAnswer);

    if (isCorrect) {
      return 'bg-green-600/80 text-white cursor-default';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-600/80 text-white cursor-default';
    }

    return 'bg-gray-800/50 text-gray-400 cursor-not-allowed';
  };

  return (
    <div className="bg-pink-800/30 border border-pink-600/40 p-4 rounded-lg text-white animate-fade-in">
      <p className="font-bold mb-4 whitespace-pre-wrap">{question}</p>
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(option)}
            disabled={isAnswered}
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${getButtonClass(
              option,
            )}`}
          >
            <span>{option}</span>
            {isAnswered && option === correctAnswer && <CheckCircle size={20} className="text-green-300" />}
            {isAnswered && option === (selectedAnswer || userAnswer) && option !== correctAnswer && <XCircle size={20} className="text-red-300" />}
          </button>
        ))}
      </div>
      {isAnswered && (selectedAnswer || userAnswer) !== correctAnswer && (
         <div className="text-sm text-green-400/90 p-2 bg-green-900/30 rounded-md mb-4">
            Correct Answer: {correctAnswer}
        </div>
      )}
      {isActive && isAnswered && (
        <div className="flex justify-end mt-4">
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

export default QuizBlock;