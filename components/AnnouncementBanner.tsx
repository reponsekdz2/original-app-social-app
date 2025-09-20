import React, { useState } from 'react';
import type { Announcement } from '../types';
import Icon from './Icon.tsx';

interface AnnouncementBannerProps {
  announcement: Announcement;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcement }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getColors = () => {
    switch (announcement.type) {
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'info':
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  return (
    <div className={`w-full p-3 border-b text-sm flex items-center justify-between gap-4 ${getColors()}`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
        <div>
            <span className="font-bold">{announcement.title}:</span> {announcement.content}
        </div>
      </div>
      <button onClick={() => setIsVisible(false)} className="p-1 rounded-full hover:bg-white/10">
        <Icon className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></Icon>
      </button>
    </div>
  );
};

export default AnnouncementBanner;