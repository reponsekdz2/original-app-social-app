
import React from 'react';
import Icon from './Icon.tsx';
import type { View } from '../types.ts';

interface LeftSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onCreatePost: () => void;
  onShowNotifications: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentView, onNavigate, onCreatePost, onShowNotifications }) => {
    const navItems = [
        { view: 'home', label: 'Home', icon: <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /> },
        { view: 'explore', label: 'Explore', icon: <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> },
        { view: 'reels', label: 'Reels', icon: <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> },
        { view: 'messages', label: 'Messages', icon: <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /> },
        { view: 'notifications', label: 'Notifications', action: onShowNotifications, icon: <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /> },
        { view: 'create', label: 'Create', action: onCreatePost, icon: <path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { view: 'profile', label: 'Profile', icon: <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
    ];

    return (
        <aside className="fixed top-0 left-0 h-full bg-black border-r border-gray-800 hidden md:flex flex-col items-center lg:items-stretch w-[72px] lg:w-64 z-40 p-3">
            <div className="text-red-500 mb-8 py-2">
                <Icon className="w-8 h-8 lg:hidden"><path fill="currentColor" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" /></Icon>
                <span className="hidden lg:block text-2xl font-bold">InstaFire</span>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button key={item.label} onClick={item.action ? item.action : () => onNavigate(item.view as View)}
                        className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors ${currentView === item.view ? 'bg-gray-800 font-bold' : ''}`}>
                        <Icon className="w-7 h-7">{item.icon}</Icon>
                        <span className="hidden lg:block">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default LeftSidebar;
