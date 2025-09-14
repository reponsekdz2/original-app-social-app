import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import type { View, User } from '../types';

interface HeaderProps {
  currentUser: User;
  onNavigate: (view: View) => void;
  onCreatePost: () => void;
  onSwitchAccount: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onCreatePost, onSwitchAccount }) => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-20 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-screen-xl">
        {/* This div is a placeholder to push content right when the sidebar is present */}
        <div className="w-64 hidden lg:block"></div>
        
        <button onClick={() => onNavigate('home')}>
            <h1 className="text-2xl font-bold text-red-600 tracking-wider uppercase">Netflixgram</h1>
        </button>

        <div className="hidden sm:block w-full max-w-xs">
           <div className="relative">
             <input
                type="text"
                placeholder="Search"
                className="bg-gray-900 border border-gray-700 rounded-lg w-full py-2 pl-10 pr-4 focus:outline-none focus:border-red-600 transition-colors"
             />
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-5 h-5 text-gray-500">
                    <path fillRule="evenodd" d="M10.9 3.9a7 7 0 100 14 7 7 0 000-14zM2 10.9a8.9 8.9 0 1116.35 4.3l3.39 3.39a1 1 0 01-1.42 1.42l-3.39-3.39A8.9 8.9 0 012 10.9z" clipRule="evenodd" />
                </Icon>
             </div>
           </div>
        </div>

        <nav className="flex items-center space-x-4">
          <button onClick={() => onNavigate('home')} className="text-white hover:text-red-600 transition-colors">
            <Icon>
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.026.026.05.055.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.021a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.029.044-.058.07-.084L12 5.432z" />
            </Icon>
          </button>
          <button onClick={() => onNavigate('messages')} className="text-white hover:text-red-600 transition-colors">
            <Icon>
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </Icon>
          </button>
          <button onClick={onCreatePost} className="text-white hover:text-red-600 transition-colors lg:hidden">
            <Icon>
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
            </Icon>
          </button>
           <button onClick={() => onNavigate('explore')} className="text-white hover:text-red-600 transition-colors">
            <Icon>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM10.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm3.44 1.545a.75.75 0 01.365.922l-1.93 4.246a.75.75 0 01-1.352-.614l1.93-4.246a.75.75 0 01.987-.308z" clipRule="evenodd" />
            </Icon>
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-red-600 transition-colors">
              <img src={currentUser.avatar} alt="Your profile" className="w-full h-full object-cover" />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                <div className="py-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('profile'); setProfileMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700">
                    <Icon className="mr-3"><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></Icon>
                    Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700">
                    <Icon className="mr-3"><path d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m3.75-1.5a3.75 3.75 0 00-3.75 3.75v12.344l4.28-2.258a.75.75 0 01.64 0l4.28 2.258V6a3.75 3.75 0 00-3.75-3.75h-1.72z" /></Icon>
                    Saved
                  </a>
                   <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700">
                    <Icon className="mr-3"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.94 1.542A4.505 4.505 0 005.25 6H4.5a.75.75 0 000 1.5h.75a4.505 4.505 0 003.388 4.458c.241.88 1.023 1.542 1.94 1.542s1.699-.662 1.94-1.542A4.505 4.505 0 0018.75 7.5h.75a.75.75 0 000-1.5h-.75a4.505 4.505 0 00-3.388-1.708c-.241-.88-1.023-1.542-1.94-1.542zM12 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" /></Icon>
                    Settings
                  </a>
                  <div className="border-t border-gray-700 my-1"></div>
                  <a href="#" onClick={(e) => { e.preventDefault(); onSwitchAccount(); setProfileMenuOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Switch account</a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;