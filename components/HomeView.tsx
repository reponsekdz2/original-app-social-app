import React, { useState } from 'react';
import type { Post as PostType, Story as StoryType } from '../types';
import Post from './Post';
import StoryBubble from './StoryBubble';

interface HomeViewProps {
  posts: PostType[];
  stories: StoryType[];
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
  onViewPost: (post: PostType) => void;
  onViewStory: (story: StoryType) => void;
  onSave: (postId: string) => void;
  onShare: (post: PostType) => void;
}

type FeedType = 'For You' | 'Following';

const HomeView: React.FC<HomeViewProps> = ({ posts, stories, onLike, onComment, onViewPost, onViewStory, onSave, onShare }) => {
  const [feedType, setFeedType] = useState<FeedType>('For You');

  const FeedToggle: React.FC = () => (
    <div className="flex border-b border-gray-800">
        <button onClick={() => setFeedType('For You')} className={`flex-1 p-3 font-semibold text-center transition-colors ${feedType === 'For You' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>For You</button>
        <button onClick={() => setFeedType('Following')} className={`flex-1 p-3 font-semibold text-center transition-colors ${feedType === 'Following' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>Following</button>
    </div>
  );

  return (
    <div className="pb-16 md:pb-0">
      <div className="md:hidden">
        <FeedToggle />
      </div>
      <div className="p-4 md:p-0 md:pt-8">
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {stories.map(story => (
            <StoryBubble key={story.id} story={story} onView={onViewStory} />
          ))}
        </div>
      </div>
      <div className="hidden md:block">
        <FeedToggle />
      </div>
      <div>
        {posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            onLike={onLike} 
            onComment={onComment} 
            onViewPost={onViewPost}
            onSave={onSave}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeView;
