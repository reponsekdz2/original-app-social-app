import React from 'react';
import Icon from './Icon.tsx';

interface MediaViewerModalProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  onClose: () => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ mediaUrl, mediaType, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white z-10" onClick={onClose}>
        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
      </button>
      <div className="max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {mediaType === 'image' ? (
          <img src={mediaUrl} alt="Media content" className="max-w-full max-h-full object-contain" />
        ) : (
          <video src={mediaUrl} controls autoPlay className="max-w-full max-h-full object-contain" />
        )}
      </div>
    </div>
  );
};

export default MediaViewerModal;