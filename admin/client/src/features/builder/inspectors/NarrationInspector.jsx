import React, { useState, useEffect } from 'react';

const NarrationInspector = ({ node, onNodeUpdate }) => {
  // Use local state to manage the form data. Initialize with the node's data.
  const [localData, setLocalData] = useState(node.data);

  // This effect syncs the local state if the node prop changes from the outside
  // (e.g., another user's edits, or selecting a different node).
  useEffect(() => {
    setLocalData(node.data);
  }, [node.data]);

  // Handle changes to the input fields by updating local state only.
  // This is fast and does not cause the whole flow to re-render.
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setLocalData(prevData => ({ ...prevData, [name]: value }));
  };

  // When the user clicks away from an input, persist the changes.
  // This calls the main update function in LessonDesigner.
  const handlePanelBlur = (e) => {
    // If the newly focused element is outside this component, then save.
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, localData);
    }
  };

  return (
    <div className="space-y-4" onBlur={handlePanelBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Narration Block</h3>
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">Node Label</label>
        <input
          type="text"
          id="label"
          name="label"
          value={localData.label || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">Narration Text</label>
        <textarea
          id="text"
          name="text"
          rows="8"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={localData.text || ''}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default NarrationInspector;
