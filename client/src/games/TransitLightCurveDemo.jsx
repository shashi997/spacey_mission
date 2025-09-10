// src/games/TransitLightCurveDemo.jsx
import React, { useState, useMemo, useRef } from "react";
import { CheckCircle, XCircle, RefreshCw, Target } from "lucide-react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";

// --- Synthetic Light Curve Data Generator ---
const generateLightCurve = () => {
  const data = [];
  for (let t = 0; t <= 100; t++) {
    // Base brightness ~1.0 with tiny noise
    let brightness = 1 + (Math.random() - 0.5) * 0.01;

    // Add transit dips at t ~20, 50, 80
    if (Math.abs(t - 20) < 2 || Math.abs(t - 50) < 2 || Math.abs(t - 80) < 2) {
      brightness -= 0.1; // dip
    }

    data.push({ t, brightness });
  }
  return data;
};

const lightCurveData = generateLightCurve();
const correctDipTimes = [20, 50, 80]; // expected transit points

export default function TransitLightCurveDemo({ node }) {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("pending"); // pending | success | failure
  const timeoutRef = useRef(null);

  const handleGameComplete = useGameOutcomeHandler(node);

  const outcomes = useMemo(() => node.data?.options || [], [node.data?.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "success"),
    [outcomes]
  );

  // Click handler
  const handleClick = (point) => {
    if (status !== "pending") return;

    // Avoid duplicate clicks
    if (!selected.find((s) => s.t === point.t)) {
      setSelected((prev) => [...prev, point]);
    }
  };

  const handleSubmit = () => {
    // Compare selected points with correctDipTimes
    const selectedTimes = selected.map((p) => p.t);
    const isCorrect =
      selected.length === 3 &&
      correctDipTimes.every((t) =>
        selectedTimes.some((st) => Math.abs(st - t) <= 2)
      );

    if (isCorrect) {
      setStatus("success");
      if (successOutcome) {
        timeoutRef.current = setTimeout(
          () => handleGameComplete(successOutcome),
          1500
        );
      }
    } else {
      setStatus("failure");
    }
  };

  const handleRetry = () => {
    setSelected([]);
    setStatus("pending");
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-300 flex items-center justify-center gap-2">
          <Target /> Transit Light Curve Analyzer
        </h2>
        <p className="text-gray-300 mt-2">
          Analyze the light data from <strong>Proxima Centauri</strong>. Look for
          repeating dips in brightness. Click on <strong>three matching dips</strong> to confirm a planet.
        </p>
      </div>

      {/* Graph */}
      <svg
        viewBox="0 0 700 300"
        className="bg-black border border-gray-700 rounded-lg w-full"
        style={{ cursor: status === "pending" ? "crosshair" : "default" }}
      >
        {/* Axes */}
        <line x1="40" y1="260" x2="680" y2="260" stroke="#888" />
        <line x1="40" y1="20" x2="40" y2="260" stroke="#888" />

        {/* Data line */}
        <polyline
          fill="none"
          stroke="#0ff"
          strokeWidth="1.5"
          points={lightCurveData
            .map(
              (d) =>
                `${40 + (d.t / 100) * 640},${260 - (d.brightness - 0.85) * 1000}`
            )
            .join(" ")}
        />

        {/* Selected points */}
        {selected.map((p, i) => (
          <circle
            key={i}
            cx={40 + (p.t / 100) * 640}
            cy={260 - (p.brightness - 0.85) * 1000}
            r="6"
            fill="yellow"
            stroke="black"
            strokeWidth="1"
          />
        ))}

        {/* Click handler overlay */}
        {status === "pending" &&
          lightCurveData.map((p, i) => (
            <circle
              key={i}
              cx={40 + (p.t / 100) * 640}
              cy={260 - (p.brightness - 0.85) * 1000}
              r="6"
              opacity="0"
              onClick={() => handleClick(p)}
            />
          ))}
      </svg>

      {/* Controls */}
      <div className="text-center space-y-2">
        {status === "pending" && (
          <button
            onClick={handleSubmit}
            disabled={selected.length !== 3}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Confirm Selections
          </button>
        )}
        {status === "failure" && (
          <div>
            <p className="text-red-400 flex items-center justify-center gap-2">
              <XCircle /> Incorrect points selected. Try again!
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
            <CheckCircle /> Planet confirmed! Moving to next mission...
          </p>
        )}
      </div>
    </div>
  );
}
