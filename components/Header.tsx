import React from 'react';
import Icon from './Icon';

interface HeaderProps {
  onCreatePost: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreatePost }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-screen-xl">
        <h1 className="text-2xl font-bold text-red-600 tracking-wider uppercase">Netflixgram</h1>

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
          <button className="text-white hover:text-red-600 transition-colors">
            <Icon>
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.026.026.05.055.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.021a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.029.044-.058.07-.084L12 5.432z" />
            </Icon>
          </button>
          <button className="text-white hover:text-red-600 transition-colors">
            <Icon>
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </Icon>
          </button>
          <button onClick={onCreatePost} className="text-white hover:text-red-600 transition-colors lg:hidden">
            <Icon>
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
            </Icon>
          </button>
           <button className="text-white hover:text-red-600 transition-colors">
            <Icon>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM10.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm3.44 1.545a.75.75 0 01.365.922l-1.93 4.246a.75.75 0 01-1.352-.614l1.93-4.246a.75.75 0 01.987-.308z" clipRule="evenodd" />
            </Icon>
          </button>
          <button className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-red-600 transition-colors">
            <img src="https://picsum.photos/seed/you/100/100" alt="Your profile" className="w-full h-full object-cover" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;