import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { User, Post } from '../types.ts';
import VerifiedBadge from './VerifiedBadge.tsx';
import FollowButton from './FollowButton.tsx';
import Icon from './Icon.tsx';

interface ProfileHeaderProps {
  user: User;
  posts: Post[];
  isCurrentUser: boolean;
  currentUser: User;
  onEditProfile: () => void;
  onViewArchive: () => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onShowFollowers: (users: User[]) => void;
  onShowFollowing: (users: User[]) => void;
  onMessage: (user: User) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    user, 
    posts, 
    isCurrentUser, 
    currentUser, 
    onEditProfile, 
    onViewArchive, 
    onFollow, 
    onUnfollow, 
    onShowFollowers, 
    onShowFollowing,
    onMessage
}) => {
  const stats = [
    { label: 'posts', value: posts.length, action: () => {} },
    { label: 'followers', value: user.followers.length, action: () => onShowFollowers(user.followers) },
    { label: 'following', value: user.following.length, action: () => onShowFollowing(user.following) },
  ];

  return (
    <header className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center">
        <img src={user.avatar} alt={user.username} className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-full object-cover flex-shrink-0" />
        <div className="ml-0 mt-4 sm:mt-0 sm:ml-6 md:ml-10 flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl">{user.username}</h1>
            <div className="flex items-center gap-2">
                {user.isVerified && <VerifiedBadge />}
                {user.isPrivate && <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 w-full">
            {isCurrentUser ? (
              <>
                <button onClick={onEditProfile} className="w-full sm:w-auto flex-1 bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-1.5 px-4 rounded-md">Edit Profile</button>
                <button onClick={onViewArchive} className="w-full sm:w-auto flex-1 bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-1.5 px-4 rounded-md">View Archive</button>
              </>
            ) : (
              <>
                <FollowButton className="w-full sm:w-auto flex-1" user={user} currentUser={currentUser} onFollow={onFollow} onUnfollow={onUnfollow} />
                <button onClick={() => onMessage(user)} className="w-full sm:w-auto flex-1 bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-1.5 px-4 rounded-md">Message</button>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-8 mb-4">
            {stats.map(stat => (
              <button key={stat.label} onClick={stat.action} className="text-left">
                <span className="font-semibold">{stat.value.toLocaleString()}</span> {stat.label}
              </button>
            ))}
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-gray-400 whitespace-pre-line text-sm">{user.bio}</p>
            {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold text-sm">{user.website}</a>}
          </div>
        </div>
      </div>
      <div className="sm:hidden mt-4">
        <p className="font-semibold text-sm">{user.name}</p>
        <p className="text-gray-400 whitespace-pre-line text-sm">{user.bio}</p>
        {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold text-sm">{user.website}</a>}
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
  );
};

export default ProfileHeader;