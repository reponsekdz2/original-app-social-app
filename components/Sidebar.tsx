import React from 'react';
import type { User, SponsoredContent, View, FeedActivity } from '../types.ts';
import SponsoredPost from './SponsoredPost.tsx';
import Icon from './Icon.tsx';
import ActivityFeedItem from './ActivityFeedItem.tsx';

interface SidebarProps {
  currentUser: User;
  users: User[];
  ads: SponsoredContent[];
  activities: FeedActivity[];
  onViewProfile: (user: User) => void;
  onSwitchAccount: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, users, ads, activities, onViewProfile, onSwitchAccount }) => {
  const suggestedUsers = users.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id)).slice(0, 5);

  return (
    <aside className="fixed top-0 right-0 h-screen w-80 bg-black pt-16 px-6 hidden lg:block overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                 <img src={currentUser.avatar} alt={currentUser.username} className="w-14 h-14 rounded-full cursor-pointer" onClick={() => onViewProfile(currentUser)} />
                 <div>
                    <p className="font-semibold text-sm cursor-pointer" onClick={() => onViewProfile(currentUser)}>{currentUser.username}</p>
                    <p className="text-sm text-gray-400">{currentUser.name}</p>
                 </div>
            </div>
            <button onClick={onSwitchAccount} className="text-red-500 hover:text-white font-semibold text-xs">Switch</button>
        </div>

        <div className="my-6">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-400">Recent Activity</p>
            </div>
            <div className="space-y-3">
                {activities.map(activity => (
                    <ActivityFeedItem key={activity.id} activity={activity} onViewProfile={onViewProfile} />
                ))}
            </div>
        </div>

        <div className="my-6">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-400">Suggestions For You</p>
                <button className="text-xs font-semibold hover:text-gray-400">See All</button>
            </div>
            <div className="space-y-3">
                {suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(user)} />
                             <div>
                                <p className="font-semibold text-xs cursor-pointer" onClick={() => onViewProfile(user)}>{user.username}</p>
                                <p className="text-xs text-gray-500">Suggested for you</p>
                             </div>
                        </div>
                        <button className="text-red-500 hover:text-white font-semibold text-xs">Follow</button>
                    </div>
                ))}
            </div>
        </div>

        <div className="my-6">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-400">Sponsored</p>
            </div>
            <div className="space-y-4">
                {ads.map(ad => (
                    <a href={ad.link} key={ad.id} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:bg-gray-900 p-1 rounded-md">
                        <img src={ad.media} alt={ad.company} className="w-16 h-16 object-cover rounded-md" />
                        <div>
                            <p className="font-semibold text-xs">{ad.company}</p>
                            <p className="text-xs text-gray-500">{ad.callToAction}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
        
        <footer className="text-xs text-gray-600 space-x-2 pb-4">
            <a href="#" className="hover:underline">About</a>
            <span>&middot;</span>
            <a href="#" className="hover:underline">Help</a>
             <span>&middot;</span>
            <a href="#" className="hover:underline">API</a>
             <span>&middot;</span>
            <a href="#" className="hover:underline">Jobs</a>
             <span>&middot;</span>
            <a href="#" className="hover:underline">Privacy</a>
             <span>&middot;</span>
            <a href="#" className="hover:underline">Terms</a>
        </footer>
    </aside>
  );
};

export default Sidebar;