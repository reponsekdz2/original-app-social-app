import React from 'react';
// Fix: Add .ts extension to import to resolve module.
import type { Post } from '../types.ts';
import Icon from './Icon.tsx';

interface ExploreViewProps {
    posts: Post[];
    onViewPost: (post: Post) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ posts, onViewPost }) => {
  const shuffledPosts = [...posts, ...posts, ...posts].sort(() => 0.5 - Math.random()); // Shuffle posts for variety

  return (
    <div className="pb-16 md:pb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 lg:grid-cols-4 2xl:grid-cols-5">
        {shuffledPosts.map((post, index) => {
          const firstMedia = post.media[0];
          return (
            <div key={`${post.id}-${index}`} className="relative aspect-square group cursor-pointer" onClick={() => onViewPost(post)}>
              {firstMedia.type === 'video' ? (
                  <video src={firstMedia.url} className="w-full h-full object-cover" />
              ) : (
                  <img src={firstMedia.url} alt="Explore post" className="w-full h-full object-cover" />
              )}
              {post.media.length > 1 && (
                <div className="absolute top-2 right-2 text-white z-10">
                    <Icon className="w-5 h-5 drop-shadow-md" fill="currentColor"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017.5 0z" /></Icon>
                </div>
              )}
              {firstMedia.type === 'video' && (
                  <div className="absolute top-2 right-2 text-white z-10">
                      <Icon className="w-5 h-5 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
                  </div>
              )}
               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 flex items-center space-x-4">
                  <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>{post.likes}</span>
                  <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path fillRule="evenodd" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" clipRule="evenodd" /></Icon>{post.comments.length}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ExploreView;