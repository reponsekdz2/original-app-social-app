// Fix: Create the LeftSidebar component.
import React from 'react';
import Icon from './Icon';
import type { View, User } from '../types';

interface LeftSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onCreatePost: () => void;
  onShowSearch: () => void;
  onShowNotifications: () => void;
  currentUser: User;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentView, onNavigate, onCreatePost, onShowSearch, onShowNotifications, currentUser }) => {
    const navItems = [
        { view: 'home', label: 'Home', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /> },
        { view: 'search', label: 'Search', action: onShowSearch, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> },
        { view: 'explore', label: 'Explore', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 20.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H15.75A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 15.75z" /> },
        { view: 'reels', label: 'Reels', icon: <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> },
        { view: 'messages', label: 'Messages', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /> },
        { view: 'notifications', label: 'Notifications', action: onShowNotifications, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /> },
        { view: 'create', label: 'Create', action: onCreatePost, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { view: 'premium', label: 'Premium', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" />, isPremium: currentUser.isPremium },
        { view: 'profile', label: 'Profile', icon: <img src={currentUser.avatar} alt="Profile" /> },
    ];
  return (
    <aside className="fixed top-0 left-0 h-screen z-40 bg-black border-r border-gray-800 hidden md:flex flex-col justify-between p-3">
        <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="p-3 mb-4 h-16 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
                <h1 className="text-2xl font-serif font-bold tracking-wider text-red-600 hidden lg:block">Netflixgram</h1>
                <Icon className="w-8 h-8 text-red-600 block lg:hidden">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 8.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm-1.5 4.5a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </Icon>
            </div>
            {navItems.map(item => (
                <button 
                    key={item.label} 
                    onClick={item.action ? item.action : () => onNavigate(item.view as View)}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors w-full ${currentView === item.view ? 'font-bold' : ''}`}
                >
                    <div className="w-6 h-6 flex items-center justify-center relative">
                       {item.view === 'profile' ? 
                           <img src={currentUser.avatar} alt="Profile" className={`w-7 h-7 rounded-full object-cover ${currentView === 'profile' ? 'ring-2 ring-white' : ''}`} /> 
                           : <Icon className="w-7 h-7">{item.icon}</Icon>
                       }
                       {item.view === 'premium' && item.isPremium && (
                          <span className="absolute -top-1 -right-1 text-yellow-400">
                              <Icon className="w-4 h-4" fill="currentColor"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" /></Icon>
                          </span>
                        )}
                   </div>
                    <span className="hidden lg:inline text-base">{item.label}</span>
                </button>
            ))}
        </div>
        <div>
            {/* More menu can be added here */}
        </div>
    </aside>
  );
};

export default LeftSidebar;