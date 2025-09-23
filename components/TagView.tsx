
import React from 'react';
import type { Post } from '../types.ts';
import PostGrid from './PostGrid.tsx';

interface TagViewProps {
  tagName: string;
  posts: Post[];
  onViewPost: (post: Post) => void;
  onBack: () => void;
}

const TagView: React.FC<TagViewProps> = ({ tagName, posts, onViewPost, onBack }) => {
  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">#{tagName}</h1>
        <p className="text-gray-400">{posts.length.toLocaleString()} posts</p>
      </header>
      <PostGrid posts={posts} onViewPost={onViewPost} />
    </div>
  );
};

export default TagView;
