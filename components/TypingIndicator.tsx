import React from 'react';
import type { User } from '../types.ts';

interface TypingIndicatorProps {
  user: User;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ user }) => {
  return (
    <div className="flex items-end space-x-2">
      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
      <div className="bg-gray-700 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-1">
          <style>{`
            .bounce-1 { animation-delay: 0s; }
            .bounce-2 { animation-delay: 0.2s; }
            .bounce-3 { animation-delay: 0.4s; }
          `}</style>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce bounce-1"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce bounce-2"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce bounce-3"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
