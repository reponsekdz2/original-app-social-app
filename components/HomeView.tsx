
import React from 'react';
import type { Post, Story, User } from '../types.ts';
import PostComponent from './Post.tsx';
import StoryBubble from './StoryBubble.tsx';

interface HomeViewProps {
  posts: Post[];
  stories: Story[];
  currentUser: User;
  onViewStory: (story: Story, index: number) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: Post) => void;
  onViewLikes: (users: User[]) => void;
  onViewProfile: (user: User) => void;
  onViewPost: (post: Post) => void;
  onOptions: (post: Post) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onTip: (post: Post) => void;
  onVote: (optionId: number) => void;
}

const HomeView: React.FC<HomeViewProps> = (props) => {
  const { posts, stories, onViewStory } = props;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto py-4 pb-16 sm:pb-4">
      {/* Stories Reel */}
      <div className="mb-4 border-b border-gray-800 pb-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
          {stories.map((story, index) => (
            <StoryBubble key={story.id} story={story} onView={() => onViewStory(story, index)} />
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <PostComponent key={post.id} {...props} post={post} />
        ))}
      </div>
    </div>
  );
};

export default HomeView;