
import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, User, Message } from '../types.ts';
import Icon from './Icon.tsx';
import MessageComponent from '../Message.tsx';
import MessageInput from './MessageInput.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import { socketService } from '../services/socketService.ts';
import ChatSettingsPanel from './ChatSettingsPanel.tsx';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (content: string, type: Message['type']) => void;
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
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7