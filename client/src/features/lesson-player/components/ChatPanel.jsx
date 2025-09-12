import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useLessonStore } from '../hooks/useLessonStore';
import NarrationBlock from './NarrationBlock';
import ChoiceBlock from './ChoiceBlock';
import GameInteractionBlock from './GameInteractionBlock';
import AITriggerBlock from './AITriggerBlock';
import QuizBlock from './QuizBlock';
import DebriefBlock from './DebriefBlock';

// Map node types → components (include end-of-lesson aliases)
const nodeComponentMap = {
  narration: NarrationBlock,
  choice: ChoiceBlock,
  gameInteraction: GameInteractionBlock,
  aiTrigger: AITriggerBlock,
  quiz: QuizBlock,

  debrief: DebriefBlock,
  summary: DebriefBlock,
  missionComplete: DebriefBlock,
  end: DebriefBlock,
  result: DebriefBlock,
  finish: DebriefBlock,
};

const ChatPanel = () => {
  const history = useLessonStore((state) => state.history);
  const currentNode = useLessonStore((state) => state.currentNode);

  const [messages, setMessages] = useState([]);   // user-typed chat messages
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom on new history/messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), text: inputValue, sender: 'user' }]);
    setInputValue('');
    // send to AI service here if needed
  };

  const renderNodeContent = (node, isActive) => {
    if (!node) {
      return (
        <div className="text-center text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-2" />
          <p>AI Tutor Chat</p>
          <p className="text-sm">The lesson will begin shortly.</p>
        </div>
      );
    }

    const Component = nodeComponentMap[node.type];

    if (Component) {
      return <Component node={node} isActive={isActive} />;
    }

    // Fallback message if a new node type appears
    return (
      <div className="text-center text-gray-500">
        <p>Unsupported node type: {node.type}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-bold text-cyan-green mb-4">Chat Panel</h2>

      <div
        ref={chatContainerRef}
        className={`flex-grow flex flex-col space-y-4 overflow-y-auto p-2 ${
          history.length === 0 && !currentNode ? 'justify-center items-center' : 'justify-start'
        }`}
      >
        {/* Initial message before lesson starts */}
        {history.length === 0 && !currentNode && renderNodeContent(null, false)}

        {/* Lesson history */}
        {history.map((node, index) => (
          <div key={`${node.id}-${index}`} className="self-start w-full">
            {renderNodeContent(node, node.id === currentNode?.id)}
          </div>
        ))}

        {/* User messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="max-w-xs md:max-w-md p-3 rounded-xl bg-blue-600 text-white self-end"
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}  // onKeyPress → onKeyDown
          placeholder="Ask a question..."
          className="flex-grow p-2 rounded bg-gray-900/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-green"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 rounded-lg bg-cyan-green text-gray-900 hover:bg-cyan-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
