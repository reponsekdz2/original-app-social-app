import React from 'react';
import type { Post, Story, User, View, FeedActivity, SponsoredContent, Conversation } from '../types.ts';
import PostComponent from './Post.tsx';
import Sidebar from './Sidebar.tsx';

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
      <main className="w-full max-w-2xl xl:max-w-3xl h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-auto scrollbar-hide">
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
            />
          </section>
        ))}
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