import React, { useState } from 'react';
import type { User, Post } from '../types';
import Icon from './Icon';
import ProfileHighlight from './ProfileHighlight';
import VerifiedBadge from './VerifiedBadge';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  onEditProfile: () => void;
  onViewArchive: () => void;
  onViewFollowers: () => void;
  onViewFollowing: () => void;
  onCreatePost: () => void;
}

type ProfileTab = 'posts' | 'saved' | 'tagged';

const ProfileView: React.FC<ProfileViewProps> = ({ user, posts, onEditProfile, onViewArchive, onViewFollowers, onViewFollowing, onCreatePost }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

    const renderGrid = () => {
        return (
             <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                    <div key={post.id} className="relative aspect-square group cursor-pointer">
                        {/* Fix: Use post.media and handle video type */}
                        {post.mediaType === 'video' ? (
                          <video src={post.media} className="w-full h-full object-cover" />
                        ) : (
                          <img src={post.media} alt="Post" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <div className="text-white opacity-0 group-hover:opacity-100 flex items-center space-x-4">
                                <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" /></Icon>{post.likes}</span>
                                <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" /></Icon>{post.comments.length}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const AddHighlight: React.FC = () => (
      <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0">
        <div className="w-20 h-28 rounded-xl bg-gray-800/50 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors">
            <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
        </div>
        <p className="text-xs w-20 truncate text-center">New</p>
      </div>
    );

    return (
        <div className="pb-16 md:pb-4">
            <header className="p-4 md:p-8 flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/4 flex justify-center flex-shrink-0 mb-4 sm:mb-0">
                    <img src={user.avatar} alt={user.username} className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover" />
                </div>
                <div className="w-full sm:w-3/4 px-4 flex flex-col">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                        <h2 className="text-2xl flex items-center gap-2">{user.username} {user.isVerified && <VerifiedBadge />}</h2>
                        <div className="flex gap-2">
                           <button onClick={onEditProfile} className="bg-gray-800 font-semibold px-4 py-1.5 rounded-md text-sm">Edit Profile</button>
                           <button onClick={onViewArchive} className="bg-gray-800 font-semibold px-4 py-1.5 rounded-md text-sm">View Archive</button>
                           <button onClick={onCreatePost} className="bg-gray-800 font-semibold px-2 py-1.5 rounded-md text-sm">
                                <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                           </button>
                        </div>
                    </div>
                     <div className="hidden md:flex items-center space-x-8 mb-4">
                        <p><span className="font-semibold">{posts.length}</span> posts</p>
                        <button onClick={onViewFollowers}><span className="font-semibold">{user.followers.length}</span> followers</button>
                        <button onClick={onViewFollowing}><span className="font-semibold">{user.following.length}</span> following</button>
                    </div>
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-400 whitespace-pre-wrap">{user.bio}</p>
                    </div>
                </div>
            </header>
            
            <div className="flex md:hidden items-center justify-around mb-4 border-y border-gray-800 py-2 text-center">
                <div><p className="font-semibold">{posts.length}</p><p className="text-sm text-gray-400">posts</p></div>
                <button onClick={onViewFollowers}><p className="font-semibold">{user.followers.length}</p><p className="text-sm text-gray-400">followers</p></button>
                <button onClick={onViewFollowing}><p className="font-semibold">{user.following.length}</p><p className="text-sm text-gray-400">following</p></button>
            </div>


            <div className="px-4 md:px-8">
                 <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    {user.highlights?.map(h => <ProfileHighlight key={h.id} highlight={h} />)}
                    <AddHighlight />
                </div>
            </div>

            <div className="border-t border-gray-800 mt-4">
                <div className="flex justify-center text-sm font-semibold text-gray-400">
                    <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 p-4 ${activeTab === 'posts' ? 'text-white border-t border-white' : ''}`}>POSTS</button>
                    <button onClick={() => setActiveTab('saved')} className={`flex items-center gap-2 p-4 ${activeTab === 'saved' ? 'text-white border-t border-white' : ''}`}>SAVED</button>
                    <button onClick={() => setActiveTab('tagged')} className={`flex items-center gap-2 p-4 ${activeTab === 'tagged' ? 'text-white border-t border-white' : ''}`}>TAGGED</button>
                </div>
                <div>
                    {renderGrid()}
                </div>
            </div>

        </div>
    );
};

export default ProfileView;