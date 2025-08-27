import React, { useState, useEffect } from 'react';

const LessonForm = ({ onSubmit, onCancel, initialData = {}, isSaving = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    estimatedDuration: '',
    iconUrl: '',
    status: 'draft',
  });
  const [objectives, setObjectives] = useState([]);
  const [currentObjective, setCurrentObjective] = useState('');

  const isEditing = !!initialData.id;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        estimatedDuration: initialData.estimatedDuration || '',
        iconUrl: initialData.iconUrl || '',
        status: initialData.status || 'draft',
      });
      setObjectives(initialData.learningObjectives || []);
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddObjective = () => {
    if (currentObjective.trim() !== '') {
      setObjectives([...objectives, currentObjective.trim()]);
      setCurrentObjective('');
    }
  };

  const handleRemoveObjective = (indexToRemove) => {
    setObjectives(objectives.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      learningObjectives: objectives,
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Core Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Lesson Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required disabled={isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100" />
            {isEditing && <p className="text-xs text-gray-500 mt-1">Title cannot be changed as it's used as the document ID.</p>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea name="shortDescription" id="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="A brief, one or two-sentence summary of the lesson's core challenge."></textarea>
          </div>
          <div>
            <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">Estimated Duration</label>
            <input type="text" name="estimatedDuration" id="estimatedDuration" value={formData.estimatedDuration} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 15-18 min" />
          </div>
          <div>
            <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-700">Icon/Image URL</label>
            <input type="url" name="iconUrl" id="iconUrl" value={formData.iconUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/image.png" />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Learning Objectives</h3>
        <div className="flex gap-2 mb-4">
          <input type="text" value={currentObjective} onChange={(e) => setCurrentObjective(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())} placeholder="e.g., Understand energy flow" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <button type="button" onClick={handleAddObjective} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add</button>
        </div>
        <ul className="space-y-2">
          {objectives.map((obj, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span>{obj}</span>
              <button type="button" onClick={() => handleRemoveObjective(index)} className="text-red-500 hover:text-red-700">&times;</button>
            </li>
          ))}
          {objectives.length === 0 && <p className="text-sm text-gray-500">No objectives added yet.</p>}
        </ul>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Publication</h3>
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled={isSaving}>Cancel</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSaving}>
          {isSaving ? 'Saving...' : (isEditing ? 'Update Lesson' : 'Create Lesson')}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;
