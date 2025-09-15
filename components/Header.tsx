import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon.tsx';
// Fix: Add .ts extension to import to resolve module.
import type { User, View } from '../types.ts';

interface HeaderProps {
    currentUser: User;
    onNavigate: (view: View) => void;
    onSwitchAccount: () => void;
    onCreatePost: () => void;
    onShowNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onSwitchAccount, onCreatePost, onShowNotifications }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { label: 'Profile', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />, action: () => onNavigate('profile') },
        { label: 'Saved', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />, action: () => onNavigate('saved') },
        { label: 'Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.002 1.11-1.212l1.173-.42c.328-.118.665-.118.993 0l1.173.42c.55.198 1.02.67 1.11 1.212l.245 1.488a8.13 8.13 0 01.702.308l1.357-.549c.42-.17.905-.025 1.15.35l.805 1.393c.246.426.11 1.004-.265 1.32l-1.095.845a7.51 7.51 0 010 1.344l1.095.845c.375.29.51.865.265 1.32l-.805 1.393c-.245.426-.73.52-1.15.35l-1.357-.549a8.13 8.13 0 01-.702.308l-.245 1.488c-.09.542-.56-1.002-1.11-1.212l-1.173.42c-.328-.118-.665-.118-.993 0l-1.173-.42c-.55-.198-1.02-.67-1.11-1.212l-.245-1.488a8.13 8.13 0 01-.702-.308l-1.357.549c-.42.17-.905-.025-1.15-.35l-.805-1.393c-.246.426-.11-1.004.265-1.32l1.095-.845a7.51 7.51 0 010-1.344l-1.095-.845c-.375-.29-.51-.865-.265-1.32l.805-1.393c.245.426.73.52 1.15.35l1.357.549a8.13 8.13 0 01.702.308l.245-1.488zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />, action: () => onNavigate('settings') },
    ];
    
    const actionItems = [
        { view: 'create', label: 'Create', action: onCreatePost, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { view: 'notifications', label: 'Notifications', action: onShowNotifications, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /> },
        { view: 'messages', label: 'Messages', action: () => onNavigate('messages'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /> },
    ];

    return (
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md hidden md:block">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-end h-16 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        {actionItems.map(item => (
                            <button key={item.label} onClick={item.action} className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-800">
                                <Icon className="w-7 h-7">{item.icon}</Icon>
                            </button>
                        ))}
                        <div className="relative" ref={dropdownRef}>
                            <img 
                                src={currentUser.avatar} 
                                alt="Current user avatar" 
                                className="w-9 h-9 rounded-full object-cover cursor-pointer"
                                onClick={() => setDropdownOpen(prev => !prev)}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-12 w-60 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                                    {menuItems.map(item => (
                                        <button key={item.label} onClick={() => { item.action(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-3">
                                            <Icon className="w-5 h-5">{item.icon}</Icon>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-700 my-2"></div>
                                    <button onClick={() => { onSwitchAccount(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                                        Switch Accounts
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700">
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
