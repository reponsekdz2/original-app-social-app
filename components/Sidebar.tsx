import React from 'react';
import type { View } from '../types.ts';
import Icon from './Icon.tsx';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onShowSearch: () => void;
  onShowNotifications: () => void;
  onCreatePost: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onShowSearch, onShowNotifications, onCreatePost }) => {
  const navItems = [
    { view: 'home', label: 'Home', icon: <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />, action: () => onNavigate('home') },
    { view: 'search', label: 'Search', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />, action: onShowSearch },
    { view: 'explore', label: 'Explore', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.247l11.494 5.747M12 21a9 9 0 100-18 9 9 0 000 18z" />, action: () => onNavigate('explore') },
    { view: 'reels', label: 'Reels', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />, action: () => onNavigate('reels') },
    { view: 'messages', label: 'Messages', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" />, action: () => onNavigate('messages') },
    { view: 'notifications', label: 'Notifications', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" />, action: onShowNotifications },
    { view: 'create', label: 'Create', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />, action: onCreatePost },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen bg-black border-r border-gray-800 p-3 z-40 hidden md:flex flex-col">
       <div className="py-4 px-2 mb-4">
        <h1 className="text-2xl font-serif font-bold text-white">Netflixgram</h1>
       </div>
       <nav className="flex-1">
        <ul>
            {navItems.map(item => (
                <li key={item.label}>
                    <button onClick={item.action} className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors ${currentView === item.view ? 'font-bold' : ''}`}>
                        <Icon className="w-7 h-7">{item.icon}</Icon>
                        <span className="text-base">{item.label}</span>
                    </button>
                </li>
            ))}
        </ul>
       </nav>
    </aside>
  );
};

export default Sidebar;
