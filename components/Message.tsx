import React, { useState } from 'react';
import type { Message as MessageType, User, Reaction } from '../types.ts';
import Icon from './Icon.tsx';
import VoicenoteMessage from './VoicenoteMessage.tsx';
import EmojiPicker from './EmojiPicker.tsx';

interface MessageProps {
  message: MessageType;
  currentUser: User;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: MessageType) => void;
}

const Message: React.FC<MessageProps> = ({ message, currentUser, onReact, onReply }) => {
    const isCurrentUser = message.senderId === currentUser.id;
    const [showReactions, setShowReactions] = useState(false);

    const renderContent = () => {
        switch (message.type) {
            case 'text':
                return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
            case 'image':
                return <img src={message.content} alt="sent" className="max-w-xs rounded-lg cursor-pointer" />;
            case 'sticker':
                return <img src={message.content} alt="sticker" className="w-32 h-32" />;
            case 'voicenote':
                return message.fileAttachment ? <VoicenoteMessage audioUrl={message.fileAttachment.fileUrl} isCurrentUser={isCurrentUser} /> : null;
            case 'share_post':
            case 'share_reel':
                return (
                    <div className="bg-gray-700 p-2 rounded-lg max-w-xs cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={message.sharedContent?.avatar_url} className="w-6 h-6 rounded-full" alt="" />
                            <span className="font-semibold text-sm">{message.sharedContent?.username}</span>
                        </div>
                        <img src={message.sharedContent?.media_url} className="w-full rounded-md" alt="" />
                        <p className="text-xs text-gray-300 mt-1">Shared a {message.type === 'share_reel' ? 'reel' : 'post'}</p>
                    </div>
                );
            case 'file':
                 return (
                    <a href={message.fileAttachment?.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
                        <Icon className="w-8 h-8 flex-shrink-0"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></Icon>
                        <div>
                            <p className="font-semibold text-sm truncate">{message.fileAttachment?.fileName}</p>
                            <p className="text-xs text-gray-400">{((message.fileAttachment?.fileSize || 0) / 1024).toFixed(2)} KB</p>
                        </div>
                    </a>
                );
            default: return null;
        }
    };
    
    const reactionSummary = (message.reactions || []).reduce((acc, reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

  return (
    <div className={`flex items-end gap-2 group ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {!isCurrentUser && message.sender && <img src={message.sender.avatar_url} alt="sender" className="w-7 h-7 rounded-full self-start" />}
      <div className="relative">
        {message.replyTo && (
            <div className={`text-xs p-1 px-2 mb-0.5 rounded-t-lg max-w-xs truncate ${isCurrentUser ? 'bg-red-900/50' : 'bg-gray-800/50'}`}>
                Replying to {message.replyTo.sender}: "{message.replyTo.content}"
            </div>
        )}
        <div className={`relative p-2 rounded-2xl max-w-xs sm:max-w-md ${isCurrentUser ? 'bg-red-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
          {renderContent()}
        </div>
        {Object.keys(reactionSummary).length > 0 && (
            <div className={`absolute -bottom-3 flex gap-1 ${isCurrentUser ? 'right-2' : 'left-2'}`}>
                {Object.entries(reactionSummary).map(([emoji, count]) => (
                    <span key={emoji} className="bg-gray-800 text-xs px-1.5 py-0.5 rounded-full border border-gray-900">{emoji} {count > 1 && count}</span>
                ))}
            </div>
        )}
      </div>
       <div className={`relative flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
            <button onClick={() => setShowReactions(p => !p)}><Icon className="w-5 h-5 text-gray-400"><path d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon></button>
            <button onClick={() => onReply(message)}><Icon className="w-5 h-5 text-gray-400"><path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></Icon></button>
            {showReactions && (
                <div className="absolute bottom-full mb-1 z-10">
                    <EmojiPicker onSelectEmoji={(emoji) => { onReact(message.id, emoji); setShowReactions(false); }} />
                </div>
            )}
      </div>
    </div>
  );
};

export default Message;
