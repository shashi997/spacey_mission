import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatPanel = () => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-bold text-cyan-green mb-4">Chat Panel</h2>
      <div className="flex-grow flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto mb-2" />
          <p>AI Tutor Chat</p>
        </div>
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 rounded bg-gray-900/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-green"
        />
      </div>
    </div>
  );
};

export default ChatPanel;

