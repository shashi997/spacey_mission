import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// Example images for each option
const partsList = {
  power: [
    { name: 'Solar Panels', img: '/images/solar_panels.png' },
    { name: 'Nuclear Battery', img: '/images/nuclear_battery.png' },
    { name: 'Fuel Cell', img: '/images/fuel_cell.png' },
  ],
  tool: [
    { name: 'Weather Camera', img: '/images/weather_camera.png' },
    { name: 'Infrared Sensor', img: '/images/infrared_sensor.png' },
    { name: 'Radar Dish', img: '/images/radar_dish.png' },
  ],
  comms: [
    { name: 'High-Gain Antenna', img: '/images/high_gain.png' },
    { name: 'Low-Gain Antenna', img: '/images/low_gain.png' },
    { name: 'Laser Link', img: '/images/laser_link.png' },
  ],
};

export default function SatelliteBuilderDemo({ node }) {
  const [selected, setSelected] = useState({
    power: null,
    tool: null,
    comms: null,
  });
  // Adopted the status state machine from PlanetSequencer
  const [status, setStatus] = useState('pending'); // 'pending', 'correct', 'incorrect'

  const handleGameComplete = useGameOutcomeHandler(node);

  // Outcomes from LessonBuilder (Success/Failure)
  const outcomes = useMemo(() => node.data.options || [], [node.data.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.label?.toLowerCase() === 'success'),
    [outcomes]
  );
  const failureOutcome = useMemo(
    () => outcomes.find((o) => o.label?.toLowerCase() === 'failure'),
    [outcomes]
  );

  const handleSelect = (category, item) => {
    // Prevent changing selection after submission
    if (status !== 'pending') return;
    setSelected((prev) => ({ ...prev, [category]: item.name }));
  };

  const handleSubmit = () => {
    if (status !== 'pending') return;

    const isCorrect =
      selected.power === 'Solar Panels' &&
      selected.tool === 'Weather Camera' &&
      selected.comms === 'High-Gain Antenna';

    if (isCorrect) {
      setStatus('correct');
      if (successOutcome) {
        // Add a delay for UX, just like PlanetSequencer
        setTimeout(() => handleGameComplete(successOutcome), 1500);
      } else {
        console.warn('No success outcome defined in lesson JSON');
      }
    } else {
      setStatus('incorrect');
      // If a failure branch exists in the lesson, we still use it
      if (failureOutcome) {
        setTimeout(() => handleGameComplete(failureOutcome), 1500);
      }
    }
  };

  const handleRetry = () => {
    setSelected({ power: null, tool: null, comms: null });
    setStatus('pending');
  };

  const isSubmitDisabled = !selected.power || !selected.tool || !selected.comms || status !== 'pending';

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400">🛰️ Satellite Builder</h2>
      <p className="text-gray-300">
        Your mission is to build a satellite that can monitor hurricanes on Earth.
        <br />
        <span className="text-sm text-gray-400">
          Choose one Power Source, one Tool, and one Communication Device.
        </span>
      </p>

      {/* Selection Panels */}
      <div className="grid grid-cols-3 gap-6">
        {Object.keys(partsList).map((category) => (
          <div key={category} className="space-y-3">
            <h3 className="capitalize font-semibold">{category}</h3>
            <div className="grid grid-cols-1 gap-3">
              {partsList[category].map((item) => {
                const isSelected = selected[category] === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => handleSelect(category, item)}
                    className={`cursor-pointer rounded-lg border-2 p-2 text-center transition ${
                      isSelected
                        ? 'border-green-500 bg-green-700'
                        : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                    } ${status !== 'pending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-20 object-contain mx-auto"
                    />
                    <span className="text-sm mt-1 block">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Satellite Frame (Summary) - Unchanged */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="font-semibold mb-2">🛰️ Satellite Frame</h3>
        <ul className="text-sm space-y-1">
          <li><strong>Power:</strong> {selected.power || <span className="text-gray-400">None</span>}</li>
          <li><strong>Tool:</strong> {selected.tool || <span className="text-gray-400">None</span>}</li>
          <li><strong>Comms:</strong> {selected.comms || <span className="text-gray-400">None</span>}</li>
        </ul>
      </div>

      {/* NEW: Integrated Actions & Feedback Section */}
      <div className="h-16 flex flex-col items-center justify-center">
        {status === 'pending' && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Confirm Build
          </button>
        )}
        {status === 'correct' && (
          <p className="text-green-400 flex items-center gap-2 text-lg">
            <CheckCircle /> Correct! Mission parameters met.
          </p>
        )}
        {status === 'incorrect' && !failureOutcome && (
          <div className="text-center">
            <p className="text-red-400 flex items-center gap-2 text-lg">
              <XCircle /> Incorrect Build! Re-evaluate your choices.
            </p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        )}
        {status === 'incorrect' && failureOutcome && (
           <p className="text-red-400 flex items-center gap-2 text-lg">
              <XCircle /> Incorrect Build! Initiating alternate protocol...
            </p>
        )}
      </div>
    </div>
  );
}