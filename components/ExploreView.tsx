import React, { useState, useEffect } from 'react';
import type { Post } from '../types.ts';
import * as api from '../services/apiService.ts';
import PostGrid from './PostGrid.tsx';

interface ExploreViewProps {
    onViewPost: (post: Post) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onViewPost }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExploreContent = async () => {
            setIsLoading(true);
            try {
                const data = await api.getExplorePosts();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch explore content", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExploreContent();
    }, []);


  return (
    <div className="pb-16 sm:pb-4">
      {isLoading ? (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {Array.from({length: 21}).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800 animate-pulse"></div>
            ))}
        </div>
      ) : posts.length > 0 ? (
        <PostGrid posts={posts} onViewPost={onViewPost} />
      ) : (
        <div className="text-center text-gray-500 pt-16">
            <p>No posts to explore right now.</p>
        </div>
      )}
    </div>
  );
};

export default ExploreView;
