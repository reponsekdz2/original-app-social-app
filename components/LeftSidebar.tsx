import React from 'react';
import Icon from './Icon.tsx';
import type { View } from '../types.ts';

interface LeftSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onCreate: () => void;
  onShowNotifications: () => void;
  onShowSearch: () => void;
  onLogout: () => void; // FIX: Added missing prop
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentView, onNavigate, onCreate, onShowNotifications, onShowSearch, onLogout }) => {
    const navItems = [
        { view: 'home', label: 'Home', icon: (active: boolean) => <Icon>{active ? <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" fill="currentColor" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />}</Icon> },
        { view: 'search', label: 'Search', action: onShowSearch, icon: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon> },
        { view: 'explore', label: 'Explore', icon: (active: boolean) => <Icon>{active ? <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />}</Icon> },
        { view: 'reels', label: 'Reels', icon: (active: boolean) => <Icon>{active ? <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}</Icon> },
        { view: 'messages', label: 'Messages', icon: () => <Icon><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon> },
        { view: 'notifications', label: 'Notifications', action: onShowNotifications, icon: () => <Icon><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /></Icon> },
        { view: 'create', label: 'Create', action: onCreate, icon: () => <Icon><path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon> },
        { view: 'profile', label: 'Profile', icon: () => <Icon><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></Icon> },
    ];
    
    return (
        <aside className="fixed top-0 left-0 h-full z-40 hidden md:flex flex-col w-20 xl:w-64 bg-black/80 border-r border-gray-800 p-3">
            <div className="text-red-500 mb-8 py-2">
                <Icon className="w-8 h-8 xl:hidden"><path fill="currentColor" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" /></Icon>
                <span className="hidden xl:block text-2xl font-bold">InstaFire</span>
            </div>
            <nav className="flex-1 space-y-2">
                 {navItems.map(item => (
                    <button key={item.view} onClick={item.action ? item.action : () => onNavigate(item.view as View)} 
                        className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${currentView === item.view ? 'bg-gray-800 font-bold' : 'hover:bg-gray-800'}`}>
                        <div className="w-7 h-7">{item.icon(currentView === item.view)}</div>
                        <span className="hidden xl:block">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto">
                 <button onClick={() => onNavigate('settings')} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800">
                    <Icon className="w-7 h-7"><path d="M9.594 3.94c.09-.542.56-1.002 1.11-1.212l1.173-.42c.328-.118.665-.118.993 0l1.173.42c.55.198 1.02.67 1.11 1.212l.245 1.488a8.13 8.13 0 01.702.308l1.357-.549c.42-.17.905-.025 1.15.35l.805 1.393c.246.426-.11-1.004-.265-1.32l-1.095.845a7.51 7.51 0 010 1.344l1.095.845c.375.29.51.865-.265-1.32l-.805 1.393c-.245.426-.73.52-1.15.35l-1.357-.549a8.13 8.13 0 01-.702.308l-.245 1.488c-.09.542-.56-1.002-1.11-1.212l-1.173.42c-.328-.118-.665-.118-.993 0l-1.173-.42c-.55-.198-1.02-.67-1.11-1.212l-.245-1.488a8.13 8.13 0 01-.702-.308l-1.357.549c-.42.17-.905-.025-1.15-.35l-.805-1.393c-.246.426-.11-1.004.265-1.32l1.095-.845a7.51 7.51 0 010 1.344l-1.095-.845c-.375-.29-.51-.865-.265-1.32l.805 1.393c.245.426.73.52 1.15.35l1.357.549a8.13 8.13 0 01.702.308l.245-1.488zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></Icon>
                    <span className="hidden xl:block">Settings</span>
                </button>
                 <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800">
                    <Icon className="w-7 h-7"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></Icon>
                    <span className="hidden xl:block">Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;
