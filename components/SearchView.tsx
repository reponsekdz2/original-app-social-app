
import React, { useState } from 'react';
import type { User, Post } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface SearchViewProps {
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onViewPost: (post: Post) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onClose, onViewProfile, onViewPost }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ users: User[], posts: Post[] }>({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    // In a real app, this would be an API call
    console.log(`Searching for: ${searchTerm}`);
    setTimeout(() => {
      // Mock results
      setResults({ users: [], posts: [] });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg w-full max-w-lg h-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for users, posts, tags..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 rounded-full px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
            </div>
          </form>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
             <div className="flex justify-center items-center h-full"><p>Searching...</p></div>
          ) : results.users.length === 0 && results.posts.length === 0 && searchTerm ? (
             <div className="text-center text-gray-400 pt-16">
                <p className="font-semibold">No results found for "{searchTerm}"</p>
                <p className="text-sm">Try searching for something else.</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 pt-16">
                <p>Search for people and posts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
