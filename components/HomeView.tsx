import React from 'react';
import type { Post, Story, User, View, FeedActivity, SponsoredContent, Conversation, TrendingTopic } from '../types.ts';
import PostComponent from './Post.tsx';
import Sidebar from './Sidebar.tsx';
import StoryBubble from './StoryBubble.tsx';
import Icon from './Icon.tsx';

interface HomeViewProps {
  posts: Post[];
  stories: Story[];
  currentUser: User;
  suggestedUsers: User[];
  trendingTopics: TrendingTopic[];
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
  onTip: (post: Post) => void;
  onVote: (optionId: number) => void;
}

const HomeView: React.FC<HomeViewProps> = (props) => {
  return (
    <div className="flex justify-center container mx-auto gap-8 lg:gap-16 xl:gap-24">
       <div className="w-full max-w-xl md:max-w-2xl xl:max-w-3xl flex flex-col h-[calc(100vh-4rem)]">
        {/* Stories Section */}
        <div className="py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide px-2 sm:px-4">
             <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0 group" onClick={props.onCreateStory}>
                <div className="relative group w-28 h-40 transform group-hover:scale-105 transition-transform duration-300">
                  <img src={props.currentUser.avatar} alt="Add story" className="w-full h-full rounded-xl object-cover" />
                  <div className="absolute inset-0 bg-black/30 rounded-xl"></div>
                  <div className="absolute bottom-2 -right-2 bg-red-600 rounded-full p-1 border-2 border-black">
                     <Icon className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" /></Icon>
                  </div>
                </div>
              <p className="text-xs w-28 truncate text-center">Your Story</p>
            </div>
            {props.stories.filter(s => s.user.id !== props.currentUser.id && s.stories.length > 0).map(story => (
              <StoryBubble key={story.id} story={story} onView={props.onViewStory} />
            ))}
          </div>
        </div>

        <main className="flex-1 w-full snap-y snap-mandatory overflow-y-auto scrollbar-hide pb-16 sm:pb-0">
            {props.posts.map(post => (
            <section key={post.id} className="h-full w-full snap-start flex items-center justify-center py-2 md:py-4">
                <PostComponent 
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
                    onTip={props.onTip}
                    onVote={props.onVote}
                />
            </section>
            ))}
        </main>
      </div>
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