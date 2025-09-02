import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useLessonStore } from '../hooks/useLessonStore';
import NarrationBlock from './NarrationBlock';
import ChoiceBlock from './ChoiceBlock';

const ChatPanel = () => {
  const history = useLessonStore((state) => state.history);
  const currentNode = useLessonStore((state) => state.currentNode);
  const [messages, setMessages] = useState([]); // For user messages
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'user' }]);
      setInputValue('');
      // Here you would typically send the message to an AI service
    }
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

    switch (node.type) {
      case 'narration':
        return <NarrationBlock node={node} isActive={isActive} />;
      case 'choice':
        return <ChoiceBlock node={node} isActive={isActive} />;
      // TODO: Add cases for 'quiz', 'choice', etc.
      default:
        return (
          <div className="text-center text-gray-500">
            <p>Unsupported node type: {node.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-bold text-cyan-green mb-4">Chat Panel</h2>
      <div className="flex-grow flex flex-col justify-end space-y-4 overflow-y-auto">
        {/* Show initial message if the lesson hasn't started */}
        {history.length === 0 && !currentNode && renderNodeContent(null, false)}

        {/* Render lesson history */}
        {history.map((node) => (
          <div key={node.id} className="self-start w-full">
            {renderNodeContent(node, node.id === currentNode?.id)}
          </div>
        ))}

        {/* Render user messages */}
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 rounded-lg bg-blue-500/20 self-end">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
