

import React from 'react';
import Icon from './Icon.tsx';
// Fix: Corrected import path for types to be relative.
import type { View, User } from '../types.ts';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onCreatePost: () => void;
  currentUser: User;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onCreatePost, currentUser }) => {
  const navItems = [
    { view: 'home', icon: (active: boolean) => <Icon>{active ? <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" fill="currentColor" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />}</Icon> },
    { view: 'explore', icon: (active: boolean) => <Icon>{active ? <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />}</Icon> },
    { view: 'reels', icon: (active: boolean) => <Icon>{active ? <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}</Icon> },
    { view: 'create', icon: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>, action: onCreatePost },
    { view: 'profile', icon: (active: boolean) => <img src={currentUser.avatar} alt="Profile" className={`w-7 h-7 rounded-full object-cover ring-2 ${active ? 'ring-white' : 'ring-transparent'}`} />, action: () => onNavigate('profile') },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around p-1 md:hidden z-40">
      {navItems.map(item => (
        <button key={item.view} onClick={item.action ? item.action : () => onNavigate(item.view as View)} className="p-2">
          <div className="w-7 h-7">
            {item.icon(currentView === item.view)}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
