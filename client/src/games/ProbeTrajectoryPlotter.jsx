// src/games/ProbeTrajectoryPlotter.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, RefreshCw, Target } from "lucide-react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";

const GAME_WIDTH = 700;
const GAME_HEIGHT = 500;
const JUPITER_X = 400;
const JUPITER_Y = 250;
const JUPITER_RADIUS = 50;
const PROBE_RADIUS = 6;

export default function ProbeTrajectoryPlotter({ node }) {
  const [angle, setAngle] = useState(45);
  const [burn, setBurn] = useState(5);
  const [trajectory, setTrajectory] = useState([]);
  const [status, setStatus] = useState("pending");
  const canvasRef = useRef(null);

  const handleGameComplete = useGameOutcomeHandler(node);

  const outcomes = useMemo(() => node.data?.options || [], [node.data?.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "success"),
    [outcomes]
  );

  // --- Simulate trajectory for preview ---
  const simulateTrajectory = useCallback(() => {
    let path = [];
    let x = 100,
      y = GAME_HEIGHT / 2;
    let speed = burn * 2.5;
    let rad = (angle * Math.PI) / 180;

    let vx = Math.cos(rad) * speed;
    let vy = -Math.sin(rad) * speed;

    for (let t = 0; t < 400; t++) {
      let dx = JUPITER_X - x;
      let dy = JUPITER_Y - y;
      let distSq = dx * dx + dy * dy;
      if (distSq < 40000) {
        let dist = Math.sqrt(distSq);
        let force = 5000 / distSq;
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
      }

      x += vx;
      y += vy;
      path.push({ x, y });

      // Collision with Jupiter
      if (Math.sqrt((x - JUPITER_X) ** 2 + (y - JUPITER_Y) ** 2) < JUPITER_RADIUS) {
        break;
      }
    }

    setTrajectory(path);
  }, [angle, burn]);

  // --- Live preview of trajectory on slider changes ---
  useEffect(() => {
    simulateTrajectory();
  }, [angle, burn, simulateTrajectory]);

  // --- Draw probe + trajectory ---
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Jupiter
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(JUPITER_X, JUPITER_Y, JUPITER_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Trajectory preview
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.beginPath();
    trajectory.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Probe marker
    if (trajectory.length > 0) {
      let last = trajectory[trajectory.length - 1];
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(last.x, last.y, PROBE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [trajectory]);

  // --- Confirm trajectory ---
  const handleSubmit = () => {
    // Success range check
    const successAngleMin = 40;
    const successAngleMax = 50;
    const successBurnMin = 6;
    const successBurnMax = 8;

    const inSweetSpot =
      angle >= successAngleMin &&
      angle <= successAngleMax &&
      burn >= successBurnMin &&
      burn <= successBurnMax;

    if (inSweetSpot) {
      setStatus("success");
      if (successOutcome) handleGameComplete(successOutcome);
    } else {
      setStatus("failure");
    }
  };

  const handleRetry = () => {
    setTrajectory([]);
    setStatus("pending");
    simulateTrajectory();
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-300 flex items-center justify-center gap-2">
          <Target /> Probe Trajectory Plotter
        </h2>
        <p className="text-gray-300 mt-2">
          Adjust the <strong>launch angle</strong> and <strong>burn duration</strong> to sling-shot around{" "}
          <span className="text-orange-400">Jupiter</span> and escape into the interstellar trajectory.
        </p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border-2 border-gray-700 rounded w-full"
      />

      {/* Sliders */}
      {status === "pending" && (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          <label className="flex flex-col">
            Launch Angle: <span className="text-cyan-400">{angle}°</span>
            <input
              type="range"
              min="0"
              max="180"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col">
            Burn Duration: <span className="text-cyan-400">{burn}s</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={burn}
              onChange={(e) => setBurn(Number(e.target.value))}
            />
          </label>
        </div>
      )}

      {/* Controls & Status */}
      <div className="text-center space-y-2">
        {status === "pending" && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
          >
            ✅ Confirm Trajectory
          </button>
        )}
        {status === "failure" && (
          <div>
            <p className="text-red-400 flex items-center justify-center gap-2">
              <XCircle /> Trajectory failed! Probe missed or crashed.
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
            <CheckCircle /> Trajectory locked! Probe is on course.
          </p>
        )}
      </div>
    </div>
  );
}
