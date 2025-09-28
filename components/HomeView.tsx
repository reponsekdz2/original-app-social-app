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
        {posts.map(post => (
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
        ))}
      </div>
    </div>
  );
};

export default HomeView;
