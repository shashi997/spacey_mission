// src/games/SatelliteBuilderDemo.jsx
import React, { useState } from "react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";

const partsList = {
  power: ["Solar Panels", "Nuclear Battery", "Fuel Cell"],
  tools: ["Weather Camera", "Infrared Sensor", "Radar Dish"],
  comms: ["High-Gain Antenna", "Low-Gain Antenna", "Laser Link"],
};

export default function SatelliteBuilderDemo() {
  const [selected, setSelected] = useState({
    power: null,
    tool: null,
    comms: null,
  });

  const { handleSuccess, handleFailure } = useGameOutcomeHandler();

  const handleSelect = (category, item) => {
    setSelected((prev) => ({ ...prev, [category]: item }));
  };

  const handleSubmit = () => {
    if (
      selected.power === "Solar Panels" &&
      selected.tool === "Weather Camera" &&
      selected.comms === "High-Gain Antenna"
    ) {
      handleSuccess("Satellite built successfully! Hurricane monitoring active.");
    } else {
      handleFailure("Incorrect parts. Try again to build the right satellite.");
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold">🛰️ Satellite Builder</h2>
      <p>
        Your mission is to build a satellite that can monitor hurricanes on
        Earth. <br />
        <span className="text-sm text-gray-300">
          Choose one Power Source, one Tool, and one Communication Device.
        </span>
      </p>

      {/* Selection Panels */}
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(partsList).map((category) => (
          <div
            key={category}
            className="bg-gray-800 p-3 rounded-lg space-y-2 border border-gray-700"
          >
            <h3 className="capitalize font-semibold">{category}</h3>
            {partsList[category].map((item) => (
              <button
                key={item}
                onClick={() => handleSelect(category, item)}
                className={`w-full px-2 py-1 rounded-md text-sm ${
                  selected[category] === item
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Satellite Frame */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="font-semibold mb-2">🛰️ Satellite Frame</h3>
        <ul className="text-sm space-y-1">
          <li>
            <strong>Power:</strong>{" "}
            {selected.power || <span className="text-gray-400">None</span>}
          </li>
          <li>
            <strong>Tool:</strong>{" "}
            {selected.tool || <span className="text-gray-400">None</span>}
          </li>
          <li>
            <strong>Comms:</strong>{" "}
            {selected.comms || <span className="text-gray-400">None</span>}
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
      >
        ✅ Confirm Build
      </button>
    </div>
  );
}
