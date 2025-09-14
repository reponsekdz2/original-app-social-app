import React from 'react';
import type { Post } from '../types';
import Icon from './Icon';

interface SavedViewProps {
  posts: Post[];
}

const SavedView: React.FC<SavedViewProps> = ({ posts }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Saved Posts</h2>
      <p className="text-xs text-gray-400 mb-6">Only you can see what you've saved</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square group cursor-pointer">
            <img src={post.image} alt="Saved post" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 flex items-center space-x-4">
                <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" /></Icon>{post.likes}</span>
                <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" /></Icon>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedView;
