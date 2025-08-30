import React, { useState, useEffect } from 'react';

const GameInteractionInspector = ({ node, onNodeUpdate }) => {
  const [formData, setFormData] = useState(node.data);
  // We manage the configuration as a string for the textarea for better UX
  const [configString, setConfigString] = useState(JSON.stringify(formData.configuration || {}, null, 2));
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    setFormData(node.data);
    setConfigString(JSON.stringify(node.data.configuration || {}, null, 2));
    setConfigError(null);
  }, [node.id, node.data]);

  const handlePanelBlur = (e) => {
    // If the newly focused element is outside this component, then save.
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, formData);
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigStringChange = (e) => {
    setConfigString(e.target.value);
    setConfigError(null); // Clear error while typing
  };

  const handleConfigBlur = () => {
    try {
      // just update local state, the panel's onBlur will handle the save
      const parsedConfig = JSON.parse(configString || '{}');
      setFormData(prev => ({ ...prev, configuration: parsedConfig }));
      setConfigError(null);
    } catch (error) {
      setConfigError('Invalid JSON format.');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), 'New Outcome'];
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
  };

  const removeOption = (index) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
  };

  return (
    <div onBlur={handlePanelBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Game Interaction</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Game Name (Label)</label>
          <input type="text" id="label" name="label" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.label || ''} onChange={handleTextChange} />
        </div>
        <div>
          <label htmlFor="game_id" className="block text-sm font-medium text-gray-700">Game ID</label>
          <input type="text" id="game_id" name="game_id" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.game_id || ''} onChange={handleTextChange} placeholder="e.g., mars_energy_router" />
        </div>
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
          <textarea id="prompt" name="prompt" rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.prompt || ''} onChange={handleTextChange} />
        </div>
        <div>
          <label htmlFor="configuration" className="block text-sm font-medium text-gray-700">Configuration (JSON)</label>
          <textarea id="configuration" name="configuration" rows="6" className={`mt-1 block w-full px-3 py-2 font-mono text-xs border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm ${configError ? 'border-red-500' : 'border-gray-300'}`} value={configString} onChange={handleConfigStringChange} onBlur={handleConfigBlur} />
          {configError && <p className="mt-1 text-xs text-red-600">{configError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Outcomes (Options)</label>
          {(formData.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={`Outcome ${index + 1}`}
              />
              <button onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            </div>
          ))}
          <button onClick={addOption} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Outcome</button>
        </div>
      </div>
    </div>
  );
};

export default GameInteractionInspector;