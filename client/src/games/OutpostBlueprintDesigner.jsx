// src/games/OutpostBlueprintDesigner.jsx
import React, { useState, useMemo } from "react";
import { useGameOutcomeHandler } from "../features/lesson-player/hooks/useGameOutcomeHandler";
import { CheckCircle, XCircle, RefreshCw, Layers } from "lucide-react";

const GRID_SIZE = 5;

const modules = [
  { id: "power", name: "⚡ Power Core", type: "power" },
  { id: "hab", name: "🏠 Crew Habitation", type: "hab" },
  { id: "lab", name: "🔬 Science Lab", type: "lab" },
  { id: "hydro", name: "🌱 Hydroponics Bay", type: "hydro" },
];

const initialGrid = () =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

export default function OutpostBlueprintDesigner({ node }) {
  const [grid, setGrid] = useState(initialGrid);
  const [selectedModule, setSelectedModule] = useState(null);
  const [status, setStatus] = useState("pending"); // pending | success | failure
  const [errorMessage, setErrorMessage] = useState("");

  const handleGameComplete = useGameOutcomeHandler(node);

  const outcomes = useMemo(() => node.data?.options || [], [node.data?.options]);
  const successOutcome = useMemo(
    () => outcomes.find((o) => o.text?.toLowerCase() === "success"),
    [outcomes]
  );

  const safeZone = { row: [1, 3], col: [1, 3] }; // 3x3 center area

  const handlePlaceModule = (r, c) => {
    if (!selectedModule || status !== "pending" || grid[r][c]) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = selectedModule;
    setGrid(newGrid);
    setSelectedModule(null);
  };

  const handleValidation = () => {
    if (status !== "pending") return;

    let powerPos = null;
    let habInsideSafeZone = true;
    const placedModules = grid.flat().filter(Boolean);
    const totalModules = placedModules.length;
    
    // Rule 1: Must have at least a Power Core and one other module.
    const hasPowerCore = placedModules.some(m => m.type === 'power');
    if (!hasPowerCore) {
      setStatus("failure");
      setErrorMessage("Blueprint is missing a Power Core.");
      return;
    }
     if (totalModules < 2) {
      setStatus("failure");
      setErrorMessage("Blueprint requires at least two connected modules.");
      return;
    }

    // Locate power core and validate habitation module placement
    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell?.type === "power") {
          powerPos = { r, c };
        }
        if (cell?.type === "hab") {
          const inSafe = r >= safeZone.row[0] && r <= safeZone.row[1] && c >= safeZone.col[0] && c <= safeZone.col[1];
          if (!inSafe) {
            habInsideSafeZone = false;
          }
        }
      });
    });

    // Rule 2: Habitation must be in the safe zone.
    if (!habInsideSafeZone) {
      setStatus("failure");
      setErrorMessage("Crew Habitation must be placed inside the green safe zone.");
      return;
    }
    
    // Rule 3: All modules must be connected (BFS traversal).
    const visited = new Set();
    const queue = [powerPos];
    visited.add(`${powerPos.r},${powerPos.c}`);

    while (queue.length > 0) {
      const { r, c } = queue.shift();
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        const key = `${nr},${nc}`;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc] && !visited.has(key)) {
          visited.add(key);
          queue.push({ r: nr, c: nc });
        }
      });
    }

    if (visited.size === totalModules) {
      setStatus("success");
      setErrorMessage("");
      if (successOutcome) {
         setTimeout(() => handleGameComplete(successOutcome), 1500);
      }
    } else {
      setStatus("failure");
      setErrorMessage("Not all modules are connected to the Power Core.");
    }
  };

  const handleRetry = () => {
    setGrid(initialGrid());
    setSelectedModule(null);
    setStatus("pending");
    setErrorMessage("");
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6 flex flex-col items-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-300">🏗️ Outpost Blueprint Designer</h2>
        <p className="text-gray-300 mt-2 max-w-md">
          Place modules on the grid. All must connect to the{" "}
          <span className="text-yellow-400 font-semibold">Power Core</span>, and Habitation modules
          must be in the <span className="text-green-400 font-semibold">safe zone</span>.
        </p>
      </div>

      {/* Module Picker */}
      <div className="flex gap-3 flex-wrap justify-center">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModule(m)}
            disabled={status !== 'pending'}
            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
              selectedModule?.id === m.id
                ? "border-yellow-400 bg-yellow-900/40 ring-2 ring-yellow-400"
                : "border-gray-600 bg-gray-700 hover:border-blue-400"
            } ${status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid border-2 border-gray-600 bg-gray-700"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gap: "2px",
          width: "320px",
          height: "320px",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const inSafeZone = r >= safeZone.row[0] && r <= safeZone.row[1] && c >= safeZone.col[0] && c <= safeZone.col[1];
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handlePlaceModule(r, c)}
                className={`flex items-center justify-center text-center p-1 rounded-sm text-xs font-mono transition-colors ${
                  cell
                    ? "bg-blue-600 text-white font-bold"
                    : inSafeZone
                    ? "bg-green-500/10 hover:bg-green-500/30"
                    : "bg-gray-800/50 hover:bg-gray-700/80"
                } ${status === 'pending' && !cell ? 'cursor-pointer' : ''}`}
              >
                {cell ? cell.name.split(" ")[0] : ""}
              </div>
            );
          })
        )}
      </div>

      {/* Controls & Status */}
      <div className="text-center h-16 flex flex-col items-center justify-center space-y-2">
        {status === "pending" && (
          <button
            onClick={handleValidation}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold flex items-center gap-2"
          >
            <Layers size={18} /> Validate Blueprint
          </button>
        )}
        {status === "failure" && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-400 flex items-center justify-center gap-2">
              <XCircle size={18} /> {errorMessage}
            </p>
            <button
              onClick={handleRetry}
              className="mt-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg flex items-center gap-2"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}
        {status === "success" && (
          <p className="text-green-400 flex items-center justify-center gap-2 text-lg">
            <CheckCircle /> Blueprint Validated! Design Approved.
          </p>
        )}
      </div>
    </div>
  );
}
