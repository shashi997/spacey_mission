import React, { useState, useEffect } from 'react';

const NarrationInspector = ({ node, onNodeUpdate }) => {
  const [text, setText] = useState(node.data.text || '');

  // The key prop on the parent will remount this component when the node changes,
  // so this effect is mainly for safety in other use cases.
  useEffect(() => {
    setText(node.data.text || '');
  }, [node.id, node.data.text]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // For better performance, you could debounce this update.
    onNodeUpdate(node.id, { ...node.data, text: newText });
  };

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
          value={text}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default NarrationInspector;

