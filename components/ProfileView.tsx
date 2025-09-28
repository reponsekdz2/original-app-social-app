import React, { useState, useEffect } from 'react';
import type { User, Post, Reel } from '../types.ts';
import * as api from '../services/apiService.ts';
import ProfileHeader from './ProfileHeader.tsx';
import ProfileHighlights from './ProfileHighlights.tsx';
import ProfileTabs from './ProfileTabs.tsx';
import PostGrid from './PostGrid.tsx';
import ReelGrid from './ReelGrid.tsx';
import Icon from './Icon.tsx';

interface ProfileViewProps {
  user: User | null;
  isCurrentUser: boolean;
  currentUser: User;
  onNavigate: (view: 'settings' | 'archive' | 'messages', user?: User) => void;
  onShowFollowers: (users: User[]) => void;
  onShowFollowing: (users: User[]) => void;
}

const ProfileGridSkeleton: React.FC = () => (
    <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-800 animate-pulse"></div>
        ))}
    </div>
);

const ProfileView: React.FC<ProfileViewProps> = (props) => {
    const { user: initialUser, isCurrentUser, currentUser, onNavigate, onShowFollowers, onShowFollowing } = props;
    
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!initialUser) return;
            setIsLoading(true);
            try {
                const profileData = await api.getUserProfile(initialUser.username);
                setUser(profileData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [initialUser?.username]);

  if (!user && isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div></div>;
  }
  
  if (!user) {
      return <div className="text-center p-12">User not found.</div>
  }

  const renderContent = () => {
    if (isLoading) return <ProfileGridSkeleton />;
    if (user.isPrivate && !isCurrentUser && !(currentUser.following?.some(u => u.id === user.id))) {
        return <div className="text-center p-12 text-gray-400">
            <Icon className="w-16 h-16 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon>
            <h3 className="font-bold">This Account is Private</h3>
            <p>Follow to see their photos and videos.</p>
        </div>;
    }
    
    switch (activeTab) {
      case 'posts':
        return user.posts && user.posts.length > 0
          ? <PostGrid posts={user.posts} onViewPost={() => {}} />
          : <div className="text-center p-12 text-gray-400"><p>No posts yet.</p></div>;
      case 'reels':
        return user.reels && user.reels.length > 0
          ? <ReelGrid reels={user.reels} onViewReel={() => {}} />
          : <div className="text-center p-12 text-gray-400"><p>No reels yet.</p></div>;
      case 'tagged':
        return <div className="text-center p-12 text-gray-400"><p>No tagged posts yet.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <ProfileHeader 
        user={user}
        isCurrentUser={isCurrentUser}
        currentUser={currentUser}
        onEditProfile={() => {}}
        onViewArchive={() => onNavigate('archive')}
        onFollow={() => {}}
        onUnfollow={() => {}}
        onShowFollowers={onShowFollowers}
        onShowFollowing={onShowFollowing}
        onMessage={(userToMessage) => onNavigate('messages', userToMessage)}
      />
      <ProfileHighlights 
        user={user}
        isCurrentUser={isCurrentUser}
        onAddNew={() => {}}
      />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileView;