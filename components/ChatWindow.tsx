import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, User, Message as MessageType } from '../types.ts';
import * as api from '../services/apiService.ts';
import { socketService } from '../services/socketService.ts';
import Icon from './Icon.tsx';
import Message from './Message.tsx';
import MessageInput from './MessageInput.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import ChatSettingsPanel from './ChatSettingsPanel.tsx';
import CallModal from './CallModal.tsx';
import { webRTCManager } from '../services/WebRTCManager.ts';


interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onBack }) => {
    const [messages, setMessages] = useState<MessageType[]>(conversation.messages);
    const [isTyping, setIsTyping] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
    const [callState, setCallState] = useState<{ user: User, status: 'calling' | 'connected', type: 'video' | 'audio'} | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const otherUser = conversation.participants.find(p => p.id !== currentUser.id);

    useEffect(() => {
        setMessages(conversation.messages);
    }, [conversation.messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    useEffect(() => {
        const handleNewMessage = (newMessage: MessageType) => {
            if (newMessage.conversation_id === conversation.id) {
                setMessages(prev => [...prev, newMessage]);
            }
        };
        const handleTyping = ({ conversationId }: { conversationId: string }) => {
            if (conversationId === conversation.id) setIsTyping(true);
        };
        const handleStopTyping = ({ conversationId }: { conversationId: string }) => {
            if (conversationId === conversation.id) setIsTyping(false);
        };

        socketService.on('receive_message', handleNewMessage);
        socketService.on('typing', handleTyping);
        socketService.on('stop_typing', handleStopTyping);

        return () => {
            socketService.off('receive_message', handleNewMessage);
            socketService.off('typing', handleTyping);
            socketService.off('stop_typing', handleStopTyping);
        };
    }, [conversation.id]);

    const handleSendMessage = async (content: string | File, type: MessageType['type'], replyToMessageId?: string) => {
        const newMessage = await api.sendMessage(content, type, conversation.id, undefined, undefined, undefined, replyToMessageId);
        setMessages(prev => [...prev, newMessage]);
        setReplyingTo(null);
    };

    const handleReact = async (messageId: string, emoji: string) => {
        // Optimistic update
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: [...m.reactions, { emoji, user: currentUser }] } : m));
        await api.reactToMessage(messageId, emoji);
    };

    const startCall = async (type: 'video' | 'audio') => {
        if (!otherUser) return;
        await webRTCManager.getLocalStream(type === 'video', true);
        await webRTCManager.startCall(otherUser.id, type === 'video');
        setCallState({ user: otherUser, status: 'calling', type });
    };

    if (!otherUser) return <div className="p-4">Could not load conversation.</div>;

    return (
        <div className="flex flex-col h-full bg-black">
            <header className="flex items-center gap-3 p-3 border-b border-gray-800">
                <button onClick={onBack} className="md:hidden p-1"><Icon className="w-6 h-6"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>
                <img src={otherUser.avatar_url} alt={otherUser.username} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold">{otherUser.username}</p>
                    <p className="text-xs text-gray-400">Active now</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => startCall('video')} className="p-2 hover:bg-gray-800 rounded-full"><Icon className="w-6 h-6"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon></button>
                    <button onClick={() => startCall('audio')} className="p-2 hover:bg-gray-800 rounded-full"><Icon className="w-6 h-6"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon></button>
                    <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-gray-800 rounded-full"><Icon className="w-6 h-6"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></Icon></button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <Message key={msg.id} message={msg} currentUser={currentUser} onReact={handleReact} onReply={setReplyingTo}/>
                ))}
                {isTyping && <TypingIndicator user={otherUser} />}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t border-gray-800">
                <MessageInput onSend={handleSendMessage} replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} conversationId={conversation.id} otherUser={otherUser} />
            </div>
            {isSettingsOpen && <ChatSettingsPanel conversation={conversation} currentUser={currentUser} onClose={() => setSettingsOpen(false)} onUpdateUserRelationship={() => {}} onReport={() => {}} onViewProfile={() => {}} onUpdateSettings={() => {}} />}
            {callState && <CallModal user={callState.user} status={callState.status} type={callState.type} onHangUp={() => { webRTCManager.hangUp(otherUser.id); setCallState(null); }} remoteStream={webRTCManager.remoteStream} />}
        </div>
    );
};

export default ChatWindow;