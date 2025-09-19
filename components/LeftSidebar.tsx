

import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected import path for types to be relative.
import type { View, User } from '../types';
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
  onGoLive: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = (props) => {
    const { currentUser, currentView, onNavigate, onShowSearch, onShowNotifications, onCreatePost, onSwitchAccount, onLogout, onGoLive } = props;
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
        { view: 'search', label: 'Search', action: onShowSearch, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> },
        { view: 'explore', label: 'Explore', action: () => onNavigate('explore'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.247l11.494 5.747M12 21a9 9 0 100-18 9 9 0 000 18z" /> },
        { view: 'reels', label: 'Reels', action: () => onNavigate('reels'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> },
        { view: 'live', label: 'Live', action: () => onNavigate('live'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /> },
        { view: 'messages', label: 'Messages', action: () => onNavigate('messages'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /> },
        { view: 'notifications', label: 'Notifications', action: onShowNotifications, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /> },
        { view: 'profile', label: 'Profile', action: () => onNavigate('profile'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
    ];
    
    if (currentUser.isAdmin) {
        navItems.push({
            view: 'admin',
            label: 'Admin',
            action: () => onNavigate('admin'),
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-.228-4.014A12.022 12.022 0 0012 2.25c-2.705 0-5.231.81-7.243 2.188" />
        });
    }
    
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
                    <button onClick={() => {onGoLive(); setMoreMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-3">Go Live</button>
                    <button onClick={() => {onNavigate('settings'); setMoreMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-3">Settings</button>
                    <button onClick={() => {onNavigate('saved'); setMoreMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-3">Bookmarks</button>
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