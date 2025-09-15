import React from 'react';
import type { Post } from '../types.ts';
import Icon from './Icon.tsx';

interface SponsoredPostProps {
  post: Post;
}

const SponsoredPost: React.FC<SponsoredPostProps> = ({ post }) => {
  return (
    <article className="border-b border-gray-800 bg-gray-900/50">
      <div className="flex items-center p-3">
        <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
        <div className="ml-3">
            <p className="font-semibold">{post.user.username}</p>
            <p className="text-xs text-gray-400">Sponsored</p>
        </div>
      </div>
      
      <div>
        {post.mediaType === 'video' ? (
          <video src={post.media} controls className="w-full" />
        ) : (
          <img src={post.media} alt="Sponsored content" className="w-full" />
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
           <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-4 rounded-md">Learn More</button>
           <div className="ml-auto flex items-center gap-4">
                <Icon className="w-7 h-7 hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                <Icon className="w-7 h-7 hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>
           </div>
        </div>
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.user.username}</span>
          {post.caption}
        </p>
      </div>
    </article>
  );
};

export default SponsoredPost;
