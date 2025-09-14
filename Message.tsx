import React, { useState } from 'react';
// Fix: Use Message interface directly, remove alias to avoid name collision.
import type { Message, User, Reaction } from './types';
import Icon from './components/Icon';

interface MessageProps {
  message: Message;
  currentUser: User;
  participants: User[];
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onReact: (emoji: string) => void;
}

const ReactionPill: React.FC<{ reaction: Reaction, count: number }> = ({ reaction, count }) => (
    <div className="bg-gray-700 rounded-full px-2 py-0.5 text-xs flex items-center">
        {reaction.emoji} <span className="ml-1">{count > 1 ? count : ''}</span>
    </div>
);

const Reactions: React.FC<{ reactions: Reaction[], currentUser: User }> = ({ reactions, currentUser }) => {
    if (reactions.length === 0) return null;
    
    // Fix: Explicitly type the accumulator in the reduce function to prevent type errors.
    const groupedReactions = reactions.reduce((acc: Record<string, number>, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="absolute -bottom-3 flex space-x-1">
             {Object.entries(groupedReactions).map(([emoji, count]) => {
                 const reaction = reactions.find(r => r.emoji === emoji)!;
                 return <ReactionPill key={emoji} reaction={reaction} count={count} />
             })}
        </div>
    )
}

const MessageComponent: React.FC<MessageProps> = ({ message, currentUser, participants, onReply, onDelete, onReact }) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const isSentByCurrentUser = message.senderId === currentUser.id;
  const sender = participants.find(p => p.id === message.senderId);

  const availableReactions = ['❤️', '👍', '😂', '😢', '😮', '😡'];

  const handleReaction = (emoji: string) => {
      onReact(emoji);
      setShowReactionPicker(false);
  }

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return <img src={message.content} alt="Sent image" className="rounded-lg max-w-xs" />;
      case 'voice':
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5" /></Icon>
            <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
            <span className="text-xs text-gray-400">0:15</span>
          </div>
        );
      case 'text':
      default:
        return <p>{message.content}</p>;
    }
  };
  
  const ReplyContent: React.FC<{ message: Message }> = ({ message }) => {
    const repliedSender = participants.find(p => p.id === message.senderId);
    return (
      <div className="p-2 rounded-lg bg-black/20 border-l-2 border-red-500 mb-2">
        <p className="text-xs font-semibold">{repliedSender?.username}</p>
        <p className="text-sm text-gray-300 opacity-80 truncate">{message.type === 'text' ? message.content : `An ${message.type}`}</p>
      </div>
    )
  }

  return (
    <div className={`flex items-end gap-2 group ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isSentByCurrentUser && <img src={sender?.avatar} alt={sender?.username} className="w-8 h-8 rounded-full self-start"/>}
      
      <div 
        className={`relative max-w-md rounded-2xl px-3 py-2 ${isSentByCurrentUser ? 'bg-red-600 rounded-br-md' : 'bg-gray-800 rounded-bl-md'}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {setShowActions(false); setShowReactionPicker(false);}}
      >
        {message.replyTo && <ReplyContent message={message.replyTo} />}
        {renderContent()}

        {showActions && (
            <div className={`absolute top-0 flex items-center bg-gray-900 rounded-full p-1 shadow-lg border border-gray-700 -translate-y-1/2 ${isSentByCurrentUser ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}>
                <button onClick={() => setShowReactionPicker(true)} className="p-1 hover:bg-gray-700 rounded-full"><Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0 4.5 4.5 0 010-6.364l6.364-6.364a4.5 4.5 0 016.364 6.364l-6.364 6.364a.75.75 0 01-1.06 0l-2.829-2.828a.75.75 0 011.06-1.06l2.829 2.828a3 3 0 004.242 0 3 3 0 000-4.242l-6.364-6.364a3 3 0 00-4.242 0 3 3 0 000 4.242l6.364 6.364" /></Icon></button>
                <button onClick={() => onReply(message)} className="p-1 hover:bg-gray-700 rounded-full"><Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></Icon></button>
                {isSentByCurrentUser && <button onClick={() => onDelete(message.id)} className="p-1 hover:bg-gray-700 rounded-full"><Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon></button>}
            </div>
        )}

        {showReactionPicker && (
            <div className={`absolute top-0 p-1 flex items-center space-x-1 bg-gray-900 rounded-full shadow-lg border border-gray-700 -translate-y-full -mt-2 ${isSentByCurrentUser ? 'left-0' : 'right-0'}`}>
                {availableReactions.map(emoji => (
                    <button key={emoji} onClick={() => handleReaction(emoji)} className="p-1 text-xl hover:scale-125 transition-transform">{emoji}</button>
                ))}
            </div>
        )}
        
        <Reactions reactions={message.reactions} currentUser={currentUser}/>
      </div>
    </div>
  );
};

export default MessageComponent;