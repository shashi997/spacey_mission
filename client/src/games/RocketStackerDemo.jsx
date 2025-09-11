// src/games/RocketStackerDemo.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Rocket } from "lucide-react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";

// Rocket parts list (order matters)
const partsList = ["Booster", "Second Stage", "Payload Fairing"];

export default function RocketStackerDemo({ node }) {
  const [stack, setStack] = useState([]);
  const [status, setStatus] = useState("pending"); // pending | correct | incorrect
  const timeoutRef = useRef(null);

  const handleGameComplete = useGameOutcomeHandler(node);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Outcomes from LessonBuilder
  const outcomes = useMemo(() => node.data.options || [], [node.data.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "success"),
    [outcomes]
  );
  const failureOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "failure"),
    [outcomes]
  );

  const handleAddPart = (part) => {
    if (status !== "pending") return;
    if (!stack.includes(part)) {
      setStack([...stack, part]);
    }
  };

  const handleSubmit = () => {
    if (status !== "pending") return;

    const correctOrder = ["Booster", "Second Stage", "Payload Fairing"];
    const isCorrect = JSON.stringify(stack) === JSON.stringify(correctOrder);

    if (isCorrect) {
      setStatus("correct");
      if (successOutcome) {
        timeoutRef.current = setTimeout(
          () => handleGameComplete(successOutcome),
          1500
        );
      } else {
        console.warn("No success outcome defined in lesson builder");
      }
    } else {
      setStatus("incorrect");
      if (failureOutcome) {
        timeoutRef.current = setTimeout(
          () => handleGameComplete(failureOutcome),
          1500
        );
      }
    }
  };

  const handleReset = () => {
    setStack([]);
    setStatus("pending");
  };

  // Rocket Part Components
  const RocketPart = ({ type }) => {
    switch (type) {
      case "Booster":
        return (
          <div className="w-28 h-24 bg-gradient-to-b from-orange-600 to-red-700 rounded-b-xl flex items-end justify-center relative">
            <div className="w-4 h-8 bg-yellow-400 rounded-full absolute -bottom-6 animate-pulse"></div>
            <span className="text-xs text-white mb-1">Booster</span>
          </div>
        );
      case "Second Stage":
        return (
          <div className="w-24 h-16 bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center">
            <span className="text-xs text-white">2nd Stage</span>
          </div>
        );
      case "Payload Fairing":
        return (
          <div className="w-20 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-full flex items-center justify-center">
            <span className="text-xs text-white">Payload</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
        <Rocket /> Rocket Stacker
      </h2>
      <p className="text-gray-300">
        Let’s assemble the launch vehicle for your satellite. <br />
        <span className="text-sm text-gray-400">
          Add the rocket parts in the correct order: Booster → Second Stage →
          Payload Fairing.
        </span>
      </p>

      {/* Parts to choose from */}
      <div className="flex gap-3 flex-wrap">
        {partsList.map((part) => (
          <button
            key={part}
            onClick={() => handleAddPart(part)}
            disabled={stack.includes(part) || status !== "pending"}
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

      {/* Rocket Assembly (Visual Stack) */}
      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 text-center min-h-[250px] flex flex-col items-center justify-end">
        {stack.length === 0 ? (
          <p className="text-gray-400 text-sm">No parts added yet</p>
        ) : (
        [...stack].reverse().map((part, idx) => <RocketPart key={idx} type={part} />) )}
      </div>

      {/* Controls / Feedback */}
      <div className="h-16 flex flex-col items-center justify-center space-y-2">
        {status === "pending" && (
          <button
            onClick={handleSubmit}
            disabled={stack.length !== partsList.length}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Confirm Stack
          </button>
        )}
        {status === "correct" && (
          <p className="text-green-400 flex items-center gap-2 text-lg">
            <CheckCircle /> Rocket assembled successfully! Ready for launch.
          </p>
        )}
        {status === "incorrect" && !failureOutcome && (
          <div className="text-center">
            <p className="text-red-400 flex items-center gap-2 text-lg">
              <XCircle /> Incorrect rocket stack! Try again.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}
        {status === "incorrect" && failureOutcome && (
          <p className="text-red-400 flex items-center gap-2 text-lg">
            <XCircle /> Incorrect build! Initiating alternate protocol…
          </p>
        )}
      </div>
    </div>
  );
}
