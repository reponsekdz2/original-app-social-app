import React from 'react';
import type { Notification } from '../types.ts';
import Icon from './Icon.tsx';
import FollowButton from './FollowButton.tsx';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  currentUser: any;
  onFollow: (user: any) => void;
  onUnfollow: (user: any) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, currentUser, onFollow, onUnfollow }) => {
  const renderActivityText = (activity: Notification) => {
    switch (activity.type) {
      case 'like_post':
      case 'like_reel':
        return <>liked your {activity.type === 'like_reel' ? 'reel' : 'post'}.</>;
      case 'comment_post':
      case 'comment_reel':
        return <>commented: "{activity.commentText}"</>;
      case 'follow':
        return <>started following you.</>;
      case 'mention':
        return <>mentioned you in a comment.</>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-40 transform transition-transform duration-300 animate-slide-in">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <button onClick={onClose} className="absolute top-4 right-4 p-2">
            <Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon>
        </button>
      </div>
      <div className="overflow-y-auto h-full pb-16">
        {notifications.length > 0 ? (
            notifications.map(notification => (
                <div key={notification.id} className="flex items-center gap-3 p-3 border-b border-gray-800">
                    <img src={notification.actor.avatar_url} alt={notification.actor.username} className="w-11 h-11 rounded-full object-cover" />
                    <p className="text-sm flex-1">
                        <span className="font-bold">{notification.actor.username}</span> {renderActivityText(notification)}
                        <span className="text-gray-500"> · {new Date(notification.timestamp).toLocaleDateString()}</span>
                    </p>
                    {notification.type === 'follow' ? (
                        <FollowButton user={notification.actor} currentUser={currentUser} onFollow={onFollow} onUnfollow={onUnfollow} />
                    ) : (
                        notification.post && notification.post.media[0] && <img src={notification.post.media[0].url} alt="post" className="w-11 h-11 object-cover rounded-md" />
                    )}
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 pt-16">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
