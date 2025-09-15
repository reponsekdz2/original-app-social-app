import React from 'react';
import type { User, View } from '../types.ts';
import Icon from './Icon.tsx';

interface SidebarProps {
  currentUser: User;
  users: User[];
  trendingTopics: string[];
  onViewProfile: (user: User) => void;
  onSwitchAccount: () => void;
  onNavigate: (view: View) => void;
  onShowSearch: () => void;
  onShowMoreTrends: () => void;
  onShowMoreSuggestions: () => void;
}

const Card: React.FC<{ title: string, children: React.ReactNode, action?: { label: string, handler: () => void } }> = ({ title, children, action }) => (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4">
            <h3 className="font-extrabold text-xl mb-2">{title}</h3>
            {children}
        </div>
        {action && (
            <button onClick={action.handler} className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors text-sm">
                {action.label}
            </button>
        )}
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ currentUser, users, trendingTopics, onViewProfile, onSwitchAccount, onNavigate, onShowSearch, onShowMoreTrends, onShowMoreSuggestions }) => {
  const suggestedUsers = users.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id)).slice(0, 3);

  return (
    <aside className="fixed top-0 right-0 h-screen w-80 bg-black pt-2 px-6 hidden lg:block">
        <div className="sticky top-0 z-10 bg-black py-2">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search Netflixgram" 
                    className="bg-gray-800 rounded-full py-2.5 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
                    onClick={onShowSearch}
                    readOnly
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
                </div>
            </div>
        </div>
        
        <div className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide space-y-4 py-2">
            {!currentUser.isPremium && (
                 <Card title="Subscribe to Premium">
                     <p className="text-sm text-gray-300 mb-4">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
                     <button onClick={() => onNavigate('premium')} className="bg-white text-black font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors">
                        Subscribe
                    </button>
                 </Card>
            )}

            <Card title="Trends for you" action={{ label: 'Show more', handler: onShowMoreTrends }}>
                <div className="space-y-4">
                    {trendingTopics.slice(0, 4).map((topic, index) => (
                        <div key={index} className="cursor-pointer group leading-tight">
                            <p className="text-xs text-gray-500">Trending in your location</p>
                            <p className="font-semibold text-sm group-hover:text-white transition-colors">{topic}</p>
                            <p className="text-xs text-gray-500">{Math.floor(Math.random() * 20 + 5)}k posts</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Who to follow" action={{ label: 'Show more', handler: onShowMoreSuggestions }}>
                <div className="space-y-4">
                    {suggestedUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onViewProfile(user)} />
                                <div className="leading-tight">
                                    <p className="font-bold text-sm cursor-pointer hover:underline" onClick={() => onViewProfile(user)}>{user.name}</p>
                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                            <button className="bg-white text-black hover:bg-gray-200 font-bold text-sm px-4 py-1.5 rounded-full">Follow</button>
                        </div>
                    ))}
                </div>
            </Card>

            <footer className="text-xs text-gray-600 space-x-2 p-4">
                <a href="#" className="hover:underline">Terms</a>
                <span>&middot;</span>
                <a href="#" className="hover:underline">Privacy</a>
                <span>&middot;</span>
                <a href="#" className="hover:underline">About</a>
                <span>&middot;</span>
                <a href="#" className="hover:underline">More</a>
            </footer>
        </div>
    </aside>
  );
};

export default Sidebar;