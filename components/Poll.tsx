
import React from 'react';
// Fix: Add .ts extension to types import
import type { Poll as PollType } from '../types.ts';
import Icon from './Icon.tsx';

interface PollProps {
  poll: PollType;
  onVote: (optionId: number) => void;
}

const Poll: React.FC<PollProps> = ({ poll, onVote }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const userHasVoted = poll.userVote !== null;

  return (
    <div className="border border-gray-700 rounded-lg p-4 space-y-3">
      <p className="font-semibold">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map(option => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isUserChoice = poll.userVote === option.id;

          return userHasVoted ? (
            <div key={option.id} className="relative w-full bg-gray-700/50 rounded-md p-2 text-sm">
                <div 
                    className="absolute top-0 left-0 h-full bg-red-500/30 rounded-md transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
                <div className="relative flex justify-between items-center font-semibold">
                    <span>{option.text} {isUserChoice && <Icon className="w-4 h-4 inline-block ml-1 text-white"><path d="M4.5 12.75l6 6 9-13.5" /></Icon>}</span>
                    <span>{percentage.toFixed(0)}%</span>
                </div>
            </div>
          ) : (
             <button 
                key={option.id}
                onClick={() => onVote(option.id)}
                className="w-full text-left bg-gray-800 border border-gray-700 rounded-md p-2 text-sm font-semibold hover:border-red-500 transition-colors"
             >
                {option.text}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">{totalVotes.toLocaleString()} votes</p>
    </div>
  );
};

export default Poll;