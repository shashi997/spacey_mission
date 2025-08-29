import React, { useState, useEffect } from 'react';

const InspectorPanel = ({ node, onNodeUpdate }) => {
  // Initialize form state from the node's data
  const [formData, setFormData] = useState(node.data);

  // When the selected node changes, update the form data
  useEffect(() => {
    setFormData(node.data);
  }, [node]);

  // Centralized function to update node data in the main React Flow state
  const updateNodeData = (nodeId, newData) => {
    onNodeUpdate(nodeId, newData);
  };

  // Generic handler for simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateNodeData(node.id, updatedData);
  };

  // Specific handlers for dynamic lists like quiz options
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    updateNodeData(node.id, updatedData);
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), ''];
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    updateNodeData(node.id, updatedData);
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    updateNodeData(node.id, updatedData);
  };

  const renderContent = () => {
    switch (node.type) {
      case 'narration': // Narration Block
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Narration Block</h3>
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">Narration Text</label>
              <textarea
                id="text"
                name="text"
                rows="8"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.text || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'quiz': // Multiple Choice / Quiz
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Quiz Block</h3>
            <div className="space-y-4">
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
                <input
                  type="text"
                  id="correctAnswer"
                  name="correctAnswer"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.correctAnswer || ''}
                  onChange={handleChange}
                  placeholder="Enter the exact text of the correct option"
                />
              </div>
            </div>
          </>
        );
      case 'input':
      case 'output':
        return <h3 className="text-xl font-semibold mb-4 text-gray-800">{node.data.label}</h3>;
      default:
        return <p>No inspector for this node type.</p>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default InspectorPanel;
