



import React from 'react';
import type { Notification, User } from '../types.ts';

interface ActivityViewProps {
  activities: Notification[];
}

const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const renderActivityText = (activity: Notification) => {
    switch (activity.type) {
      // Fix: Differentiate between post and reel likes/comments
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
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activity</h1>
      <div className="space-y-2">
        {activities.map(activity => (
          // Fix: Use activity.actor instead of activity.user and avatar_url
          <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg">
            <img src={activity.actor.avatar_url} alt={activity.actor.username} className="w-11 h-11 rounded-full object-cover" />
            <p className="text-sm flex-1">
                <span className="font-bold">{activity.actor.username}</span> {renderActivityText(activity)}
                <span className="text-gray-500"> · {new Date(activity.timestamp).toLocaleDateString()}</span>
            </p>
            {activity.post && activity.post.media[0] && <img src={activity.post.media[0].url} alt="post" className="w-11 h-11 object-cover rounded-md" />}
          </div>
        ))}
        {activities.length === 0 && <p className="text-center text-gray-500 pt-8">No activity yet.</p>}
      </div>
    </div>
  );
};

export default ActivityView;