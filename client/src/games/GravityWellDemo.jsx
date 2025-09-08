// src/games/GravityWellDemo.jsx
import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";

// Earth mesh
function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
}

// Satellite mesh that orbits
function Satellite({ speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const radius = 3;
    ref.current.position.x = Math.cos(t * speed) * radius;
    ref.current.position.z = Math.sin(t * speed) * radius;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

const GravityWellDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = node.data.options || [];
  const successOutcome = outcomes.find(
    (o) => o.text?.toLowerCase() === "success"
  );

  const [speed, setSpeed] = useState(0.5);
  const [status, setStatus] = useState("pending"); // 'pending', 'correct', 'incorrect'

  const checkOrbit = () => {
    // Goldilocks zone
    if (speed > 0.9 && speed < 1.1) {
      setStatus("correct");
      if (successOutcome) {
        setTimeout(() => handleGameComplete(successOutcome), 1500);
      }
    } else {
      setStatus("incorrect");
    }
  };

  const retry = () => {
    setSpeed(0.5);
    setStatus("pending");
  };

  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-lg p-6 flex flex-col items-center gap-6 text-white font-sans">
      <h3 className="text-2xl font-bold text-yellow-400">
        🚀 Gravity Well Challenge
      </h3>
      <p className="text-center text-sm text-gray-400">
        Use the slider to set your satellite’s launch speed.
        <br />
        Too slow → crash 🌍 Too fast → escape 🌌
      </p>

      {/* 3D Scene */}
      <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 4, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Earth />
          <Satellite speed={speed} />
          <OrbitControls />
        </Canvas>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.01"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        className="w-full"
      />
      <p className="text-sm text-gray-400">
        Launch Speed: {speed.toFixed(2)}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {status === "pending" && (
          <button
            onClick={checkOrbit}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold"
          >
            Check Orbit
          </button>
        )}
        {status === "incorrect" && (
          <button
            onClick={retry}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
          >
            <RefreshCw size={16} /> Retry
          </button>
        )}
      </div>

      {/* Status messages */}
      <div className="h-8 text-lg mt-2">
        {status === "correct" && (
          <p className="text-green-400 flex items-center gap-2">
            <CheckCircle /> Perfect orbit achieved!
          </p>
        )}
        {status === "incorrect" && (
          <p className="text-red-400 flex items-center gap-2">
            <XCircle /> Orbit failed! Adjust speed.
          </p>
        )}
      </div>
    </div>
  );
};

export default GravityWellDemo;
