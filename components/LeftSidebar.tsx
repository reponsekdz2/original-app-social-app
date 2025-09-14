import React, { useState } from 'react';
import Icon from './Icon';
import NotificationsPanel from './NotificationsPanel';
import type { View } from '../types';

interface LeftSidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
    onCreatePost: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeView, onNavigate, onCreatePost }) => {
  const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const navItems = [
    { name: 'Home', view: 'home', icon: <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />, path: <path d="M12 5.432l8.159 8.159c.026.026.05.055.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.021a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.029.044-.058.07-.084L12 5.432z" /> },
    { name: 'Search', view: 'explore', icon: <path fillRule="evenodd" d="M10.9 3.9a7 7 0 100 14 7 7 0 000-14zM2 10.9a8.9 8.9 0 1116.35 4.3l3.39 3.39a1 1 0 01-1.42 1.42l-3.39-3.39A8.9 8.9 0 012 10.9z" clipRule="evenodd" /> },
    { name: 'Explore', view: 'explore', icon: <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM10.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm3.44 1.545a.75.75 0 01.365.922l-1.93 4.246a.75.75 0 01-1.352-.614l1.93-4.246a.75.75 0 01.987-.308z" clipRule="evenodd" /> },
    { name: 'Reels', view: 'reels', icon: <path d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V18.5c0 1.47-1.073 2.756-2.57 2.93a49.256 49.256 0 01-11.36 0c-1.497-.174-2.57-1.46-2.57-2.93V5.507c0-1.47 1.073-2.756 2.57-2.93z" />, path: <path d="M14.25 12a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z" /> },
    { name: 'Messages', view: 'messages', icon: <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /> },
    { name: 'Notifications', view: 'notifications', icon: <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001a.75.75 0 01.224-1.037l.428-.746a.45.45 0 00-.224-.194l-2.034-1.173a.75.75 0 01-.144-1.303l.006-.003c.1-.058.22-.078.332-.044a4.914 4.914 0 004.897-1.123 4.914 4.914 0 001.123-4.897c.034-.112.014-.232-.044-.332l-.003-.006a.75.75 0 01.776-.89l2.454.409a.75.75 0 01.665.665l.409 2.454a.75.75 0 01-.89.776l-.006-.003c-.1.058-.22-.078-.332-.044a4.914 4.914 0 00-4.897 1.123 4.914 4.914 0 00-1.123 4.897c-.034.112-.014.232.044.332l.003.006a.75.75 0 01-.144 1.303l-2.034 1.173a.45.45 0 00.224.194l.428.746a.75.75 0 01-.224 1.037h-.001z" /> },
    { name: 'Create', view: 'create', icon: <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" /> },
    { name: 'Profile', view: 'profile', icon: <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /> },
  ];

  const handleNavClick = (view: View | 'create' | 'notifications') => {
    if (view === 'create') {
        onCreatePost();
        setNotificationsPanelOpen(false);
    } else if (view === 'notifications') {
        setNotificationsPanelOpen(!isNotificationsPanelOpen);
    } else {
        onNavigate(view);
        setNotificationsPanelOpen(false);
    }
  };

  return (
    <>
      <aside className="w-64 h-screen fixed top-0 left-0 pt-16 border-r border-gray-800 hidden lg:flex flex-col z-20 bg-black">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map(item => {
                const isActive = activeView === item.view;
                return (
                  <li key={item.name}>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick(item.view as any); }} className={`flex items-center p-3 text-base font-normal rounded-lg transition-colors ${isActive ? 'bg-gray-800 text-white font-bold' : 'text-white hover:bg-gray-800'} group`}>
                      <Icon>{item.icon}{'path' in item && item.path}</Icon>
                      <span className="ml-3">{item.name}</span>
                    </a>
                  </li>
                );
            })}
          </ul>
        </div>
      </aside>
      {isNotificationsPanelOpen && <NotificationsPanel onClose={() => setNotificationsPanelOpen(false)} />}
    </>
  );
};

export default LeftSidebar;