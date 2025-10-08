import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Story, Post, User } from '../types.ts';
import * as api from '../services/apiService.ts';
import StoryBubble from './StoryBubble.tsx';
import PostComponent from './Post.tsx';

interface HomeViewProps {
  stories: Story[];
  initialPosts: Post[];
  initialForYouPosts: Post[];
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
  onVote: (pollId: string, optionId: string) => void;
  onViewTag: (tag: string) => void;
}

const PostSkeleton: React.FC = () => (
    <div className="border-b border-gray-200 py-4 animate-pulse bg-white">
        <div className="flex items-center px-4 pb-3">
            <div className="w-9 h-9 rounded-full bg-gray-200"></div>
            <div className="ml-3 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="w-full aspect-square bg-gray-200"></div>
        <div className="px-4 pt-3 space-y-2">
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const HomeView: React.FC<HomeViewProps> = (props) => {
  const { stories, initialPosts, initialForYouPosts, currentUser, onViewStory, ...postProps } = props;
  
  const [activeFeed, setActiveFeed] = useState<'following' | 'foryou'>('following');
  
  // State for Following Feed
  const [followingPosts, setFollowingPosts] = useState<Post[]>(initialPosts);
  const [followingPage, setFollowingPage] = useState(2);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(initialPosts.length > 0);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const followingObserver = useRef<IntersectionObserver>();

  // State for For You Feed
  const [forYouPosts, setForYouPosts] = useState<Post[]>(initialForYouPosts);
  const [forYouPage, setForYouPage] = useState(2);
  const [hasMoreForYou, setHasMoreForYou] = useState(initialForYouPosts.length > 0);
  const [isLoadingForYou, setIsLoadingForYou] = useState(false);
  const forYouObserver = useRef<IntersectionObserver>();

  // Infinite scroll for "Following"
  const loadMoreFollowingPosts = useCallback(async () => {
    setIsLoadingFollowing(true);
    try {
        const newPosts = await api.getFeedPosts(followingPage);
        if (newPosts && newPosts.length > 0) {
            setFollowingPosts(prev => [...prev, ...newPosts]);
            setFollowingPage(prev => prev + 1);
        } else {
            setHasMoreFollowing(false);
        }
    } catch (error) {
        console.error("Failed to load more posts", error);
        setHasMoreFollowing(false);
    } finally {
        setIsLoadingFollowing(false);
    }
  }, [followingPage]);
  
  // Infinite scroll for "For You"
  const loadMoreForYouPosts = useCallback(async () => {
    setIsLoadingForYou(true);
    try {
        const newPosts = await api.getForYouPosts(forYouPage);
        if (newPosts && newPosts.length > 0) {
            setForYouPosts(prev => [...prev, ...newPosts]);
            setForYouPage(prev => prev + 1);
        } else {
            setHasMoreForYou(false);
        }
    } catch (error) {
        console.error("Failed to load more 'For You' posts", error);
        setHasMoreForYou(false);
    } finally {
        setIsLoadingForYou(false);
    }
  }, [forYouPage]);

  const lastFollowingPostRef = useCallback(node => {
    if (isLoadingFollowing) return;
    if (followingObserver.current) followingObserver.current.disconnect();
    followingObserver.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreFollowing) {
           loadMoreFollowingPosts();
        }
    });
    if (node) followingObserver.current.observe(node);
  }, [isLoadingFollowing, hasMoreFollowing, loadMoreFollowingPosts]);

  const lastForYouPostRef = useCallback(node => {
    if (isLoadingForYou) return;
    if (forYouObserver.current) forYouObserver.current.disconnect();
    forYouObserver.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreForYou) {
           loadMoreForYouPosts();
        }
    });
    if (node) forYouObserver.current.observe(node);
  }, [isLoadingForYou, hasMoreForYou, loadMoreForYouPosts]);
  
  useEffect(() => {
      setFollowingPosts(initialPosts);
      setForYouPosts(initialForYouPosts);
      setFollowingPage(2);
      setForYouPage(2);
      setHasMoreFollowing(initialPosts.length > 0);
      setHasMoreForYou(initialForYouPosts.length > 0);
  }, [initialPosts, initialForYouPosts]);

  const renderFeed = (posts: Post[], ref: (node: any) => void, hasMore: boolean, isLoading: boolean) => (
    <div className="space-y-2">
      {posts.map((post, index) => (
        <div ref={index === posts.length - 1 ? ref : null} key={`${activeFeed}-${post.id}`}>
           <PostComponent post={post} currentUser={currentUser} {...postProps} />
        </div>
      ))}
      {isLoading && Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={`skeleton-${i}`} />)}
      {!hasMore && posts.length > 0 && <p className="text-center text-gray-500 py-8">You've reached the end!</p>}
      {!hasMore && posts.length === 0 && !isLoading && <p className="text-center text-gray-500 py-16">No posts to show.</p>}
    </div>
  );

  return (
    <div className="pb-16 md:pb-0">
      {/* Stories */}
      <div className="flex space-x-4 p-4 overflow-x-auto scrollbar-hide border-b border-gray-200 bg-white">
        {stories.map((story, index) => (
          <StoryBubble key={story.id} story={story} onView={() => onViewStory(stories, index)} />
        ))}
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 md:top-16 z-20">
        <button onClick={() => setActiveFeed('following')} className={`flex-1 py-3 font-semibold text-center text-sm transition-colors ${activeFeed === 'following' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>Following</button>
        <button onClick={() => setActiveFeed('foryou')} className={`flex-1 py-3 font-semibold text-center text-sm transition-colors ${activeFeed === 'foryou' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>For You</button>
      </div>

      {/* Posts */}
      {activeFeed === 'following'
        ? renderFeed(followingPosts, lastFollowingPostRef, hasMoreFollowing, isLoadingFollowing)
        : renderFeed(forYouPosts, lastForYouPostRef, hasMoreForYou, isLoadingForYou)
      }
    </div>
  );
};

export default HomeView;