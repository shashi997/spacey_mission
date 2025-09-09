// src/games/RocketStackerDemo.jsx
import React, { useState } from "react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";

const partsList = ["Booster", "Second Stage", "Payload Fairing"];

export default function RocketStackerDemo() {
  const [stack, setStack] = useState([]);
  const { handleSuccess, handleFailure } = useGameOutcomeHandler();

  const handleAddPart = (part) => {
    if (!stack.includes(part)) {
      setStack([...stack, part]);
    }
  };

  const handleSubmit = () => {
    const correctOrder = ["Booster", "Second Stage", "Payload Fairing"];
    if (JSON.stringify(stack) === JSON.stringify(correctOrder)) {
      handleSuccess("🚀 Rocket assembled successfully! Ready for launch.");
    } else {
      handleFailure("❌ Incorrect rocket stack. Try again!");
    }
  };

  const handleReset = () => setStack([]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold">🚀 Rocket Stacker</h2>
      <p>
        Let's assemble the launch vehicle for your satellite. <br />
        <span className="text-sm text-gray-300">
          Drag (or click) the rocket parts in the correct order. Booster at the
          bottom, Payload at the top.
        </span>
      </p>

      {/* Parts to choose from */}
      <div className="flex gap-3">
        {partsList.map((part) => (
          <button
            key={part}
            onClick={() => handleAddPart(part)}
            disabled={stack.includes(part)}
            className={`px-3 py-2 rounded-lg font-medium ${
              stack.includes(part)
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Rocket Assembly Stack */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
        <h3 className="font-semibold mb-2">🧩 Rocket Stack</h3>
        <div className="flex flex-col-reverse items-center space-y-2 space-y-reverse">
          {stack.length === 0 ? (
            <p className="text-gray-400 text-sm">No parts added yet</p>
          ) : (
            stack.map((part, idx) => (
              <div
                key={idx}
                className="w-40 py-2 mb-2 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-500"
              >
                {part}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
        >
          ✅ Confirm Stack
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
