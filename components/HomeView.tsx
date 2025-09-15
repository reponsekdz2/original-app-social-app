import React, { useState } from 'react';
import type { Post as PostType, Story as StoryType, User } from '../types';
import Post from './Post';
import StoryBubble from './StoryBubble';
import Icon from './Icon';

interface HomeViewProps {
  posts: PostType[];
  stories: StoryType[];
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
  onViewPost: (post: PostType) => void;
  onViewStory: (story: StoryType) => void;
  onSave: (postId: string) => void;
  onShare: (post: PostType) => void;
  onCreateStory: () => void;
}

type FeedType = 'For You' | 'Following';

const HomeView: React.FC<HomeViewProps> = ({ posts, stories, currentUser, onLike, onComment, onViewPost, onViewStory, onSave, onShare, onCreateStory }) => {
  const [feedType, setFeedType] = useState<FeedType>('For You');

  const FeedToggle: React.FC = () => (
    <div className="flex border-b border-gray-800">
        <button onClick={() => setFeedType('For You')} className={`flex-1 p-3 font-semibold text-center transition-colors ${feedType === 'For You' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>For You</button>
        <button onClick={() => setFeedType('Following')} className={`flex-1 p-3 font-semibold text-center transition-colors ${feedType === 'Following' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>Following</button>
    </div>
  );
  
  const CreateStoryBubble: React.FC = () => (
      <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0" onClick={onCreateStory}>
          <div className="relative group w-20 h-28 flex flex-col items-center justify-center">
              <div className="w-full h-full rounded-xl bg-gray-800/50 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors">
                  <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
              </div>
          </div>
          <p className="text-xs w-20 truncate text-center">Create Story</p>
      </div>
  );

  return (
    <div className="pb-16 md:pb-0">
      <div className="md:hidden">
        <FeedToggle />
      </div>
      <div className="p-4 md:px-4 md:pt-8">
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <CreateStoryBubble />
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