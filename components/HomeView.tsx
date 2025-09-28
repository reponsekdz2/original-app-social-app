import React from 'react';
import type { Story, Post, User } from '../types.ts';
import StoryBubble from './StoryBubble.tsx';
import PostComponent from './Post.tsx';
import Sidebar from './Sidebar.tsx';

interface HomeViewProps {
  stories: Story[];
  posts: Post[];
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
    posts,
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
    onViewTag
  } = props;

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
        {posts.length > 0 ? posts.map(post => (
          <PostComponent
            key={post.id}
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
        )) : Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
      </div>
    </div>
  );
};

export default HomeView;