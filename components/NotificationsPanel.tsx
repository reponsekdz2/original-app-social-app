import React from 'react';
import type { Notification, User } from '../types.ts';
import Icon from './Icon.tsx';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onMarkAsRead: () => void;
  onCollaborationResponse: (postId: string, action: 'accept' | 'decline') => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onViewProfile, onMarkAsRead, onCollaborationResponse }) => {
  const renderNotificationText = (notification: Notification) => {
    switch (notification.type) {
      // Fix: Handle specific like and comment types
      case 'like_post':
      case 'like_reel':
        return <>liked your {notification.type.includes('reel') ? 'reel' : 'post'}.</>;
      case 'comment_post':
      case 'comment_reel':
        return <>commented: "{notification.commentText}"</>;
      case 'follow':
        return <>started following you.</>;
      case 'mention':
        return <>mentioned you in a comment.</>;
      case 'collab_invite':
        return <>invited you to collaborate on a post.</>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-30" onClick={onClose}>
      <div 
        className="fixed top-0 left-0 md:left-[72px] lg:left-64 w-[397px] h-screen bg-black border-r border-gray-800 z-40 shadow-2xl rounded-r-2xl flex flex-col transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Notifications</h2>
          <div className="border-t border-gray-800 flex-1 overflow-y-auto -mx-6">
            {notifications.length > 0 ? (
              <div className="py-2">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-4 hover:bg-gray-800/50">
                    {/* Fix: Use notification.actor instead of notification.user and avatar_url */}
                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => onViewProfile(notification.actor)}>
                        <img src={notification.actor.avatar_url} alt={notification.actor.username} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{notification.actor.username}</span> {renderNotificationText(notification)}
                          </p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                        {notification.post && <img src={notification.post.media[0].url} alt="post" className="w-11 h-11 rounded-md object-cover" />}
                    </div>
                    {notification.type === 'collab_invite' && notification.post && (
                        <div className="mt-2 flex items-center gap-2 pl-12">
                            <button onClick={() => onCollaborationResponse(notification.post!.id, 'accept')} className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-red-700">Accept</button>
                            <button onClick={() => onCollaborationResponse(notification.post!.id, 'decline')} className="bg-gray-700 text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-gray-600">Decline</button>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 p-8">No new notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;