import React, { useState, useEffect } from "react";
import { GameRegistry } from "../../../games/index.js";

/**
 * The main panel that orchestrates the lesson flow. It renders different
 * types of nodes (narration, choices, games) based on the lesson data.
 * @param {object} props
 * @param {object} props.lesson - The lesson data object containing nodes.
 */
const InteractionPanel = ({ lesson }) => {
  const [currentNode, setCurrentNode] = useState(null);

  // Find the starting node (first "welcome" or just the first node)
  useEffect(() => {
    if (lesson?.nodes?.length > 0) {
      const start = lesson.nodes.find((n) => n.id === "welcome") || lesson.nodes[0];
      setCurrentNode(start);
    }
  }, [lesson]);

  // Handler to move to the next node in the lesson
  const handleNext = (nextId) => {
    if (!nextId) {
        console.warn("handleNext called with no nextId. End of branch?");
        return;
    };
    const nextNode = lesson.nodes.find((n) => n.id === nextId);
    if (nextNode) {
      setCurrentNode(nextNode);
    } else {
      console.warn("Node not found:", nextId);
    }
  };

  if (!lesson || !currentNode) {
    return (
      <div className="bg-black/40 p-6 rounded-lg h-full flex flex-col items-center justify-center">
        <p className="text-white/50">Loading lesson...</p>
      </div>
    );
  }

  // Renders the content based on the current node's type
  const renderNode = (node) => {
    switch (node.type) {
      case "narration":
        return (
          <div className="p-4 bg-slate-800 text-white rounded-lg max-w-prose text-center animate-fade-in">
            <p className="mb-4 text-lg">{node.data?.text}</p>
            {node.next && (
              <button
                onClick={() => handleNext(node.next)}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-2 rounded-lg"
              >
                Continue
              </button>
            )}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="p-4 bg-slate-800 text-white rounded-lg max-w-prose animate-fade-in">
            <p className="mb-4 text-lg text-center">{node.data?.prompt}</p>
            <div className="flex flex-col gap-3 items-center">
              {node.data?.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleNext(opt.next)}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white w-full md:w-auto md:min-w-[250px] px-4 py-2 rounded-lg"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        );

      case "gameInteraction": {
        const GameComponent = GameRegistry[node.data?.game_id];
        if (!GameComponent) {
          return (
            <div className="p-4 bg-red-900 text-white rounded-lg">
              <p>Error: Unknown game id '{node.data?.game_id}'</p>
            </div>
          );
        }
        // The game component receives props to display instructions,
        // configure its behavior, and a callback to signal completion.
        return (
          <GameComponent
            prompt={node.data?.prompt}
            config={node.data?.config}
            onComplete={handleNext}
          />
        );
      }

      default:
        return (
          <div className="p-4 bg-yellow-900 text-white rounded-lg">
            <p>Unsupported node type: {node.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-black/40 p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-cyan-300 mb-4 sr-only">Interaction Panel</h2>
      <div className="flex-grow flex items-center justify-center text-white">
        {renderNode(currentNode)}
      </div>
    </div>
  );
};

export default InteractionPanel;

