import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Story, Post, User } from '../types.ts';
import * as api from '../services/apiService.ts';
import StoryBubble from './StoryBubble.tsx';
import PostComponent from './Post.tsx';
import Sidebar from './Sidebar.tsx';

interface HomeViewProps {
  stories: Story[];
  initialPosts: Post[];
  currentUser: User;
  onViewStory: (stories: Story[], initialIndex: number) => void;
  onViewPost: (post: Post) => void;
  onLikePost: (postId: string) => void;
  onUnlikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onCommentOnPost: (post: Post) => void;
  onSharePost: (post: Post) => void;
  onOptionsForPost: (post: Post) => void;
  onViewProfile: (user: User) => void;
  onViewLikes: (users: User[]) => void;
  onVote: (pollId: string, optionId: number) => void;
  onViewTag: (tag: string) => void;
}

const PostSkeleton: React.FC = () => (
    <div className="border-b border-gray-800 py-4 animate-pulse">
        <div className="flex items-center px-4 pb-3">
            <div className="w-9 h-9 rounded-full bg-gray-700"></div>
            <div className="ml-3 space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
            </div>
        </div>
        <div className="w-full aspect-square bg-gray-700"></div>
        <div className="px-4 pt-3 space-y-2">
            <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
    </div>
);

const HomeView: React.FC<HomeViewProps> = (props) => {
  const {
    stories,
    initialPosts,
    currentUser,
    onViewStory,
    onViewPost,
    onLikePost,
    onUnlikePost,
    onSavePost,
    onCommentOnPost,
    onSharePost,
    onOptionsForPost,
    onViewProfile,
    onViewLikes,
    onVote,
    onViewTag,
  } = props;
  
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2); // Start from page 2 since initial posts are page 1
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const loadMorePosts = useCallback(async () => {
    setIsLoading(true);
    try {
        // FIX: Pass the 'page' argument to the api.getFeedPosts function.
        const newPosts = await api.getFeedPosts(page);
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(newPosts.length > 0);
        setPage(prev => prev + 1);
    } catch (error) {
        console.error("Failed to load more posts", error);
    } finally {
        setIsLoading(false);
    }
  }, [page]);
  
  const lastPostElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
           loadMorePosts();
        }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);
  
  useEffect(() => {
      setPosts(initialPosts); // Reset posts when initialPosts change
      setPage(2);
      setHasMore(initialPosts.length > 0);
  }, [initialPosts]);

  return (
    <div className="pb-16 md:pb-0">
      {/* Stories */}
      <div className="flex space-x-4 p-4 overflow-x-auto scrollbar-hide border-b border-gray-800">
        {stories.map((story, index) => (
          <StoryBubble key={story.id} story={story} onView={() => onViewStory(stories, index)} />
        ))}
      </div>

      {/* Posts */}
      <div className="divide-y divide-gray-800">
        {posts.map((post, index) => (
          <div ref={index === posts.length - 1 ? lastPostElementRef : null} key={post.id}>
             <PostComponent 
                post={post} 
                currentUser={currentUser} 
                onLike={onLikePost}
                onUnlike={onUnlikePost}
                onSave={onSavePost}
                onComment={onCommentOnPost}
                onShare={onSharePost}
                onOptions={onOptionsForPost}
                onViewProfile={onViewProfile}
                onViewLikes={onViewLikes}
                onVote={onVote}
                onViewTag={onViewTag}
             />
          </div>
        ))}
        {isLoading && Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={`skeleton-${i}`} />)}
        {!hasMore && posts.length > 0 && <p className="text-center text-gray-500 py-8">You've reached the end!</p>}
      </div>
    </div>
  );
};

export default HomeView;
