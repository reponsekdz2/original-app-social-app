import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface CloseFriendsViewProps {
    currentUser: User;
    onBack: () => void;
}

const CloseFriendsView: React.FC<CloseFriendsViewProps> = ({ currentUser, onBack }) => {
    const [followers, setFollowers] = useState<User[]>([]);
    const [closeFriendIds, setCloseFriendIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // In a real app, you might want a dedicated endpoint for followers.
                // For now, we'll fetch the full profile.
                const profile = await api.getUserProfile(currentUser.username);
                const closeFriends = await api.getCloseFriends();
                setFollowers(profile.followers || []);
                setCloseFriendIds(new Set(closeFriends.map((f: User) => f.id)));
            } catch (error) {
                console.error("Failed to fetch data for Close Friends", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser.username]);

    const handleToggleFriend = (friendId: string) => {
        setCloseFriendIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(friendId)) {
                newSet.delete(friendId);
            } else {
                newSet.add(friendId);
            }
            return newSet;
        });
    };
    
    const handleSave = async () => {
        await api.updateCloseFriends(Array.from(closeFriendIds));
        onBack(); // Go back after saving
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
             <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                    </button>
                    <h1 className="text-2xl font-bold">Close Friends</h1>
                </div>
                 <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2 px-4 rounded-md">
                    Save
                </button>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">Only people on your close friends list will see stories you share with them. We don't send notifications when you edit your list.</p>

            {isLoading ? <p>Loading...</p> : (
                 <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
                    {followers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar_url} alt={user.username} className="w-11 h-11 rounded-full" />
                                <div>
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.name}</p>
                                </div>
                            </div>
                             <button onClick={() => handleToggleFriend(user.id)} className={`font-semibold text-sm px-4 py-1.5 rounded-md ${closeFriendIds.has(user.id) ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                {closeFriendIds.has(user.id) ? 'Remove' : 'Add'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CloseFriendsView;
