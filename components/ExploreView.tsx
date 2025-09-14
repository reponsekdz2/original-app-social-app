import React from 'react';
import type { Post } from '../types';
import Icon from './Icon';

interface ExploreViewProps {
    posts: Post[];
    onViewPost: (post: Post) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ posts, onViewPost }) => {
  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
        {posts.map((post, index) => (
          <button 
            key={post.id} 
            onClick={() => onViewPost(post)}
            className={`group relative aspect-square overflow-hidden cursor-pointer ${index % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}
          >
            <img src={post.image} alt={post.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <Icon className="w-6 h-6"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001ac.45.45 0 01.224.194l.428.746A12.986 12.986 0 002.49 18.073a9.703 9.703 0 01-1.423-5.523c0-2.343.886-4.555 2.343-6.21.378-.426.79-.81 1.234-1.139a.75.75 0 01.95.145l.022.033c.074.114.085.25.033.374a13.44 13.44 0 00-1.226 2.165 10.463 10.463 0 00-1.874 5.482.75.75 0 01-1.498-.059 11.963 11.963 0 011.807-5.834 14.98 14.98 0 012.24-4.04C6.182 4.137 7.91 3.5 9.782 3.5h.027a9.75 9.75 0 019.263 11.129 9.75 9.75 0 01-9.263 2.138 9.726 9.726 0 01-2.433-.668 13.725 13.725 0 01-2.288-1.505.75.75 0 01-.1-.965c.09-.234.34-.363.585-.272.246.09.4.332.31.567a12.228 12.228 0 001.947 1.256c.48.26.985.48 1.517.655a8.25 8.25 0 008.25-8.25 8.25 8.25 0 00-8.25-8.25H9.782c-1.536 0-3.02.48-4.25 1.336a13.483 13.483 0 00-3.43 3.653A11.25 11.25 0 00.75 12.553a11.25 11.25 0 002.043 6.95A14.48 14.48 0 0111.5 21.021h.145a.75.75 0 010 1.5h-.145c-2.441 0-4.816-.621-6.95-1.772a.75.75 0 01-.224-1.037l.428-.746a.45.45 0 01.224-.194z" /></Icon>
                        <span className="font-bold">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-1.5 0V6.375a.375.375 0 00-.375-.375H3.375A.375.375 0 003 6.375v9.25c0 .207.168.375.375.375h17.25a.375.375 0 00.375-.375v-3.026a.75.75 0 011.5 0v3.026c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 15.625v-9.25zM12.75 6a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75z" clipRule="evenodd" /></Icon>
                        <span className="font-bold">{post.comments.length}</span>
                    </div>
                </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExploreView;