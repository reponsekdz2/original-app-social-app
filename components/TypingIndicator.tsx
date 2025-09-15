import React from 'react';
import type { User } from '../types.ts';

interface TypingIndicatorProps {
  user: User;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ user }) => {
  return (
    <div className="flex items-end space-x-2">
      <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full" />
      <div className="bg-gray-700 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
