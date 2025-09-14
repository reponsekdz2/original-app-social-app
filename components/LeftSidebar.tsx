import React from 'react';
import Icon from './Icon';
import type { View } from '../types';

interface LeftSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onShowNotifications: () => void;
  onShowSearch: () => void;
  onCreatePost: () => void;
}

const NavItem: React.FC<{
    icon: (isActive: boolean) => React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-4 p-3 rounded-lg w-full text-left transition-colors hover:bg-white/10"
    >
        <div className="w-7 h-7">{icon(isActive)}</div>
        <span className={`hidden lg:inline text-base ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentView, onNavigate, onShowNotifications, onShowSearch, onCreatePost }) => {
  const navItems = [
    { view: 'home', label: 'Home', icon: (active: boolean) => <Icon>{active ? <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" fill="currentColor" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />}</Icon> },
    { view: 'explore', label: 'Explore', icon: (active: boolean) => <Icon>{active ? <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />}</Icon> },
    { view: 'reels', label: 'Reels', icon: (active: boolean) => <Icon>{active ? <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /> : <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}</Icon> },
    { view: 'messages', label: 'Messages', icon: (active: boolean) => <Icon>{active ? <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />}</Icon> },
  ];

  const actionItems = [
     { label: 'Search', icon: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>, action: onShowSearch },
     { label: 'Notifications', icon: (active: boolean) => <Icon>{active ? <path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" fill="currentColor" /> : <path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" />}</Icon>, action: onShowNotifications },
     { label: 'Create', icon: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>, action: onCreatePost },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full bg-black/80 backdrop-blur-md border-r border-gray-800 p-2 md:p-4 z-40 flex-col justify-between hidden md:flex w-[72px] lg:w-64 transition-all duration-300">
      <div>
        <div className="mb-8 p-3 hidden lg:block">
            <h1 className="text-2xl font-serif font-bold tracking-wider text-red-600">Netflixgram</h1>
        </div>
         <div className="mb-8 p-3 block lg:hidden">
             <Icon className="w-8 h-8 text-red-600"><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A6.75 6.75 0 0115.75 12c0 1.863-.76 3.56-2.002 4.785a.75.75 0 101.12 1.002A8.25 8.25 0 0017.25 12c0-4.556-3.694-8.25-8.25-8.25S.75 7.444.75 12c0 1.57.44 3.044 1.22 4.285a.75.75 0 101.12-1.002A6.75 6.75 0 018.25 12a6.75 6.75 0 013.642-6.012.75.75 0 001.07-1.052z" clipRule="evenodd" /></Icon>
        </div>
        <nav className="space-y-2">
            {navItems.map(item => (
                <NavItem 
                    key={item.view}
                    label={item.label}
                    icon={item.icon}
                    isActive={currentView === item.view}
                    onClick={() => onNavigate(item.view as View)}
                />
            ))}
             {actionItems.map(item => (
                <NavItem 
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    isActive={false}
                    onClick={item.action}
                />
            ))}
             <NavItem 
                label="Profile"
                icon={(active) => <img src="/avatars/avatar1.jpg" alt="Profile" className={`w-7 h-7 rounded-full object-cover ring-2 ${active ? 'ring-white' : 'ring-transparent'}`} />}
                isActive={currentView === 'profile'}
                onClick={() => onNavigate('profile')}
            />
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
