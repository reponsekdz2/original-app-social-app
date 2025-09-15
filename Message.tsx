import React from 'react';
import type { Message as MessageType, Post } from './types.ts';
import Icon from './components/Icon.tsx';

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

const SharedPost: React.FC<{ post: Post }> = ({ post }) => (
    <div className="mt-2 border-l-2 border-gray-500 pl-3">
        <div className="flex items-center gap-2">
            <img src={post.user.avatar} alt={post.user.username} className="w-5 h-5 rounded-full" />
            <p className="font-semibold text-xs">{post.user.username}</p>
        </div>
        <p className="text-xs text-gray-200 mt-1 line-clamp-2">{post.caption}</p>
        <div className="mt-2">
            {post.media[0].type === 'image' ? (
                <img src={post.media[0].url} alt="Shared post" className="w-full h-32 object-cover rounded" />
            ) : (
                <div className="relative w-full h-32 bg-black rounded">
                    <video src={post.media[0].url} className="w-full h-full object-cover rounded" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white/80"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></Icon>
                    </div>
                </div>
            )}
        </div>
    </div>
);


const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${isOwnMessage ? 'bg-red-600' : 'bg-gray-700'}`}>
        <p>{message.content}</p>
        {message.type === 'share' && message.sharedPost && (
            <SharedPost post={message.sharedPost} />
        )}
      </div>
    </div>
  );
};

export default Message;