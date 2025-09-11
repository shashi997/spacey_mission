import React, { useState, useEffect, useRef } from 'react';
import { Sun, Battery, CheckCircle, Eye, HardDrive } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// typewriter effect 
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    setDisplayText(''); // Always start fresh for the new line
    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => clearInterval(typingInterval);
    }
  }, [text, speed]);
  return displayText;
};

const SystemNode = ({ status, onClick, isChecking, icon, label, position }) => {
  const isDisabled = status !== 'idle' || isChecking;
  const baseClasses = "relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 text-white shadow-lg border-2 backdrop-blur-sm transform-gpu";
  const statusClasses = {
    idle: `bg-black/20 border-cyan-400/30 hover:border-cyan-400/80 hover:scale-105 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`,
    checking: 'bg-yellow-500/20 border-yellow-500/50 animate-pulse',
    checked: 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.5)]',
  };
  return (
    <div className={`absolute ${position} flex flex-col items-center gap-3 group`}>
      <button onClick={onClick} disabled={isDisabled} className={`${baseClasses} ${statusClasses[status]}`}>
        {icon}
        {status === 'checked' && <CheckCircle size={32} className="absolute z-10 text-green-400" />}
      </button>
      <span className={`text-sm font-bold tracking-wider transition-colors duration-300 ${status === 'checked' ? 'text-green-300' : 'text-cyan-300'} group-hover:text-white`}>{label}</span>
    </div>
  );
};

const LogLine = ({ entry, isLast }) => {
  const textToDisplay = isLast ? useTypewriter(entry.text, 20) : entry.text;
  const colors = {
    system: 'text-fuchsia-400',
    info: 'text-yellow-400',
    checked: 'text-green-400',
    success: 'text-cyan-300 font-bold',
  };
  return <p><span className="text-gray-500 mr-2">&gt;</span><span className={colors[entry.type]}>{textToDisplay}</span></p>;
};

const SystemCheckDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = node?.data?.options || [];
  const successOutcome = outcomes.find(o => o.text?.toLowerCase() === 'success');

  const [statuses, setStatuses] = useState({ solar: 'idle', rtg: 'idle' });
  const [isBooted, setIsBooted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentlyChecking, setCurrentlyChecking] = useState(null);
  const [logEntries, setLogEntries] = useState([]);
  const logRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes tracer1 { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
      @keyframes tracer2 { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
      .run-tracer-1 { animation: tracer1 1.5s ease-in-out forwards; }
      .run-tracer-2 { animation: tracer2 1.5s ease-in-out forwards; }
      @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      .fade-in { animation: fadeIn 1s ease-out forwards; }
      .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      @keyframes blink { 50% { opacity: 0; } }
      .blinking-cursor { animation: blink 1s step-end infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars = [];
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          alpha: Math.random(),
          dy: Math.random() * 0.2 + 0.1,
        });
      }
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.globalAlpha = star.alpha;
        ctx.fill();
        star.y += star.dy;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Boot sequence effect
  useEffect(() => {
    if (!isBooted) {
      setIsBooted(true);
      // Simple boot sequence
      setTimeout(() => setLogEntries([{ type: 'system', text: 'ARES-X Diagnostic v2.4.1' }]), 300);
      setTimeout(() => setLogEntries(prev => [...prev, { type: 'system', text: 'Systems online.' }]), 800);
      setTimeout(() => setLogEntries(prev => [...prev, { type: 'info', text: 'Click systems to run diagnostics.' }]), 1300);
    }
  }, [isBooted]);

  // Auto-scroll effect
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);

  useEffect(() => {
    console.log(' Completion effect running - Current statuses:', statuses);
    console.log(' isComplete:', isComplete);
    
    const allChecked = statuses.solar === 'checked' && statuses.rtg === 'checked';
    console.log(' All systems checked?', allChecked);
    
    if (allChecked && !isComplete) {
      console.log(' GAME COMPLETION TRIGGERED!');
      setIsComplete(true); 
      // Mission ready sequence
      setTimeout(() => setLogEntries(prev => [...prev, { type: 'success', text: '>> ALL SYSTEMS NOMINAL <<' }]), 500);
      setTimeout(() => setLogEntries(prev => [...prev, { type: 'success', text: 'ARES-X: MISSION READY' }]), 800);
      const completionTimeout = setTimeout(() => {
        console.log('SystemCheckDemo: About to complete game');
        console.log('SystemCheckDemo: Available outcomes:', outcomes);
        console.log('SystemCheckDemo: Success outcome:', successOutcome);
        if (successOutcome) {
          console.log('SystemCheckDemo: Calling handleGameComplete with:', successOutcome);
          handleGameComplete(successOutcome);
        } else {
          console.warn('SystemCheckDemo: No success outcome found in:', outcomes);
          // Fallback: try the first outcome if available
          if (outcomes.length > 0) {
            console.log('SystemCheckDemo: Using fallback outcome:', outcomes[0]);
            handleGameComplete(outcomes[0]);
          }
        }
      }, 3000);
    } else {
      console.log(' Not triggering completion - allChecked:', allChecked, 'isComplete:', isComplete);
    }
  }, [statuses, isComplete, handleGameComplete, successOutcome]);

  const handleSystemCheck = (system) => {
    console.log(`🔧 handleSystemCheck called for: ${system}`);
    console.log(`🔧 Current status for ${system}:`, statuses[system]);
    console.log(`🔧 Currently checking:`, currentlyChecking);
    
    if (statuses[system] !== 'idle' || currentlyChecking) {
      console.log(`🔧 Blocked: status=${statuses[system]}, checking=${currentlyChecking}`);
      return;
    }
    
    console.log(`🔧 Starting check for ${system}`);
    setCurrentlyChecking(system);
    setStatuses(prev => {
      const newStatuses = { ...prev, [system]: 'checking' };
      console.log(`🔧 Setting ${system} to checking, new statuses:`, newStatuses);
      return newStatuses;
    });
    // Add detailed diagnostic sequence
    const diagnosticMessages = {
      solar: [
        { type: 'info', text: 'Checking solar array...' },
        { type: 'system', text: 'Testing panels...' },
        { type: 'system', text: 'Checking batteries...' }
      ],
      rtg: [
        { type: 'info', text: 'Checking RTG unit...' },
        { type: 'system', text: 'Testing thermal output...' },
        { type: 'system', text: 'Verifying containment...' }
      ]
    };
    
    // Add messages with delays for realism
    diagnosticMessages[system].forEach((msg, index) => {
      setTimeout(() => {
        setLogEntries(prev => [...prev, { ...msg, id: `${system}-diag-${index}` }]);
      }, index * 500);
    });
    
    setTimeout(() => {
      console.log(`🔧 Completing check for ${system}`);
      setStatuses(prev => {
        const newStatuses = { ...prev, [system]: 'checked' };
        console.log(`🔧 Setting ${system} to checked, new statuses:`, newStatuses);
        return newStatuses;
      });
      setCurrentlyChecking(null);
      // Enhanced completion messages
      const completionMessages = {
        solar: [
          { type: 'checked', text: '✓ Solar Array: ONLINE' },
          { type: 'checked', text: '✓ Output: 4.2 kW' }
        ],
        rtg: [
          { type: 'checked', text: '✓ RTG Unit: STANDBY' },
          { type: 'checked', text: '✓ Output: 2.8 kW' }
        ]
      };
      
      completionMessages[system].forEach((msg, index) => {
        setTimeout(() => {
          setLogEntries(prev => [...prev, { ...msg, id: `${system}-complete-${index}` }]);
        }, index * 300);
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full bg-black rounded-lg flex items-center justify-center text-white font-sans select-none overflow-hidden relative">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-50"></canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900 z-10"></div>

      <div className="w-full h-full flex flex-col items-center justify-between gap-4 z-20 p-8">
        <div className="text-center fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-3xl font-bold text-cyan-300 flex items-center justify-center gap-3 tracking-widest">
            <Eye />ARES-X DIAGNOSTICS
          </h3>
        </div>

        <div className="relative w-full h-56 flex items-center justify-center fade-in" style={{ animationDelay: '400ms' }}>
          <svg className="absolute w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="xMidYMid meet">
            <path id="path1" d="M 50 50 C 175 0, 275 0, 300 50" stroke="#0891b2" strokeOpacity="0.3" strokeWidth="2" fill="none" />
            <path id="path2" d="M 550 50 C 425 100, 325 100, 300 50" stroke="#0891b2" strokeOpacity="0.3" strokeWidth="2" fill="none" />
            <circle r="4" fill="#facc15" className={statuses.solar === 'checking' ? 'run-tracer-1' : ''} style={{ offsetPath: "path('M 50 50 C 175 0, 275 0, 300 50')" }} />
            <circle r="4" fill="#60a5fa" className={statuses.rtg === 'checking' ? 'run-tracer-2' : ''} style={{ offsetPath: "path('M 550 50 C 425 100, 325 100, 300 50')" }} />
          </svg>

          <SystemNode status={statuses.solar} onClick={() => handleSystemCheck('solar')} isChecking={!!currentlyChecking} icon={<Sun size={40} />} label="SOLAR ARRAY" position="left-[5%] top-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <HardDrive size={48} className={`transition-colors duration-500 ${(statuses.solar === 'checked' || statuses.rtg === 'checked') ? 'text-cyan-400' : 'text-gray-500'}`} />
            <span className="text-xs font-bold text-gray-400 mt-2">CORE</span>
          </div>
          <SystemNode status={statuses.rtg} onClick={() => handleSystemCheck('rtg')} isChecking={!!currentlyChecking} icon={<Battery size={40} />} label="RTG POWER" position="right-[5%] top-1/2 -translate-y-1/2" />
        </div>

        <div ref={logRef} className="w-full max-w-3xl h-52 bg-black/50 rounded-lg border border-cyan-400/20 p-4 font-mono text-sm backdrop-blur-sm overflow-y-auto fade-in" style={{ animationDelay: '600ms' }}>
          {logEntries.map((entry, index) => (
            <div key={index} className="fade-in-up">
              <LogLine entry={entry} isLast={index === logEntries.length - 1 && !isComplete} />
            </div>
          ))}
          {!currentlyChecking && isBooted && <div className="blinking-cursor w-2 h-4 bg-cyan-300"></div>}
        </div>
      </div>
    </div>
  );
};

export default SystemCheckDemo;