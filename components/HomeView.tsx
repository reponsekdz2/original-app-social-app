import React, { useState } from 'react';
import type { Post as PostType, Story as StoryType, User } from '../types.ts';
import StoryBubble from './StoryBubble.tsx';
import Post from './Post.tsx';
import Icon from './Icon.tsx';

interface HomeViewProps {
  posts: PostType[];
  stories: StoryType[];
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onViewPost: (post: PostType) => void;
  onViewStory: (story: StoryType) => void;
  onSave: (postId: string) => void;
  onShare: (post: PostType) => void;
  onCreateStory: () => void;
  onViewProfile: (user: User) => void;
  onEditPost: (post: PostType) => void;
  onViewLikes: (users: User[]) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  posts,
  stories,
  currentUser,
  onLike,
  onComment,
  onViewPost,
  onViewStory,
  onSave,
  onShare,
  onCreateStory,
  onViewProfile,
  onEditPost,
  onViewLikes,
}) => {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');

  const followingPosts = posts.filter(p => currentUser.following.some(f => f.id === p.user.id) || p.user.id === currentUser.id);
  const displayedPosts = activeTab === 'following' ? followingPosts : posts;

  return (
    <div className="pb-16 md:pb-0">
      {/* Stories */}
      <div className="py-4 border-b border-gray-800">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
            <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0" onClick={onCreateStory}>
              <div className="relative group w-28 h-40 flex flex-col items-center justify-center">
                <img src={currentUser.avatar} alt="Your story" className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/30 rounded-xl"></div>
                <div className="absolute bottom-2">
                    <Icon className="w-8 h-8 text-white bg-red-600 rounded-full border-2 border-black"><path d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                </div>
              </div>
               <p className="text-xs w-28 truncate text-center">Your Story</p>
            </div>
          {stories.map(story => (
            <StoryBubble key={story.id} story={story} onView={onViewStory} />
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex">
            <button onClick={() => setActiveTab('for-you')} className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'for-you' ? 'text-white border-b-2 border-red-500' : 'text-gray-500 hover:bg-gray-900'}`}>For You</button>
            <button onClick={() => setActiveTab('following')} className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'following' ? 'text-white border-b-2 border-red-500' : 'text-gray-500 hover:bg-gray-900'}`}>Following</button>
          </div>
        </div>
        {displayedPosts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
            onSave={onSave}
            onShare={onShare}
            onViewProfile={onViewProfile}
            onEditPost={onEditPost}
            onViewLikes={onViewLikes}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeView;
