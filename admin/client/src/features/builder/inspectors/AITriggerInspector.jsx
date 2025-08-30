import React, { useState, useEffect } from 'react';

const AITriggerInspector = ({ node, onNodeUpdate }) => {
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    setFormData(node.data);
  }, [node.id, node.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePanelBlur = (e) => {
    // If the newly focused element is outside this component, then save.
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, formData);
    }
  };

  return (
    <div onBlur={handlePanelBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: AI Trigger</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Display Name</label>
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
          <label htmlFor="ai_action" className="block text-sm font-medium text-gray-700">AI Action</label>
          <select
            id="ai_action"
            name="ai_action"
            value={formData.ai_action || 'analyze_behavior'}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="analyze_behavior">Analyze Behavior</option>
            <option value="summarize_decisions">Summarize Decisions</option>
            <option value="socratic_dialogue">Socratic Dialogue</option>
            <option value="provide_feedback">Provide Feedback</option>
          </select>
        </div>
        <div>
          <label htmlFor="fallback_text" className="block text-sm font-medium text-gray-700">Fallback Text (Optional)</label>
          <textarea
            id="fallback_text"
            name="fallback_text"
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.fallback_text || ''}
            onChange={handleChange}
            placeholder="e.g., Spacey says: 'You've got this!'"
          />
        </div>
      </div>
    </div>
  );
};

export default AITriggerInspector;