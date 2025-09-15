import React from 'react';
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
  return (
    <div className="pb-16 md:pb-0">
      {/* Stories */}
      <div className="py-4 border-b border-gray-800">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
            <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0" onClick={onCreateStory}>
              <div className="relative group w-20 h-28 flex flex-col items-center justify-center">
                <img src={currentUser.avatar} alt="Your story" className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/30 rounded-xl"></div>
                <div className="absolute bottom-2">
                    <Icon className="w-8 h-8 text-white bg-red-600 rounded-full border-2 border-black"><path d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                </div>
              </div>
               <p className="text-xs w-20 truncate text-center">Your Story</p>
            </div>
          {stories.map(story => (
            <StoryBubble key={story.id} story={story} onView={onViewStory} />
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-2xl mx-auto">
        {posts.map(post => (
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
