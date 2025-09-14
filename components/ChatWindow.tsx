import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User, Message, MessageType } from '../types';
import Icon from './Icon';
import MessageItem from '../Message';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (conversationId: string, content: string, type: MessageType, replyTo?: Message) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage, onDeleteMessage }) => {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSend = (content: string, type: MessageType) => {
    onSendMessage(conversation.id, content, type, replyingTo || undefined);
    setReplyingTo(null);
  };

  const handleDelete = (messageId: string) => {
    onDeleteMessage(conversation.id, messageId);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  if (!otherParticipant) return null;

  return (
    <div className="h-full flex flex-col bg-black">
      <header className="p-3 border-b border-gray-800 flex items-center flex-shrink-0">
        <img src={otherParticipant.avatar} alt={otherParticipant.username} className="w-10 h-10 rounded-full mr-3" />
        <p className="font-semibold">{otherParticipant.username}</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === currentUser.id}
            participants={conversation.participants}
            onReply={setReplyingTo}
            onDelete={handleDelete}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-3 border-t border-gray-800">
        <MessageInput 
          onSend={handleSend}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          participants={conversation.participants}
        />
      </footer>
    </div>
  );
};

export default ChatWindow;