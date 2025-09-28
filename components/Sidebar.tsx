import React, { useState, useEffect } from 'react';
import type { User, FeedActivity, SponsoredContent } from '../types.ts';
import * as api from '../services/apiService.ts';
import FollowButton from './FollowButton.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import ActivityFeedItem from './ActivityFeedItem.tsx';
import SponsoredPost from './SponsoredPost.tsx';

interface SidebarProps {
  currentUser: User;
  onViewProfile: (user: User) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onSwitchAccount: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onViewProfile, onFollow, onUnfollow, onSwitchAccount }) => {
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [activity, setActivity] = useState<FeedActivity[]>([]);
    const [ads, setAds] = useState<SponsoredContent[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suggestedUsers, feedActivity, sponsoredContent] = await Promise.all([
                    api.getSuggestedUsers(),
                    api.getFeedActivity(),
                    api.getSponsoredContent()
                ]);
                setSuggestions(suggestedUsers);
                setActivity(feedActivity);
                setAds(sponsoredContent);
            } catch (error) {
                console.error("Failed to fetch sidebar data", error);
            }
        };
        fetchData();
    }, []);


  return (
    <aside className="hidden lg:block w-96 p-4">
      <div className="sticky top-20">
        {/* Current User */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewProfile(currentUser)}>
                <img src={currentUser.avatar_url} alt={currentUser.username} className="w-14 h-14 rounded-full" />
                <div>
                    <p className="font-semibold">{currentUser.username}</p>
                    <p className="text-sm text-gray-400">{currentUser.name}</p>
                </div>
            </div>
            <button onClick={onSwitchAccount} className="text-xs font-semibold text-red-500">Switch</button>
        </div>
        
        {/* Suggestions */}
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm text-gray-400">Suggested for you</h3>
                <button className="text-xs font-semibold">See All</button>
            </div>
            <div className="space-y-3">
                {suggestions.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                         <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile(user)}>
                            <img src={user.avatar_url} alt={user.username} className="w-9 h-9 rounded-full" />
                            <div>
                                <p className="font-semibold text-sm flex items-center">{user.username} {user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                                <p className="text-xs text-gray-400">Suggested for you</p>
                            </div>
                        </div>
                        <FollowButton user={user} currentUser={currentUser} onFollow={onFollow} onUnfollow={onUnfollow} />
                    </div>
                ))}
            </div>
        </div>

        {/* Activity Feed */}
        {activity.length > 0 && (
            <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-400 mb-2">Recent Activity</h3>
                <div className="space-y-2">
                    {activity.slice(0, 3).map(act => <ActivityFeedItem key={act.id} activity={act} onViewProfile={onViewProfile} />)}
                </div>
            </div>
        )}

        {/* Sponsored Content */}
        {ads.length > 0 && (
             <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-400 mb-2">Sponsored</h3>
                <div className="space-y-3">
                    {ads.map(ad => <SponsoredPost key={ad.id} ad={ad} />)}
                </div>
            </div>
        )}
        
      </div>
    </aside>
  );
};

export default Sidebar;