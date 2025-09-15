import React from 'react';
import type { User, View } from '../types.ts';
import Icon from './Icon.tsx';
import FollowButton from './FollowButton.tsx';

interface SidebarProps {
  trendingTopics: string[];
  suggestedUsers: User[];
  currentUser: User;
  onShowSearch: () => void;
  onShowSuggestions: () => void;
  onShowTrends: () => void;
  onNavigate: (view: View) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onViewProfile: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  trendingTopics,
  suggestedUsers,
  currentUser,
  onShowSearch,
  onShowSuggestions,
  onShowTrends,
  onNavigate,
  onFollow,
  onUnfollow,
  onViewProfile,
}) => {
  return (
    <aside className="w-80 flex-shrink-0 p-4 hidden lg:block space-y-4">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 pt-2 bg-black -mt-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            onFocus={onShowSearch}
            readOnly
            className="w-full bg-gray-800 rounded-full px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
          </div>
        </div>
      </div>

      {/* Get Premium */}
      {!currentUser.isPremium && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="font-extrabold text-xl mb-1">Subscribe to Premium</h3>
          <p className="text-sm text-gray-300 mb-3">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
          <button onClick={() => onNavigate('premium')} className="bg-white text-black font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors">
            Get Premium
          </button>
        </div>
      )}

      {/* Trends for you */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="font-extrabold text-xl p-4">Trends for you</h3>
        <div className="space-y-1">
          {trendingTopics.slice(0, 5).map((topic, index) => (
            <div key={index} className="px-4 py-2 hover:bg-gray-800/50 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Trending in your location</p>
                <Icon className="w-5 h-5 text-gray-500"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
              </div>
              <p className="font-bold">{topic}</p>
              <p className="text-xs text-gray-500">{Math.floor(Math.random() * 20 + 5)}k posts</p>
            </div>
          ))}
        </div>
        <button onClick={onShowTrends} className="w-full text-left p-4 text-red-500 hover:bg-gray-800/50 rounded-b-xl text-sm transition-colors">
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="font-extrabold text-xl p-4">Who to follow</h3>
        <div className="space-y-4">
          {suggestedUsers.slice(0, 3).map(user => (
            <div key={user.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => onViewProfile(user)}>
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm hover:underline">{user.name}</p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                  <FollowButton 
                    user={user}
                    currentUser={currentUser}
                    onFollow={onFollow}
                    onUnfollow={onUnfollow}
                  />
              </div>
            </div>
          ))}
        </div>
        <button onClick={onShowSuggestions} className="w-full text-left p-4 text-red-500 hover:bg-gray-800/50 rounded-b-xl text-sm transition-colors">
          Show more
        </button>
      </div>
      
      {/* Footer */}
      <footer className="text-xs text-gray-500 space-x-2 px-4 flex flex-wrap gap-y-1">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Ads info</a>
        <a href="#" className="hover:underline">More...</a>
        <span>© {new Date().getFullYear()} Netflixgram, Inc.</span>
      </footer>
    </aside>
  );
};

export default Sidebar;
