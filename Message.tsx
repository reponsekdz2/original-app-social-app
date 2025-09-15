import React, { useState } from 'react';
import type { Message, User } from './types';
import Icon from './components/Icon';

interface MessageProps {
    message: Message;
    currentUser: User;
    participants: User[];
    onReply: (message: Message) => void;
    onDelete: (messageId: string) => void;
    onReact: (emoji: string) => void;
}

const MessageComponent: React.FC<MessageProps> = ({ message, currentUser, participants, onReply, onDelete, onReact }) => {
    const [showActions, setShowActions] = useState(false);
    const [showReactionPanel, setShowReactionPanel] = useState(false);
    
    const isCurrentUser = message.senderId === currentUser.id;
    const sender = participants.find(p => p.id === message.senderId);

    const alignment = isCurrentUser ? 'items-end' : 'items-start';
    const bubbleColor = isCurrentUser ? 'bg-red-600' : 'bg-gray-700';
    const bubbleRadius = isCurrentUser ? 'rounded-l-lg rounded-br-lg' : 'rounded-r-lg rounded-bl-lg';

    const EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];
    
    const renderContent = () => {
        if (message.content === 'This message was deleted.') {
            return <p className="italic text-gray-400">{message.content}</p>
        }
        switch (message.type) {
            case 'voice':
                return (
                    <audio controls src={message.content} className="w-64 h-10"></audio>
                );
            case 'image':
                return (
                    <img src={message.content} alt="shared content" className="rounded-lg max-w-xs cursor-pointer" />
                );
            case 'text':
            default:
                 return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
        }
    }

    const handleReaction = (emoji: string) => {
        onReact(emoji);
        setShowReactionPanel(false);
    };
    
    const messageHasReactions = message.reactions && message.reactions.length > 0;
    
    return (
        <div 
            className={`flex flex-col ${alignment} group relative`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => {
                if(!showReactionPanel) setShowActions(false)
            }}
        >
            <div className={`flex items-end ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isCurrentUser && <img src={sender?.avatar} alt={sender?.username} className="w-6 h-6 rounded-full mb-1 mr-2" />}
                
                {/* Actions Menu */}
                <div className={`flex items-center gap-1 transition-opacity duration-200 ${isCurrentUser ? 'mr-2' : 'ml-2'} ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                    <button onClick={() => setShowReactionPanel(p => !p)} className="p-1 rounded-full hover:bg-gray-600">
                        <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" /></Icon>
                    </button>
                    <button onClick={() => onReply(message)} className="p-1 rounded-full hover:bg-gray-600">
                        <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></Icon>
                    </button>
                    {isCurrentUser && (
                        <button onClick={() => onDelete(message.id)} className="p-1 rounded-full hover:bg-gray-600">
                           <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon>
                        </button>
                    )}
                </div>

                <div className={`relative px-3 py-2 ${message.type === 'text' ? bubbleColor : ''} ${bubbleRadius} max-w-xs lg:max-w-md ${messageHasReactions ? 'mb-4' : ''}`}>
                    {/* Reaction Panel */}
                    {showReactionPanel && (
                        <div className="absolute bottom-full mb-2 bg-gray-900 border border-gray-700 rounded-full p-1 flex gap-1 shadow-lg z-10"
                            onMouseLeave={() => {setShowReactionPanel(false); setShowActions(false);}}
                        >
                            {EMOJIS.map(emoji => (
                                <button key={emoji} onClick={() => handleReaction(emoji)} className="text-2xl p-1 rounded-full hover:bg-gray-700 transform hover:scale-125 transition-transform">{emoji}</button>
                            ))}
                        </div>
                    )}
                    
                    {/* Reply Context */}
                    {message.replyTo && (
                        <div className="border-l-2 border-red-300 pl-2 mb-1 opacity-80 cursor-pointer">
                            <p className="text-xs font-bold">{participants.find(p=>p.id === message.replyTo?.senderId)?.username}</p>
                            <p className="text-xs truncate">{message.replyTo.type === 'voice' ? 'Voice message' : message.replyTo.type === 'image' ? 'Image' : message.replyTo.content}</p>
                        </div>
                    )}
                    
                    {renderContent()}
                    
                    {/* Reactions Display */}
                    {messageHasReactions && (
                        <div className={`absolute -bottom-3 ${isCurrentUser ? 'right-1' : 'left-1'} flex`}>
                            <div className="bg-gray-800 border-2 border-black rounded-full px-1.5 py-0.5 flex items-center text-xs">
                                {Array.from(new Set(message.reactions.map(r => r.emoji))).slice(0, 3).join('')}
                                <span className="ml-1 font-semibold">{message.reactions.length}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <p className={`text-xs text-gray-500 mt-1 px-2 ${isCurrentUser ? 'pr-1' : 'pl-8'}`}>{message.timestamp}</p>
        </div>
    );
};

export default MessageComponent;
