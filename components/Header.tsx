import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import type { User, View } from '../types';

interface HeaderProps {
    currentUser: User;
    onNavigate: (view: View) => void;
    onSwitchAccount: () => void;
    onSearchFocus: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onSwitchAccount, onSearchFocus }) => {
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
        { label: 'Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.002 1.11-1.212l1.173-.42c.328-.118.665-.118.993 0l1.173.42c.55.198 1.02.67 1.11 1.212l.245 1.488a8.13 8.13 0 01.702.308l1.357-.549c.42-.17.905-.025 1.15.35l.805 1.393c.246.426.11 1.004-.265 1.32l-1.095.845a7.51 7.51 0 010 1.344l1.095.845c.375.29.51.865.265 1.32l-.805 1.393c-.245.426-.73.52-1.15.35l-1.357-.549a8.13 8.13 0 01-.702.308l-.245 1.488c-.09.542-.56 1.002-1.11 1.212l-1.173.42c-.328-.118-.665-.118-.993 0l-1.173-.42c-.55-.198-1.02-.67-1.11-1.212l-.245-1.488a8.13 8.13 0 01-.702-.308l-1.357.549c-.42.17-.905-.025-1.15-.35l-.805-1.393c-.246.426-.11-1.004.265-1.32l1.095-.845a7.51 7.51 0 010-1.344l-1.095-.845c-.375-.29-.51-.865-.265-1.32l.805-1.393c.245.426.73.52 1.15.35l1.357.549a8.13 8.13 0 01.702-.308l.245-1.488zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />, action: () => onNavigate('settings') },
    ];

    return (
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md hidden md:block">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 border-b border-gray-800">
                    <div onClick={() => onNavigate('home')} className="cursor-pointer">
                         <h1 className="text-2xl font-serif font-bold tracking-wider text-red-600">Netflixgram</h1>
                    </div>
                    <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </Icon>
                        <input
                            type="text"
                            placeholder="Search"
                            onFocus={onSearchFocus}
                            className="bg-gray-800 rounded-lg py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-gray-600"
                        />
                    </div>
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
        </header>
    );
};

export default Header;
