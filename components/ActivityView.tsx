// Fix: Create the ActivityView component.
import React from 'react';
// Fix: Add .ts extension to import to resolve module.
import type { Activity } from '../types.ts';

interface ActivityViewProps {
  activities: Activity[];
}

const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activity</h1>
      <div className="space-y-2">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg">
            <img src={activity.user.avatar} alt={activity.user.username} className="w-11 h-11 rounded-full object-cover" />
            <p className="text-sm flex-1">
                <span className="font-bold">{activity.user.username}</span> {renderActivityText(activity)}
                <span className="text-gray-500"> · {activity.timestamp}</span>
            </p>
            {/* Fix: Use the correct 'media' property instead of 'image' */}
            {activity.post && <img src={activity.post.media} alt="post" className="w-11 h-11 object-cover rounded-md" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityView;