import React from 'react';
import type { Announcement } from '../types.ts';
import Icon from './Icon.tsx';

interface AnnouncementBannerProps {
  announcement: Announcement;
  onClose: () => void;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcement, onClose }) => {
  const styles = {
    info: 'bg-blue-500/80',
    warning: 'bg-yellow-500/80',
    success: 'bg-green-500/80',
  };

  return (
    <div className={`w-full p-3 text-sm text-center text-white backdrop-blur-sm ${styles[announcement.type]}`}>
      <div className="container mx-auto flex items-center justify-center relative">
        <span className="font-bold mr-2">{announcement.title}</span>
        <span>{announcement.content}</span>
        <button onClick={onClose} className="absolute -top-1 -right-1 p-1">
          <Icon className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;