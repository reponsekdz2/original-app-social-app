import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, User, Message as MessageType } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import Message from './Message.tsx';
import MessageInput from './MessageInput.tsx';
import ChatSettingsPanel from './ChatSettingsPanel.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import CallModal from './CallModal.tsx';
import { socketService } from '../services/socketService.ts';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (content: string, type: MessageType['type']) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage, onBack, onViewProfile }) => {
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  useEffect(() => {
    const handleTyping = (convoId: string) => {
        if (convoId === conversation.id) setIsTyping(true);
    };
    const handleStopTyping = (convoId: string) => {
        if (convoId === conversation.id) setIsTyping(false);
    };
    
    socketService.on('typing', handleTyping);
    socketService.on('stop_typing', handleStopTyping);

    return () => {
        socketService.off('typing', handleTyping);
        socketService.off('stop_typing', handleStopTyping);
    };
  }, [conversation.id]);

  if (!otherUser) return null; // Should not happen

  return (
    <div className="flex flex-col h-full relative">
      <header className="flex items-center justify-between p-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-1"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon></button>
          <img src={otherUser.avatar} alt={otherUser.username} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onViewProfile(otherUser)}/>
          <div>
            <p className="font-semibold flex items-center cursor-pointer" onClick={() => onViewProfile(otherUser)}>{otherUser.username} {otherUser.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
            <p className="text-xs text-gray-400">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setActiveCall('audio')} className="p-2 hover:bg-gray-800 rounded-full"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></Icon></button>
            <button onClick={() => setActiveCall('video')} className="p-2 hover:bg-gray-800 rounded-full"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon></button>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-800 rounded-full"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></Icon></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg, index) => (
          <Message 
            key={msg.id}
            message={msg}
            isCurrentUser={msg.senderId === currentUser.id}
            isLastInGroup={index === conversation.messages.length - 1 || conversation.messages[index + 1].senderId !== msg.senderId}
            sender={msg.senderId === currentUser.id ? currentUser : otherUser}
            onReply={() => setReplyingTo(msg)}
          />
        ))}
        {isTyping && <TypingIndicator user={otherUser} />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-800 flex-shrink-0">
        <MessageInput 
          onSend={onSendMessage}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          conversationId={conversation.id}
        />
      </div>

      {showSettings && (
        <ChatSettingsPanel 
            user={otherUser}
            currentUser={currentUser}
            onClose={() => setShowSettings(false)}
            onUpdateUserRelationship={() => {}}
            onReport={() => {}}
            onViewProfile={onViewProfile}
        />
      )}
      {activeCall && <CallModal user={otherUser} type={activeCall} onClose={() => setActiveCall(null)} />}
    </div>
  );
};

export default ChatWindow;