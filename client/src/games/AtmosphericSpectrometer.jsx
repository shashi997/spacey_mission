// src/games/AtmosphericSpectrometer.jsx
import React, { useState, useMemo } from "react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

const absorptionLines = [
  { id: "oxygen", position: 120, label: "Oxygen" },
  { id: "nitrogen", position: 220, label: "Nitrogen" },
  { id: "co2", position: 350, label: "CO₂" },
  { id: "methane", position: 480, label: "Methane" },
];

const options = [
  { id: "oxygen", label: "Oxygen" },
  { id: "nitrogen", label: "Nitrogen" },
  { id: "co2", label: "CO₂" },
  { id: "methane", label: "Methane" },
];

export default function AtmosphericSpectrometer({ node }) {
  const [placed, setPlaced] = useState({});
  const [status, setStatus] = useState("pending"); // pending | success | failure

  const handleGameComplete = useGameOutcomeHandler(node);

  const outcomes = useMemo(() => node.data?.options || [], [node.data?.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "success"),
    [outcomes]
  );

  // --- Drag Handlers ---
  const handleDrop = (e, targetId) => {
    const draggedId = e.dataTransfer.getData("labelId");
    if (!draggedId) return;
    setPlaced((prev) => ({ ...prev, [targetId]: draggedId }));
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("labelId", id);
  };

  // --- Submit Answer ---
  const handleSubmit = () => {
    const allCorrect = absorptionLines.every(
      (line) => placed[line.id] === line.id
    );
    if (allCorrect) {
      setStatus("success");
      if (successOutcome) handleGameComplete(successOutcome);
    } else {
      setStatus("failure");
    }
  };

  const handleRetry = () => {
    setPlaced({});
    setStatus("pending");
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-300">
          Atmospheric Spectrometer
        </h2>
        <p className="text-gray-300 mt-2">
          The spectrometer split the starlight into a rainbow. Drag chemical
          labels onto the correct absorption lines to identify the atmosphere’s
          composition.
        </p>
      </div>

      {/* Spectrum */}
      <div className="relative w-full h-40 bg-gradient-to-r from-violet-700 via-blue-400 to-red-500 rounded">
        {absorptionLines.map((line) => (
          <div
            key={line.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, line.id)}
            className="absolute top-0 bottom-0 w-1 bg-black"
            style={{ left: `${line.position}px` }}
          >
            <div className="absolute top-full mt-2 w-20 text-center text-sm">
              {placed[line.id]
                ? options.find((o) => o.id === placed[line.id])?.label
                : "Drop here"}
            </div>
          </div>
        ))}
      </div>

      {/* Labels to Drag */}
      {status === "pending" && (
        <div className="flex gap-4 flex-wrap justify-center mt-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              draggable
              onDragStart={(e) => handleDragStart(e, opt.id)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg cursor-grab font-semibold"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {/* Controls & Status */}
      <div className="text-center space-y-2">
        {status === "pending" && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
          >
            ✅ Confirm Analysis
          </button>
        )}
        {status === "failure" && (
          <div>
            <p className="text-red-400 flex items-center justify-center gap-2">
              <XCircle /> Incorrect match! Try again.
            </p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg flex items-center gap-2"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}
        {status === "success" && (
          <p className="text-green-400 flex items-center justify-center gap-2">
            <CheckCircle /> Analysis complete! You’ve identified the atmosphere.
          </p>
        )}
      </div>
    </div>
  );
}
