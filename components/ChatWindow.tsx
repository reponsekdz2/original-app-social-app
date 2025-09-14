import React, { useState, useEffect, useRef } from 'react';
// Fix: Use Message interface directly, remove alias to avoid name collision.
import type { Conversation, User, Message } from '../types';
import Icon from './Icon';
import MessageComponent from '../Message';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  currentUser: User;
  conversation: Conversation;
  onSendMessage: (content: string, type: 'text' | 'image' | 'voice', replyTo?: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, conversation, onSendMessage, onDeleteMessage, onReact }) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id)!;
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };
  
  const handleSend = (content: string, type: 'text' | 'image' | 'voice') => {
    onSendMessage(content, type, replyingTo || undefined);
    setReplyingTo(null);
  };
  
  const lastUserMessage = [...conversation.messages].reverse().find(m => m.senderId === currentUser.id);
  const isSeen = lastUserMessage && conversation.lastMessageSeenId === lastUserMessage.id;


  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={otherParticipant.avatar} alt={otherParticipant.username} className="w-10 h-10 rounded-full" />
             {otherParticipant.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>}
          </div>
          <div>
            <p className="font-semibold">{otherParticipant.username}</p>
             {conversation.typingUserIds?.includes(otherParticipant.id) && <p className="text-xs text-red-400 animate-pulse">typing...</p>}
          </div>
        </div>
        {/* Header icons can go here */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(message => (
          <MessageComponent
            key={message.id}
            message={message}
            currentUser={currentUser}
            participants={conversation.participants}
            onReply={handleReply}
            onDelete={onDeleteMessage}
            onReact={(emoji) => onReact(message.id, emoji)}
          />
        ))}
        {isSeen && (
          <div className="text-right text-xs text-gray-500 mr-4">Seen</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800">
        <MessageInput
          onSend={handleSend}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          participants={conversation.participants}
        />
      </div>
    </div>
  );
};

export default ChatWindow;