
import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected import path for types
import type { View, User } from '../types.ts';
import Icon from './Icon.tsx';

interface LeftSidebarProps {
  currentUser: User;
  currentView: View;
  onNavigate: (view: View) => void;
  onShowSearch: () => void;
  onShowNotifications: () => void;
  onCreatePost: () => void;
  onSwitchAccount: () => void;
  onLogout: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
    currentUser,
    currentView, 
    onNavigate, 
    onShowSearch, 
    onShowNotifications, 
    onCreatePost,
    onSwitchAccount,
    onLogout
}) => {
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMoreMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { view: 'home', label: 'Home', action: () => onNavigate('home'), icon: <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /> },
        { view: 'explore', label: 'Explore', action: () => onNavigate('explore'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.247l11.494 5.747M12 21a9 9 0 100-18 9 9 0 000 18z" /> },
        { view: 'notifications', label: 'Notifications', action: onShowNotifications, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /> },
        { view: 'messages', label: 'Messages', action: () => onNavigate('messages'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /> },
        { view: 'reels', label: 'Reels', action: () => onNavigate('reels'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> },
        { view: 'saved', label: 'Bookmarks', action: () => onNavigate('saved'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /> },
        { view: 'premium', label: 'Premium', action: () => onNavigate('premium'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" /> },
        { view: 'profile', label: 'Profile', action: () => onNavigate('profile'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
        { view: 'search', label: 'Search', action: onShowSearch, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> },
    ];
    
  return (
    <aside className="fixed top-0 left-0 h-screen bg-black border-r border-gray-800 p-3 z-40 hidden md:flex flex-col">
       <div className="py-4 px-2 mb-4">
        <h1 onClick={() => onNavigate('home')} className="text-2xl font-serif font-bold text-white hidden lg:block cursor-pointer">talka</h1>
        <h1 onClick={() => onNavigate('home')} className="text-3xl font-serif font-bold text-red-600 block lg:hidden cursor-pointer">t</h1>
       </div>
       <nav className="flex-1">
        <ul>
            {navItems.map(item => (
                <li key={item.label}>
                    <button onClick={item.action} className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors ${currentView === item.view ? 'font-bold' : ''}`}>
                        <Icon className="w-7 h-7">{item.icon}</Icon>
                        <span className="text-lg hidden lg:block">{item.label}</span>
                    </button>
                </li>
            ))}
        </ul>
        <button onClick={onCreatePost} className="w-full lg:w-5/6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full mt-4 text-lg">
            <span className="hidden lg:block">Post</span>
            <Icon className="w-7 h-7 block lg:hidden"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
        </button>
       </nav>
       <div className="relative" ref={menuRef}>
           <button onClick={() => setMoreMenuOpen(p => !p)} className="w-full flex items-center gap-4 p-3 rounded-full hover:bg-gray-800 transition-colors text-left">
              <img src={currentUser.avatar} alt={currentUser.username} className="w-10 h-10 rounded-full" />
              <div className="hidden lg:block flex-1">
                <p className="font-bold text-sm">{currentUser.name}</p>
                <p className="text-sm text-gray-400">@{currentUser.username}</p>
              </div>
              <Icon className="w-5 h-5 hidden lg:block ml-auto"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
           </button>
           {isMoreMenuOpen && (
                <div className="absolute bottom-16 left-0 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                    <button onClick={() => {onNavigate('settings'); setMoreMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-3">Settings</button>
                    <button onClick={() => {onNavigate('activity'); setMoreMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-3">Your activity</button>
                    <button onClick={() => {onNavigate('premium'); setMoreMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-3">
                        Get Premium
                        {currentUser.isPremium && <Icon className="w-4 h-4 text-yellow-400" fill="currentColor"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" /></Icon>}
                    </button>
                    <div className="border-t border-gray-700 my-1"></div>
                     <button onClick={() => { onSwitchAccount(); setMoreMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700">Switch Accounts</button>
                    <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700">Log Out</button>
                </div>
            )}
       </div>
    </aside>
  );
};

export default LeftSidebar;
