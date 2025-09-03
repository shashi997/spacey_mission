import React from 'react';
import { CheckCircle, XCircle, Info, RotateCw } from 'lucide-react';

// Helper to get styling and an icon based on the outcome status
const getStatusVisuals = (status = 'neutral') => {
  switch (status.toLowerCase()) {
    case 'success':
      return {
        Icon: CheckCircle,
        colorClass: 'text-green-400',
        bgColorClass: 'bg-green-900/50',
        borderColorClass: 'border-green-700',
      };
    case 'failure':
      return {
        Icon: XCircle,
        colorClass: 'text-red-400',
        bgColorClass: 'bg-red-900/50',
        borderColorClass: 'border-red-700',
      };
    default: // neutral
      return {
        Icon: Info,
        colorClass: 'text-blue-400',
        bgColorClass: 'bg-blue-900/50',
        borderColorClass: 'border-blue-700',
      };
  }
};

const OutcomeDemo = ({ node }) => {
  // Destructure data from the node with default values
  const { 
    title = 'Lesson Complete', 
    summary = 'You have reached the end of this lesson path.', 
    status = 'neutral' 
  } = node.data || {};

  const { Icon, colorClass, bgColorClass, borderColorClass } = getStatusVisuals(status);

  // In a real application, this button could navigate away or reset the lesson state
  const handleFinish = () => {
    console.log("Lesson finished. A real app would navigate or reset now.");
    alert("Lesson Finished!");
  };

  return (
    <div className={`w-full max-w-md h-full bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-white font-sans text-center animate-fade-in border ${borderColorClass} ${bgColorClass}`}>
      
      <Icon size={64} className={`${colorClass} mb-2`} />
      
      <h3 className={`text-3xl font-bold ${colorClass}`}>{title}</h3>
      
      <p className="text-base text-gray-300 my-4">
        {summary}
      </p>

      <button
        onClick={handleFinish}
        className="mt-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        Finish Lesson
      </button>
    </div>
  );
};

export default OutcomeDemo;