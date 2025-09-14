import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import type { Notification } from '../types';

interface NotificationsPanelProps {
    onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed top-0 left-0 w-screen h-screen z-20"
            onClick={onClose}
        >
            <div 
                className="fixed top-0 left-64 w-96 h-screen bg-black border-r border-gray-800 z-30 shadow-2xl transition-transform duration-300 ease-in-out transform translate-x-0 animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                    <div className="space-y-6 overflow-y-auto flex-1">
                        {MOCK_NOTIFICATIONS.map(notif => (
                            <div key={notif.id} className="flex items-center space-x-4">
                                <img src={notif.user.avatar} alt={notif.user.username} className="w-12 h-12 rounded-full"/>
                                <p className="flex-1 text-sm">
                                    <span className="font-bold">{notif.user.username}</span> {notif.action === 'liked' ? 'liked your post.' : notif.action === 'commented' ? 'commented on your post.' : 'started following you.'}
                                    <span className="text-gray-500"> {notif.timestamp}</span>
                                </p>
                                {notif.postImage && <img src={notif.postImage} alt="post" className="w-12 h-12 object-cover"/>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes slide-in {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default NotificationsPanel;