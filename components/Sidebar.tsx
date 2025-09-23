
import React from 'react';
// Fix: Correct import path for types
import type { TrendingTopic, FeedActivity, User, SponsoredContent } from '../types.ts';
import SponsoredPost from './SponsoredPost.tsx';
import ActivityFeedItem from './ActivityFeedItem.tsx';
import FollowButton from './FollowButton.tsx';

interface SidebarProps {
  trendingTopics: TrendingTopic[];
  suggestedUsers: User[];
  feedActivities: FeedActivity[];
  sponsoredContent: SponsoredContent[];
  currentUser: User;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onViewProfile: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  trendingTopics, 
  suggestedUsers, 
  feedActivities, 
  sponsoredContent,
  currentUser,
  onFollow,
  onUnfollow,
  onViewProfile 
}) => {
  return (
    <aside className="hidden lg:block w-96 p-6 space-y-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Sponsored Content */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">Sponsored</h3>
        {sponsoredContent.map(ad => <SponsoredPost key={ad.id} ad={ad} />)}
      </div>

      {/* Trending Topics */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">What's Happening</h3>
        {trendingTopics.map(topic => (
          <div key={topic.id} className="text-sm cursor-pointer hover:bg-gray-800 p-2 rounded-md">
            <p className="font-bold">{topic.topic}</p>
            <p className="text-xs text-gray-500">{topic.post_count.toLocaleString()} posts</p>
          </div>
        ))}
      </div>

      {/* Who to Follow */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">Who to Follow</h3>
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-md">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile(user)}>
              <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">{user.name}</p>
              </div>
            </div>
            <FollowButton user={user} currentUser={currentUser} onFollow={onFollow} onUnfollow={onUnfollow} />
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">Recent Activity</h3>
        {feedActivities.map(activity => (
          <ActivityFeedItem key={activity.id} activity={activity} onViewProfile={onViewProfile} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
