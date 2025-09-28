import React, { useState, useEffect } from 'react';
import type { Post } from '../types.ts';
import * as api from '../services/apiService.ts';
import PostGrid from './PostGrid.tsx';

interface TagViewProps {
  tag: string;
  onViewPost: (post: Post) => void;
}

const TagView: React.FC<TagViewProps> = ({ tag, onViewPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tag) return;
      setIsLoading(true);
      try {
        const taggedPosts = await api.getPostsByTag(tag);
        setPosts(taggedPosts);
      } catch (error) {
        console.error(`Failed to fetch posts for tag #${tag}`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [tag]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">#{tag}</h1>
        <p className="text-gray-400">{posts.length.toLocaleString()} posts</p>
      </div>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <PostGrid posts={posts} onViewPost={onViewPost} />
      )}
    </div>
  );
};

export default TagView;
