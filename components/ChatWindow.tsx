

import React, { useState, useEffect, useRef } from 'react';
// Fix: Corrected import path for types to be relative.
import type { Conversation, User, Message } from '../types.ts';
import Icon from './Icon.tsx';
// Fix: Change import type to a value import for the component.
import MessageComponent from '../Message.tsx';
import MessageInput from './MessageInput.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import { socketService } from '../services/socketService.ts';
import ChatSettingsPanel from './ChatSettingsPanel.tsx';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  // Fix: Update onSendMessage prop to handle File objects for attachments.
  onSendMessage: (content: string | File, type: Message['type']) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
  onInitiateCall: (user: User) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage, onBack, onViewProfile, onInitiateCall }) => {
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState(conversation.messages);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleTyping = ({ conversationId }: { conversationId: string }) => {
        if (conversationId === conversation.id) setIsTyping(true);
    };
    const handleStopTyping = ({ conversationId }: { conversationId: string }) => {
        if (conversationId === conversation.id) setIsTyping(false);
    };
    
    socketService.on('typing', handleTyping);
    socketService.on('stop_typing', handleStopTyping);

    return () => {
        socketService.off('typing', handleTyping);
        socketService.off('stop_typing', handleStopTyping);
    };
  }, [conversation.id]);
  
  const handleAddReaction = (messageId: string, emoji: string) => {
    // Optimistic update for reactions
    setMessages(currentMessages => currentMessages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.user.id === currentUser.id);
        if (existingReaction && existingReaction.emoji === emoji) {
          // User clicked the same emoji again, remove reaction
          return { ...msg, reactions: msg.reactions?.filter(r => r.user.id !== currentUser.id) };
        } else {
          // Add or update reaction
          const otherReactions = msg.reactions?.filter(r => r.user.id !== currentUser.id) || [];
          const newReaction = { emoji, user: currentUser };
          return { ...msg, reactions: [...otherReactions, newReaction] };
        }
      }
      return msg;
    }));
    // In a real app, you would also call an API to persist this change.
  };

  if (!otherUser) {
    return <div className="flex items-center justify-center h-full">Error: Conversation is invalid.</div>;
  }
  
  const handleUpdateUserRelationship = () => { /* Placeholder */ };
  const handleReport = () => { /* Placeholder */ };
  // Fix: Add a placeholder handler for onUpdateSettings to satisfy the prop requirement.
  const handleUpdateSettings = () => { /* Placeholder for updating chat settings */ };

  return (
    <div className="flex flex-col h-full relative">
      <header className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
          </button>
          <img src={otherUser.avatar} alt={otherUser.username} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onViewProfile(otherUser)} />
          <div>
            <p className="font-semibold flex items-center gap-1.5 cursor-pointer" onClick={() => onViewProfile(otherUser)}>{otherUser.username} {otherUser.isVerified && <VerifiedBadge className="w-3 h-3"/>}</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onInitiateCall(otherUser)} className="p-2 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon>
          </button>
          <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></Icon>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => {
          const sender = conversation.participants.find(p => p.id === message.senderId);
          if (!sender) return null;
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
          const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
          return (
            <MessageComponent
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser.id}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              sender={sender}
              onReply={() => setReplyingTo(message)}
              onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
              isVanishMode={conversation.settings.vanish_mode_enabled}
            />
          );
        })}
        {isTyping && <TypingIndicator user={otherUser} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3">
        <MessageInput 
            onSend={onSendMessage}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            conversationId={conversation.id}
            otherUser={otherUser}
        />
      </div>

      {isSettingsOpen && (
        <ChatSettingsPanel 
            // Fix: Pass `conversation` prop instead of `user` and add `onUpdateSettings`.
            conversation={conversation}
            currentUser={currentUser}
            onClose={() => setSettingsOpen(false)}
            onUpdateUserRelationship={handleUpdateUserRelationship}
            onReport={handleReport}
            onViewProfile={onViewProfile}
            onUpdateSettings={handleUpdateSettings}
        />
      )}
    </div>
  );
};

export default ChatWindow;
