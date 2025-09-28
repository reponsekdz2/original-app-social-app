import React, { useState, useEffect, useCallback } from 'react';
import type { User, Post } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import * as api from '../services/apiService.ts';
import { useDebounce } from '../hooks/useDebounce.ts';

interface SearchViewProps {
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onViewPost: (post: Post) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onClose, onViewProfile, onViewPost }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ users: User[], posts: Post[] }>({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const performSearch = async () => {
        if (!debouncedSearchTerm.trim()) {
            setResults({ users: [], posts: [] });
            return;
        }
        setIsLoading(true);
        try {
            const searchResults = await api.search(debouncedSearchTerm);
            setResults(searchResults);
        } catch (error) {
            console.error("Search failed:", error);
            setResults({ users: [], posts: [] });
        } finally {
            setIsLoading(false);
        }
    };
    
    performSearch();
  }, [debouncedSearchTerm]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center p-4 pt-16 sm:pt-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg w-full max-w-lg h-full max-h-[80vh] flex flex-col animate-modal-intro" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
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
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
             <div className="flex justify-center items-center h-full"><div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div></div>
          ) : results.users.length === 0 && results.posts.length === 0 && debouncedSearchTerm ? (
             <div className="text-center text-gray-400 pt-16">
                <p className="font-semibold">No results found for "{debouncedSearchTerm}"</p>
                <p className="text-sm">Try searching for something else.</p>
            </div>
          ) : (
            <>
                {results.users.length > 0 && (
                    <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">Users</h3>
                        {results.users.map(user => (
                            <div key={user.id} onClick={() => onViewProfile(user)} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <img src={user.avatar_url} alt={user.username} className="w-11 h-11 rounded-full" />
                                <div>
                                    <p className="font-semibold flex items-center">{user.username} {user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                                    <p className="text-sm text-gray-400">{user.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {results.posts.length > 0 && (
                     <div className="p-2">
                        <h3 className="font-bold text-lg my-2">Posts</h3>
                        <div className="grid grid-cols-3 gap-1">
                            {results.posts.map(post => (
                                <div key={post.id} onClick={() => onViewPost(post)} className="aspect-square bg-gray-800 rounded cursor-pointer">
                                     <img src={(post.media[0] as any).url || (post as any).media_url} alt="Post" className="w-full h-full object-cover rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;