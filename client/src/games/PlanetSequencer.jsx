import React, { useState, useMemo } from 'react';
import { Orbit, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// Planet colors (Tailwind)
const PLANET_COLORS = {
  Mercury: 'bg-gray-400',
  Venus: 'bg-yellow-200 text-black',
  Earth: 'bg-blue-500',
  Mars: 'bg-red-500',
  Jupiter: 'bg-orange-400',
  Saturn: 'bg-yellow-600',
  Uranus: 'bg-cyan-200 text-black',
  Neptune: 'bg-blue-700'
};

// Correct orbital order
const CORRECT_ORDER = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

const PlanetSequencer = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = useMemo(() => node.data.options || [], [node.data.options]);
  const successOutcome = useMemo(() => outcomes.find(o => o.text?.toLowerCase() === 'success'), [outcomes]);

  const [unplacedPlanets, setUnplacedPlanets] = useState([...CORRECT_ORDER]);
  const [placedPlanets, setPlacedPlanets] = useState(Array(CORRECT_ORDER.length).fill(null));
  const [status, setStatus] = useState('pending'); // 'pending', 'correct', 'incorrect'

  const handleDragStart = (e, planet) => {
    e.dataTransfer.setData("planet", planet);
  };

  const handleDrop = (e, index) => {
    if (status !== 'pending') return;

    const planet = e.dataTransfer.getData("planet");
    if (!planet || placedPlanets[index]) return;

    setUnplacedPlanets(current => current.filter(p => p !== planet));
    const newPlaced = [...placedPlanets];
    newPlaced[index] = planet;
    setPlacedPlanets(newPlaced);
  };

  const handleCheck = () => {
    if (status !== 'pending') return;

    const isCorrect = JSON.stringify(placedPlanets) === JSON.stringify(CORRECT_ORDER);
    if (isCorrect) {
      setStatus('correct');
      if (successOutcome) {
        setTimeout(() => handleGameComplete(successOutcome), 1500);
      }
    } else {
      setStatus('incorrect');
    }
  };

  const handleRetry = () => {
    setUnplacedPlanets([...CORRECT_ORDER]);
    setPlacedPlanets(Array(CORRECT_ORDER.length).fill(null));
    setStatus('pending');
  };

  return (
    <div className="w-full max-w-3xl bg-gray-900 rounded-lg p-6 flex flex-col items-center gap-6 text-white font-sans">
      <h3 className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
        <Orbit /> Orbital Sequencer
      </h3>
      <p className="text-center text-sm text-gray-400">
        Drag each planet into orbit around the Sun, starting with the closest.
      </p>

      {/* Unplaced planets */}
      <div className="w-full flex flex-wrap gap-2 justify-center">
        {unplacedPlanets.map((planet) => (
          <div
            key={planet}
            draggable={status === 'pending'}
            onDragStart={(e) => handleDragStart(e, planet)}
            className={`px-3 py-2 rounded-lg cursor-grab hover:opacity-80 ${PLANET_COLORS[planet]}`}
          >
            {planet}
          </div>
        ))}
      </div>

      {/* Sun + orbital slots */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        {/* Sun */}
        <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black shadow-2xl">
          SUN
        </div>

        {/* Orbits */}
        {placedPlanets.map((planet, index) => (
          <div
            key={index}
            onDragOver={(e) => status === 'pending' && e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center"
          >
            {planet ? (
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${PLANET_COLORS[planet]}`}>
                {planet}
              </div>
            ) : (
              <span className="text-gray-500 text-xs">Orbit {index + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {unplacedPlanets.length === 0 && status === 'pending' && (
        <button
          onClick={handleCheck}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Confirm Order
        </button>
      )}
      {status === 'incorrect' && (
        <button
          onClick={handleRetry}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      )}

      {/* Status messages */}
      <div className="h-8 text-lg mt-2">
        {status === 'correct' && (
          <p className="text-green-400 flex items-center gap-2">
            <CheckCircle /> Correct! Planetary order aligned.
          </p>
        )}
        {status === 'incorrect' && (
          <p className="text-red-400 flex items-center gap-2">
            <XCircle /> Incorrect alignment! Recheck orbits.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlanetSequencer;
