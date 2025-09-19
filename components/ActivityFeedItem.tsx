
import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { FeedActivity, User } from '../types.ts';

interface ActivityFeedItemProps {
    activity: FeedActivity;
    onViewProfile: (user: User) => void;
}

const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ activity, onViewProfile }) => {

    const renderActionText = () => {
        switch (activity.action) {
            case 'liked':
                return <>liked <span className="font-semibold cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onViewProfile(activity.targetPost!.user); }}>{activity.targetPost!.user.username}'s</span> post.</>;
            case 'followed':
                return <>started following <span className="font-semibold cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onViewProfile(activity.targetUser!); }}>{activity.targetUser!.username}</span>.</>;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-start gap-3 p-1 rounded-md hover:bg-gray-900 cursor-pointer" onClick={() => onViewProfile(activity.user)}>
            <img src={activity.user.avatar} alt={activity.user.username} className="w-9 h-9 rounded-full object-cover" />
            <div className="text-xs flex-1">
                <p>
                    <span className="font-semibold">{activity.user.username}</span>
                    <span className="text-gray-400"> {renderActionText()}</span>
                </p>
                <p className="text-gray-500">{activity.timestamp}</p>
            </div>
            {activity.action === 'liked' && (
                <img src={activity.targetPost!.media[0].url} alt="Post thumbnail" className="w-9 h-9 object-cover rounded-sm" />
            )}
        </div>
    );
};

export default ActivityFeedItem;
