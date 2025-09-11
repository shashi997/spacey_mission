import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Target, CheckCircle, XCircle, RefreshCw, ZapOff } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// --- Game Constants (Adjusted for SUPER EASY gameplay) ---
const GRAVITY = 0.0015; // Reduced from 0.0025 (slower fall)
const MAIN_THRUST = 0.012; // Increased from 0.01 for more power
const ROTATION_THRUST = 0.2;
const FUEL_START = 1000; // Increased from 750 for more fuel
const FUEL_CONSUMPTION_MAIN = 0.3; // Reduced for better fuel efficiency
const FUEL_CONSUMPTION_SIDE = 0.1;
const SAFE_LANDING_SPEED = 0.9; // Increased from 0.5 for a bigger margin of error
const GAME_WIDTH = 700;
const GAME_HEIGHT = 500;

// --- Initial Lander State ---
const getInitialState = () => ({
  x: GAME_WIDTH / 2,
  y: 50,
  vx: 0, // Set to 0 to remove initial horizontal drift
  vy: 0,
  angle: 0,
  fuel: FUEL_START,
  gameStatus: 'pending', // 'pending', 'landed', 'crashed', 'outOfFuel'
});

const LunarLanderDemo = ({ node }) => {
  const [landerState, setLanderState] = useState(getInitialState);
  const keysPressed = useRef({ up: false, left: false, right: false });
  const gameLoopRef = useRef();
  const timeoutRef = useRef(null);

  const handleGameComplete = useGameOutcomeHandler(node);

  // Memoize outcomes from lesson data for performance
  const outcomes = useMemo(() => node.data?.options || [], [node.data?.options]);
  const successOutcome = useMemo(() => outcomes.find(o => o.text?.toLowerCase() === 'success'), [outcomes]);
  // As there is no failure outcome in the node data, we will handle retry entirely within the game.

  // --- Game Over Handler ---
  const triggerGameOver = useCallback((status) => {
    setLanderState(prev => ({ ...prev, gameStatus: status }));

    if (status === 'landed') {
      if (successOutcome) {
        timeoutRef.current = setTimeout(() => handleGameComplete(successOutcome), 2000);
      } else {
        console.warn(`Landed, but no "success" outcome was defined in the lesson data.`);
      }
    }
  }, [handleGameComplete, successOutcome]);


  // --- Main Game Loop ---
  const gameLoop = useCallback(() => {
    setLanderState(prev => {
      if (prev.gameStatus !== 'pending') {
        cancelAnimationFrame(gameLoopRef.current);
        return prev;
      }

      let { x, y, vx, vy, angle, fuel } = prev;

      // --- Handle Inputs & Fuel ---
      let newFuel = fuel;
      if (fuel > 0) {
        if (keysPressed.current.up) {
          const angleRad = (angle - 90) * (Math.PI / 180); // Convert angle to radians
          vx += MAIN_THRUST * Math.cos(angleRad);
          vy += MAIN_THRUST * Math.sin(angleRad);
          newFuel -= FUEL_CONSUMPTION_MAIN;
        }
        if (keysPressed.current.left) {
          angle -= ROTATION_THRUST;
          newFuel -= FUEL_CONSUMPTION_SIDE;
        }
        if (keysPressed.current.right) {
          angle += ROTATION_THRUST;
          newFuel -= FUEL_CONSUMPTION_SIDE;
        }
      }

      // --- Apply Physics ---
      vy += GRAVITY;
      x += vx;
      y += vy;
      
      const finalFuel = Math.max(0, newFuel);

      // --- Check Collision & Win/Loss Conditions ---
      // Landing pad is from x=325 to x=475 (now wider)
      if (y >= GAME_HEIGHT - 50) {
         if (x > 325 && x < 475 && Math.abs(vy) < SAFE_LANDING_SPEED && Math.abs(vx) < SAFE_LANDING_SPEED && Math.abs(angle) < 10) { // Angle tolerance increased
            triggerGameOver('landed');
         } else {
            triggerGameOver('crashed');
         }
      }
      
      // Check wall collisions
      if (x < 25 || x > GAME_WIDTH - 25) {
        triggerGameOver('crashed');
      }

      if (finalFuel <= 0 && prev.fuel > 0) { // Only trigger once
        triggerGameOver('outOfFuel');
      }

      return { ...prev, x, y, vx, vy, angle, fuel: finalFuel };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [triggerGameOver]);

  // --- Keyboard Event Listeners ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') keysPressed.current.up = true;
      if (e.key === 'ArrowLeft') keysPressed.current.left = true;
      if (e.key === 'ArrowRight') keysPressed.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') keysPressed.current.up = false;
      if (e.key === 'ArrowLeft') keysPressed.current.left = false;
      if (e.key === 'ArrowRight') keysPressed.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(gameLoopRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [gameLoop]);

  // --- Retry Handler ---
  const handleRetry = () => {
    keysPressed.current = { up: false, left: false, right: false };
    setLanderState(getInitialState());
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const { x, y, vx, vy, angle, fuel, gameStatus } = landerState;
  
  // --- Message Overlay Logic ---
  const getOverlay = () => {
    switch(gameStatus) {
      case 'landed':
        return <div className="text-center"><CheckCircle size={48} className="mx-auto text-green-400" /><h4 className="text-2xl font-bold mt-2">The Eagle has landed!</h4><p>Mission Success.</p></div>;
      case 'crashed':
        return <div className="text-center"><XCircle size={48} className="mx-auto text-red-400" /><h4 className="text-2xl font-bold mt-2">Mission Failure</h4><p>You've crashed the lander.</p></div>;
      case 'outOfFuel':
        return <div className="text-center"><ZapOff size={48} className="mx-auto text-yellow-400" /><h4 className="text-2xl font-bold mt-2">Out of Fuel</h4><p>You're adrift in space.</p></div>;
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-4xl bg-gray-900 rounded-lg p-4 flex flex-col items-center gap-4 text-white font-mono">
      {/* Narration and Instructions */}
      <div className="w-full text-center">
          <h3 className="text-xl font-bold text-cyan-300">Interactive Demo: Lunar Lander</h3>
          <p className="text-sm text-gray-400 italic">“This is it, Cadet. The most challenging part of any mission.”</p>
          <p className="text-xs text-gray-500 mt-1">Use the arrow keys to control your thrusters. Land gently in the target zone.</p>
      </div>
      
      {/* Game Canvas */}
      <div className="relative bg-black border-2 border-gray-700 overflow-hidden" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {/* Lander SVG - Increased Size */}
        <div style={{ position: 'absolute', left: x-25, top: y-25, width: 50, height: 50, transform: `rotate(${angle}deg)` }}>
            {/* Main Thruster Flame - Increased Size */}
            {keysPressed.current.up && fuel > 0 && <div className="absolute top-full left-1/2 -translate-x-1/2 w-6 h-12 bg-gradient-to-t from-orange-400 to-yellow-200 rounded-b-full" />}
            {/* Lander Body */}
            <svg viewBox="0 0 24 24" fill="#ccc"><path d="M12 2L2 22h20L12 2zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
        </div>

        {/* Terrain SVG - Wider landing pad */}
        <svg className="absolute bottom-0 left-0" width={GAME_WIDTH} height="50">
            <path d="M0 40 L100 20 L200 45 L325 45 L325 30 L475 30 L475 45 L600 25 L700 40 Z" stroke="#888" strokeWidth="2" fill="#555" />
            {/* Landing Pad */}
            <rect x="325" y="30" width="150" height="5" fill="cyan" />
        </svg>

        {/* Game Over Overlay */}
        {gameStatus !== 'pending' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                {getOverlay()}
                {(gameStatus === 'crashed' || gameStatus === 'outOfFuel') && (
                  <button onClick={handleRetry} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                    <RefreshCw size={16} /> Try Again
                  </button>
                )}
            </div>
        )}
      </div>

      {/* HUD (Heads-Up Display) */}
      <div className="w-full grid grid-cols-4 gap-4 text-center text-sm">
        <div>Fuel: <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-green-500 h-4 rounded-full" style={{width: `${(fuel / FUEL_START) * 100}%`}}></div></div></div>
        <div className={Math.abs(vy) > SAFE_LANDING_SPEED ? 'text-red-400' : 'text-green-400'}>Vert. Speed: {Math.abs(vy * 10).toFixed(2)} m/s</div>
        <div className={Math.abs(vx) > SAFE_LANDING_SPEED ? 'text-red-400' : 'text-green-400'}>Horiz. Speed: {Math.abs(vx * 10).toFixed(2)} m/s</div>
        <div>Altitude: {Math.max(0, (GAME_HEIGHT - 50 - y)).toFixed(0)} m</div>
      </div>
    </div>
  );
};

export default LunarLanderDemo;
