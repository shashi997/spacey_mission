import React, { useState, useEffect } from 'react';

const QuizInspector = ({ node, onNodeUpdate }) => {
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    setFormData(node.data);
  }, [node.id, node.data]);

  const handlePanelBlur = (e) => {
    // If the newly focused element is outside this component, then save.
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), ''];
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    // Also check if the removed option was the correct answer and clear it if so.
    const newCorrectAnswer = formData.correctAnswer === formData.options[index] ? '' : formData.correctAnswer;
    const updatedData = { ...formData, options: newOptions, correctAnswer: newCorrectAnswer };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
  };

  return (
    <div onBlur={handlePanelBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Quiz Block</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Node Label</label>
          <input
            type="text"
            id="label"
            name="label"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.label || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            id="question"
            name="question"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.question || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Answer Options</label>
          {(formData.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            </div>
          ))}
          <button onClick={addOption} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Option</button>
        </div>
         <div>
          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">Correct Answer</label>
          <select
            id="correctAnswer"
            name="correctAnswer"
            value={formData.correctAnswer || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Select the correct answer</option>
            {(formData.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuizInspector;
