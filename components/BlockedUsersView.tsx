import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface BlockedUsersViewProps {
    onBack: () => void;
}

const BlockedUsersView: React.FC<BlockedUsersViewProps> = ({ onBack }) => {
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            setIsLoading(true);
            try {
                const users = await api.getBlockedUsers();
                setBlockedUsers(users);
            } catch (error) {
                console.error("Failed to fetch blocked users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (userId: string) => {
        try {
            await api.updateUserRelationship(userId, 'unblock');
            setBlockedUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Failed to unblock user:", error);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
             <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                </button>
                <h1 className="text-2xl font-bold">Blocked Accounts</h1>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : blockedUsers.length > 0 ? (
                <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
                    {blockedUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar_url} alt={user.username} className="w-11 h-11 rounded-full" />
                                <div>
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.name}</p>
                                </div>
                            </div>
                            <button onClick={() => handleUnblock(user.id)} className="font-semibold text-sm bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded-md">
                                Unblock
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 py-16">You haven't blocked anyone.</p>
            )}
        </div>
    );
};

export default BlockedUsersView;