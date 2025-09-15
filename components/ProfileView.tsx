import React, { useState } from 'react';
import type { User, Post, StoryHighlight, Post as PostType } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import ProfileHighlight from './ProfileHighlight.tsx';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  isCurrentUser: boolean;
  onEditProfile: () => void;
  onViewArchive: () => void;
  onFollow: (userId: string) => void;
  onShowFollowers: (users: User[]) => void;
  onShowFollowing: (users: User[]) => void;
  onEditPost: (post: PostType) => void;
  onViewPost: (post: PostType) => void;
}

type ProfileTab = 'posts' | 'reels' | 'tagged';

const ProfileView: React.FC<ProfileViewProps> = ({ 
    user, 
    posts, 
    isCurrentUser, 
    onEditProfile, 
    onViewArchive,
    onFollow,
    onShowFollowers,
    onShowFollowing,
    onEditPost,
    onViewPost
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const stats = [
    { label: 'posts', value: posts.length, action: () => {} },
    { label: 'followers', value: user.followers.length, action: () => onShowFollowers(user.followers) },
    { label: 'following', value: user.following.length, action: () => onShowFollowing(user.following) },
  ];

  const tabItems = [
    { id: 'posts', label: 'Posts', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />},
    { id: 'reels', label: 'Reels', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />},
    { id: 'tagged', label: 'Tagged', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />},
  ];

  const renderContent = () => {
     return (
        <div className="grid grid-cols-3 gap-1">
            {posts.map(post => {
              const firstMedia = post.media[0];
              return (
                 <div key={post.id} className="relative aspect-square group cursor-pointer" onClick={() => onViewPost(post)}>
                    {firstMedia.type === 'video' ? (
                        <video src={firstMedia.url} className="w-full h-full object-cover" />
                    ) : (
                        <img src={firstMedia.url} alt="Post" className="w-full h-full object-cover" />
                    )}
                 </div>
              )
            })}
        </div>
     );
  };
  
  const AddNewHighlight: React.FC = () => (
     <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0">
      <div className="relative group w-20 h-28 flex flex-col items-center justify-center">
        <div className="w-full h-full rounded-xl bg-gray-800/50 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors">
            <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
        </div>
      </div>
      <p className="text-xs w-20 truncate text-center">Add New</p>
    </div>
  );

  return (
    <div className="pb-16 md:pb-0">
      <header className="p-4">
        <div className="flex items-center">
            <img src={user.avatar} alt={user.username} className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover" />
            <div className="ml-6 md:ml-10 flex-1">
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl">{user.username}</h1>
                    {user.isVerified && <VerifiedBadge />}
                </div>
                 <div className="flex items-center gap-2 mb-4">
                     {isCurrentUser ? (
                        <>
                            <button onClick={onEditProfile} className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-1.5 px-4 rounded-md">Edit Profile</button>
                            <button onClick={onViewArchive} className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-1.5 px-4 rounded-md">View Archive</button>
                        </>
                     ) : (
                        <>
                           <button onClick={() => onFollow(user.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-sm font-semibold py-1.5 px-4 rounded-md">Follow</button>
                           <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-1.5 px-4 rounded-md">Message</button>
                        </>
                     )}
                 </div>
                <div className="hidden md:flex items-center gap-8 mb-4">
                    {stats.map(stat => (
                        <button key={stat.label} onClick={stat.action} className="text-left"><span className="font-semibold">{stat.value.toLocaleString()}</span> {stat.label}</button>
                    ))}
                </div>
                <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-400 whitespace-pre-line text-sm">{user.bio}</p>
                    {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold text-sm">{user.website}</a>}
                </div>
            </div>
        </div>
         <div className="flex md:hidden items-center justify-around border-t border-b border-gray-800 mt-4 py-2">
            {stats.map(stat => (
                <button key={stat.label} onClick={stat.action} className="text-center">
                    <p className="font-semibold">{stat.value.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                </button>
            ))}
        </div>
      </header>

      {user.highlights && user.highlights.length > 0 && (
        <div className="px-4 py-2">
            <div className="flex space-x-4">
                {user.highlights.map(h => <ProfileHighlight key={h.id} highlight={h} />)}
                {isCurrentUser && <AddNewHighlight />}
            </div>
        </div>
      )}

      <div className="border-t border-gray-800 mt-4">
        <div className="flex justify-center">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex-1 md:flex-none md:px-16 py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === tab.id ? 'text-white border-t-2 border-white' : 'text-gray-500'}`}
            >
              <Icon className="w-5 h-5">{tab.icon}</Icon>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="p-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfileView;