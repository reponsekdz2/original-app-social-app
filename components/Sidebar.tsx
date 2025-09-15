import React from 'react';
import { SUGGESTED_USERS } from '../constants';
import type { User } from '../types';

interface SidebarProps {
    currentUser: User;
    onSwitchAccount: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onSwitchAccount }) => {
    const suggestions = SUGGESTED_USERS.filter(u => u.id !== currentUser.id).slice(0, 4);

    return (
        <aside className="w-full py-8 fixed w-[320px]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <img src={currentUser.avatar} alt={currentUser.username} className="w-14 h-14 rounded-full object-cover mr-4" />
                    <div>
                        <p className="font-semibold">{currentUser.username}</p>
                        <p className="text-sm text-gray-400">The Movie Buff</p>
                    </div>
                </div>
                <button onClick={onSwitchAccount} className="text-sm font-semibold text-red-500 hover:text-red-400">Switch</button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-400 text-sm">Suggestions For You</p>
                <button className="text-xs font-semibold">See All</button>
            </div>
            <div className="space-y-4">
                {suggestions.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between">
                         <div className="flex items-center">
                            <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                            <div>
                                <p className="font-semibold text-sm">{user.username}</p>
                                <p className="text-xs text-gray-400">Suggested for you</p>
                            </div>
                        </div>
                        <button className="text-sm font-semibold text-red-500 hover:text-red-400">Follow</button>
                    </div>
                ))}
            </div>
            <footer className="mt-8 text-xs text-gray-600">
                <p>&copy; 2024 NETFLIXGRAM FROM META CLONE</p>
            </footer>
        </aside>
    );
};

export default Sidebar;
