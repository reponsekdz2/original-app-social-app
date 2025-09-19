

import React, { useState } from 'react';
// Fix: Corrected import path for types to be relative.
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface SearchViewProps {
    users: User[];
    onClose: () => void;
    onViewProfile: (user: User) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ users, onClose, onViewProfile }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = searchTerm 
        ? users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];
        
    const handleSelectUser = (user: User) => {
        onViewProfile(user);
        onClose();
    };

    return (
         <div 
            className="fixed top-0 left-0 w-screen h-screen z-30"
            onClick={onClose}
        >
            <div 
                className="fixed top-0 left-0 md:left-[72px] lg:left-64 w-[397px] h-screen bg-black border-r border-gray-800 z-40 shadow-2xl rounded-r-2xl flex flex-col transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6">Search</h2>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                    <div className="border-t border-gray-800 flex-1 overflow-y-auto -mx-6">
                        {filteredUsers.length > 0 ? (
                            <div className="py-4">
                                {filteredUsers.map(user => (
                                    <button key={user.id} onClick={() => handleSelectUser(user)} className="flex items-center justify-between w-full px-6 py-2 hover:bg-gray-800 cursor-pointer text-left">
                                        <div className="flex items-center">
                                            <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover mr-3" />
                                            <div>
                                                <p className="font-semibold text-sm">{user.username}</p>
                                                <p className="text-xs text-gray-400">{user.name}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                             searchTerm && <p className="text-center text-gray-400 p-8">No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchView;
