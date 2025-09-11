// src/games/CrewSelectionDemo.jsx
import React, { useState, useMemo } from "react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";
import { CheckCircle, UserCheck } from "lucide-react";

const candidates = [
  {
    id: "eng1",
    role: "Engineer",
    name: "Dr. Morgan Steele",
    trait: "Cautious",
    strength: "Builds stronger, more reliable modules",
    weakness: "Takes more time and resources",
  },
  {
    id: "eng2",
    role: "Engineer",
    name: "Lt. Kira Tan",
    trait: "Daring",
    strength: "Fast construction and improvisation",
    weakness: "Higher risk of system failure",
  },
  {
    id: "bio1",
    role: "Biologist",
    name: "Dr. Arun Patel",
    trait: "Analytical",
    strength: "Thorough experiments with accurate data",
    weakness: "Slower progress on urgent tasks",
  },
  {
    id: "bio2",
    role: "Biologist",
    name: "Dr. Lila Navarro",
    trait: "Innovative",
    strength: "Creative solutions to biological challenges",
    weakness: "Unpredictable outcomes, sometimes unstable",
  },
  {
    id: "pilot1",
    role: "Pilot",
    name: "Cmdr. Jace Rowan",
    trait: "Precise",
    strength: "Flawless maneuvers under pressure",
    weakness: "Conservative fuel use limits bold maneuvers",
  },
  {
    id: "pilot2",
    role: "Pilot",
    name: "Ava Chen",
    trait: "Bold",
    strength: "Takes daring risks that can pay off big",
    weakness: "Higher chance of critical mistakes",
  },
];

export default function CrewSelectionDemo({ node }) {
  const [selected, setSelected] = useState({
    Engineer: null,
    Biologist: null,
    Pilot: null,
  });
  const [status, setStatus] = useState("pending"); // pending | success

  const handleGameComplete = useGameOutcomeHandler(node);

  const outcomes = useMemo(() => node.data?.options || [], [node.data?.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "success"),
    [outcomes]
  );

  const handleSelect = (role, id) => {
    if (status !== "pending") return;
    setSelected((prev) => ({ ...prev, [role]: id }));
  };

  const isComplete = Object.values(selected).every((val) => val !== null);

  const handleSubmit = () => {
    if (isComplete && status === "pending") {
      setStatus("success");
      if (successOutcome) {
        // Delay allows user to see the success message before advancing
        setTimeout(() => handleGameComplete(successOutcome), 1500);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-300">👩‍🚀 Crew Selection</h2>
        <p className="text-gray-300 mt-2">
          A commander is only as good as their crew. Choose one Chief Engineer,
          one Head Biologist, and one Lead Pilot.
        </p>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelect(c.role, c.id)}
            className={`p-4 rounded-xl border transition ${
              selected[c.role] === c.id
                ? "border-green-500 bg-green-800/40 ring-2 ring-green-500"
                : "border-gray-600 hover:border-blue-500 bg-gray-800"
            } ${status !== 'pending' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          >
            <h3 className="font-semibold text-lg">{c.name}</h3>
            <p className="text-sm text-gray-400">
              {c.role} • {c.trait}
            </p>
            <ul className="mt-2 text-sm space-y-1">
              <li>
                <span className="text-green-400">+ </span>
                {c.strength}
              </li>
              <li>
                <span className="text-red-400">− </span>
                {c.weakness}
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Controls & Status */}
      <div className="text-center h-12 flex items-center justify-center">
        {status === "pending" && (
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              isComplete
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <UserCheck size={18} /> Confirm Crew
          </button>
        )}
        {status === "success" && (
          <p className="text-green-400 flex items-center justify-center gap-2 text-lg">
            <CheckCircle /> Crew assembled! Your senior staff is ready.
          </p>
        )}
      </div>
    </div>
  );
}