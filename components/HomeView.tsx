import React from 'react';
import type { Post, Story, User, View, FeedActivity, SponsoredContent, Conversation } from '../types.ts';
import PostComponent from './Post.tsx';
import StoryBubble from './StoryBubble.tsx';
import Sidebar from './Sidebar.tsx';
import Icon from './Icon.tsx';

interface HomeViewProps {
  posts: Post[];
  stories: Story[];
  currentUser: User;
  suggestedUsers: User[];
  trendingTopics: string[];
  feedActivities: FeedActivity[];
  sponsoredContent: SponsoredContent[];
  conversations: Conversation[];
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: Post) => void;
  onViewStory: (story: Story) => void;
  onViewLikes: (users: User[]) => void;
  onViewProfile: (user: User) => void;
  onViewPost: (post: Post) => void;
  onOptions: (post: Post) => void;
  onShowSuggestions: () => void;
  onShowTrends: () => void;
  onCreateStory: () => void;
  onShowSearch: () => void;
  onNavigate: (view: View) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
}

const HomeView: React.FC<HomeViewProps> = (props) => {
  return (
    <div className="flex justify-center container mx-auto gap-8 lg:gap-16 xl:gap-24">
      <main className="w-full max-w-2xl">
        <div className="py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0" onClick={props.onCreateStory}>
                <div className="relative group w-28 h-40">
                    <div className="w-full h-full rounded-xl bg-gray-800/50 border-2 border-dashed border-gray-600 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                    </div>
                </div>
                <p className="text-xs w-28 truncate text-center">Add Story</p>
            </div>
            {props.stories.map(story => (
              <StoryBubble key={story.id} story={story} onView={props.onViewStory} />
            ))}
          </div>
        </div>
        <div>
          {props.posts.map(post => (
            <PostComponent 
              key={post.id} 
              post={post} 
              currentUser={props.currentUser}
              onToggleLike={props.onToggleLike}
              onToggleSave={props.onToggleSave}
              onComment={props.onComment}
              onShare={props.onShare}
              onViewLikes={props.onViewLikes}
              onViewProfile={props.onViewProfile}
              onViewPost={props.onViewPost}
              onOptions={props.onOptions}
              onFollow={props.onFollow}
              onUnfollow={props.onUnfollow}
            />
          ))}
        </div>
      </main>
      <Sidebar
        trendingTopics={props.trendingTopics}
        suggestedUsers={props.suggestedUsers}
        currentUser={props.currentUser}
        feedActivities={props.feedActivities}
        sponsoredContent={props.sponsoredContent}
        conversations={props.conversations}
        onShowSearch={props.onShowSearch}
        onShowSuggestions={props.onShowSuggestions}
        onShowTrends={props.onShowTrends}
        onNavigate={props.onNavigate}
        onFollow={props.onFollow}
        onUnfollow={props.onUnfollow}
        onViewProfile={props.onViewProfile}
      />
    </div>
  );
};

export default HomeView;