import React, { useState } from 'react';
import type { Message, User, SharedContent, FileAttachment } from '../types.ts';
import Icon from './Icon.tsx';
import VoicenoteMessage from './VoicenoteMessage.tsx';
import EmojiPicker from './EmojiPicker.tsx';

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  sender: User;
  onReply: () => void;
  onAddReaction: (emoji: string) => void;
  isVanishMode: boolean;
}

const SharedContentMessage: React.FC<{ content: SharedContent }> = ({ content }) => {
    return (
        <div className="bg-gray-800/80 rounded-lg p-2 w-56 cursor-pointer m-1 border border-gray-700/50">
            <img src={content.media_url} className="aspect-square object-cover rounded" alt={`Shared ${content.type}`} />
            <div className="pt-2">
                <div className="flex items-center gap-2">
                    <img src={content.avatar_url} className="w-6 h-6 rounded-full" alt={`${content.username}'s avatar`} />
                    <p className="text-sm font-semibold">{content.username}</p>
                </div>
            </div>
        </div>
    );
};

const FileAttachmentMessage: React.FC<{ file: FileAttachment }> = ({ file }) => {
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-800/80 rounded-lg w-64 m-1 border border-gray-700/50 hover:bg-gray-700/80">
            <Icon className="w-8 h-8 text-gray-300 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></Icon>
            <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{file.fileName}</p>
                <p className="text-xs text-gray-400">{formatBytes(file.fileSize)}</p>
            </div>
        </a>
    )
}

const Message: React.FC<MessageProps> = (props) => {
  const { message, isCurrentUser, isFirstInGroup, isLastInGroup, sender, onReply, onAddReaction, isVanishMode } = props;
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const messageAlignment = isCurrentUser ? 'justify-end' : 'justify-start';
  
  const bubbleStyles = isCurrentUser
    ? 'bg-red-600 text-white'
    : 'bg-gray-700 text-white';

  const groupMargin = isFirstInGroup ? 'mt-3' : 'mt-0.5';

  const roundingClasses = isCurrentUser
    ? `${isFirstInGroup ? 'rounded-tr-2xl' : 'rounded-tr-md'} ${isLastInGroup ? 'rounded-br-none' : 'rounded-br-lg'}`
    : `${isFirstInGroup ? 'rounded-tl-2xl' : 'rounded-tl-md'} ${isLastInGroup ? 'rounded-bl-none' : 'rounded-bl-lg'}`;

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="py-2 px-3">{message.content}</p>;
      case 'image':
        return <img src={message.content} alt="sent" className="rounded-lg max-w-xs" />;
      case 'sticker':
        return <img src={message.content} alt="sticker" className="w-32 h-32" />;
      case 'voicenote':
        return <VoicenoteMessage duration="0:15" isCurrentUser={isCurrentUser} />;
      case 'share_post':
      case 'share_reel':
        return message.sharedContent ? <SharedContentMessage content={message.sharedContent} /> : null;
      case 'file':
        return message.fileAttachment ? <FileAttachmentMessage file={message.fileAttachment} /> : null;
      default:
        return null;
    }
  };
  
  const uniqueReactions = message.reactions ? [...new Map(message.reactions.map(item => [item.emoji, item])).values()] : [];

  const vanishModeClasses = isVanishMode ? 'border-2 border-dashed border-gray-500 bg-transparent opacity-80' : bubbleStyles;

  return (
    <div className={`flex items-end gap-2 group ${messageAlignment} ${groupMargin}`}>
      {!isCurrentUser && isLastInGroup && (
        <img src={sender.avatar} alt={sender.username} className="w-7 h-7 rounded-full self-end" />
      )}
       {!isCurrentUser && !isLastInGroup && (
        <div className="w-7"></div>
      )}

      <div className="relative">
          <div className={`relative max-w-md rounded-2xl ${message.type.startsWith('share') || message.type === 'file' ? '' : vanishModeClasses} ${roundingClasses}`}>
            {renderContent()}
          </div>
          {uniqueReactions.length > 0 && (
            <div className={`absolute -bottom-3 flex items-center bg-gray-900 border border-gray-700 rounded-full px-1 py-0.5 text-xs ${isCurrentUser ? 'right-2' : 'left-2'}`}>
                {uniqueReactions.slice(0, 3).map(r => <span key={r.emoji}>{r.emoji}</span>)}
                {uniqueReactions.length > 0 && <span className="ml-1 font-semibold">{message.reactions?.length}</span>}
            </div>
           )}
      </div>

       <div className="relative flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        {showReactionPicker && (
            <div className="absolute bottom-full right-0 mb-1 z-10">
                <EmojiPicker onSelectEmoji={(emoji) => { onAddReaction(emoji); setShowReactionPicker(false); }} />
            </div>
        )}
        <button onClick={() => setShowReactionPicker(p => !p)} className="p-1 hover:bg-gray-700 rounded-full">
            <Icon className="w-4 h-4 text-gray-400"><path d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon>
        </button>
        <button onClick={onReply} className="p-1 hover:bg-gray-700 rounded-full">
            <Icon className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default Message;