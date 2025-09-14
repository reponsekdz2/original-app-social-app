import React from 'react';
import type { User } from '../types';
import { SUGGESTED_USERS } from '../constants';

interface SidebarProps {
  currentUser: User;
  onSwitchAccount: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onSwitchAccount }) => {
  const suggestionContext = [
    "Followed by binge_watcher",
    "New to Netflixgram",
    "Followed by movie_buff + 3 more"
  ];

  return (
    <aside className="w-80 h-screen fixed top-0 right-0 pt-16">
      <div className="h-full overflow-y-auto py-6 px-8 scrollbar-hide">
        <div className="flex items-center mb-8">
          <img src={currentUser.avatar} alt={currentUser.username} className="w-14 h-14 rounded-full object-cover mr-4" />
          <div>
            <p className="font-semibold text-white">{currentUser.username}</p>
            <p className="text-sm text-gray-400">Welcome to Netflixgram</p>
          </div>
          <button onClick={onSwitchAccount} className="ml-auto text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">Switch</button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-400 text-sm">Suggestions For You</p>
            <button className="text-xs font-semibold text-white hover:text-red-600 transition-colors">See All</button>
          </div>
          <div className="space-y-4">
            {SUGGESTED_USERS.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                  <div>
                    <p className="font-semibold text-sm text-white hover:underline cursor-pointer">{user.username}</p>
                    <p className="text-xs text-gray-500">{suggestionContext[index % suggestionContext.length]}</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">Follow</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8 p-4 bg-gray-900 rounded-lg">
           <div className="flex justify-between items-center mb-2">
             <p className="font-semibold text-sm">Sponsored</p>
             <span className="text-xs text-gray-500">Ad</span>
           </div>
           <div className="flex items-center">
             <img src="https://picsum.photos/seed/ad1/200/200" alt="Sponsored content" className="w-20 h-20 rounded-lg object-cover mr-4" />
             <div>
               <p className="font-semibold text-white">Stream 'The Challenger'</p>
               <p className="text-xs text-gray-400">The new hit series is now available only on Netflix.</p>
             </div>
           </div>
        </div>

        <footer className="text-xs text-gray-600 space-y-4">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">About</a>&middot;
              <a href="#" className="hover:underline">Help</a>&middot;
              <a href="#" className="hover:underline">API</a>&middot;
              <a href="#" className="hover:underline">Jobs</a>&middot;
              <a href="#" className="hover:underline">Privacy</a>&middot;
              <a href="#" className="hover:underline">Terms</a>
          </div>
          <p>© {new Date().getFullYear()} NETFLIXGRAM</p>
        </footer>
      </div>
    </aside>
  );
};

export default Sidebar;