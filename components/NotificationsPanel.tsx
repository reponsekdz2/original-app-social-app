// Fix: Create the NotificationsPanel component.
import React from 'react';
import type { Activity } from '../types';

interface NotificationsPanelProps {
  activities: Activity[];
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ activities, onClose }) => {
  const renderActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'like':
        return <>liked your post.</>;
      case 'comment':
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
    <div className="fixed top-0 left-0 w-screen h-screen z-30" onClick={onClose}>
        <div 
            className="fixed top-0 left-0 md:left-[72px] lg:left-64 w-[397px] h-screen bg-black border-r border-gray-800 z-40 shadow-2xl rounded-r-2xl flex flex-col transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                 <div className="border-t border-gray-800 flex-1 overflow-y-auto -mx-6">
                    {activities.map(activity => (
                        <div key={activity.id} className="flex items-center gap-3 p-4 hover:bg-gray-900">
                            <img src={activity.user.avatar} alt={activity.user.username} className="w-11 h-11 rounded-full object-cover" />
                            <p className="text-sm flex-1">
                                <span className="font-bold">{activity.user.username}</span> {renderActivityText(activity)}
                                <span className="text-gray-500"> · {activity.timestamp}</span>
                            </p>
                            {activity.post && <img src={activity.post.image} alt="post" className="w-11 h-11 object-cover rounded-md" />}
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    </div>
  );
};

export default NotificationsPanel;
