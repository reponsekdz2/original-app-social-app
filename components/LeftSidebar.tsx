import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick, children }) => (
  <button onClick={onClick} className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 relative ${active ? 'bg-gray-900 font-bold' : 'font-normal'}`}>
    <div className={`w-7 h-7 ${active ? 'text-white' : 'text-white'}`}>{icon}</div>
    <span className={`ml-4 text-base`}>{label}</span>
    {children}
  </button>
);

const MoreMenu: React.FC<{onClose: () => void}> = ({ onClose }) => (
  <div className="absolute bottom-full mb-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-20">
    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700">
      <Icon className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></Icon>
      Settings
    </button>
     <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700">
      <Icon className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
      Your activity
    </button>
    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700">
       <Icon className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon>
       Saved
    </button>
     <div className="my-1 h-px bg-gray-700"></div>
    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700">
      Log Out
    </button>
  </div>
);

interface LeftSidebarProps {
    onCreatePost: () => void;
    onOpenMessages: () => void;
    unreadMessagesCount: number;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onCreatePost, onOpenMessages, unreadMessagesCount }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="w-60 h-screen fixed top-0 pt-16 border-r border-gray-800 flex flex-col p-4">
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavItem 
          icon={<Icon><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.026.026.05.055.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.021a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.029.044-.058.07-.084L12 5.432z" /></Icon>} 
          label="Home" 
          active 
        />
        <NavItem 
          icon={<Icon><path fillRule="evenodd" d="M10.9 3.9a7 7 0 100 14 7 7 0 000-14zM2 10.9a8.9 8.9 0 1116.35 4.3l3.39 3.39a1 1 0 01-1.42 1.42l-3.39-3.39A8.9 8.9 0 012 10.9z" clipRule="evenodd" /></Icon>} 
          label="Explore" 
        />
        <NavItem 
          icon={<Icon><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.383-3.732a.75.75 0 00-1.266-.75l-4.5 6a.75.75 0 00.52 1.282h1.754a.75.75 0 00.52-1.282l-1.4-1.867 3.372-4.383z" clipRule="evenodd" /></Icon>} 
          label="Reels" 
        />
        <NavItem 
          onClick={onOpenMessages}
          icon={<Icon><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></Icon>} 
          label="Messages"
        >
          {unreadMessagesCount > 0 && (
            <span className="absolute left-5 top-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-xs font-bold text-white bg-red-600 rounded-full">{unreadMessagesCount}</span>
          )}
        </NavItem>
        <NavItem 
          icon={<Icon><path fillRule="evenodd" d="M11.645 20.91l-1.42-1.42a.75.75 0 010-1.061l3.828-3.828a.75.75 0 00-1.06-1.06l-3.828 3.828a.75.75 0 01-1.06 0l-1.42-1.42a.75.75 0 010-1.06l6.364-6.364a.75.75 0 011.06 0l6.364 6.364a.75.75 0 010 1.06l-1.42 1.42a.75.75 0 01-1.06 0l-3.828-3.828a.75.75 0 00-1.06 1.06l3.828 3.828a.75.75 0 010 1.06l-1.42 1.42a.75.75 0 01-1.06 0z" clipRule="evenodd" /></Icon>} 
          label="Notifications"
        >
           <span className="absolute left-7 top-3 block w-2 h-2 bg-red-600 rounded-full"></span>
        </NavItem>
        <NavItem 
          onClick={onCreatePost}
          icon={<Icon><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" /></Icon>} 
          label="Create" 
        />
        <NavItem 
          icon={<Icon><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></Icon>} 
          label="Profile" 
        />
      </nav>
      <div className="mt-auto relative" ref={moreMenuRef}>
        {isMoreMenuOpen && <MoreMenu onClose={() => setIsMoreMenuOpen(false)} />}
        <NavItem 
          onClick={() => setIsMoreMenuOpen(prev => !prev)}
          icon={<Icon><path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></Icon>} 
          label="More" 
        />
      </div>
    </aside>
  );
};

export default LeftSidebar;