
import React, { useState } from 'react';
// Fix: Corrected import path for types to be relative.
import type { User, Post as PostType, Reel as ReelType } from '../types.ts';
import ProfileHeader from './ProfileHeader.tsx';
import ProfileHighlights from './ProfileHighlights.tsx';
import ProfileTabs from './ProfileTabs.tsx';
import PostGrid from './PostGrid.tsx';
import ReelGrid from './ReelGrid.tsx';

interface ProfileViewProps {
  user: User;
  posts: PostType[];
  reels: ReelType[];
  isCurrentUser: boolean;
  currentUser: User;
  onEditProfile: () => void;
  onViewArchive: () => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onShowFollowers: (users: User[]) => void;
  onShowFollowing: (users: User[]) => void;
  onEditPost: (post: PostType) => void;
  onViewPost: (post: PostType) => void;
  onViewReel: (reel: ReelType) => void;
  onOpenCreateHighlightModal: () => void;
  onMessage: (user: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');

  const renderContent = () => {
    switch (activeTab) {
        case 'posts':
            return <PostGrid posts={props.posts} onViewPost={props.onViewPost} />;
        case 'reels':
            return <ReelGrid reels={props.reels} onViewReel={props.onViewReel} />;
        case 'tagged':
            return <div className="text-center text-gray-500 p-8">No tagged posts yet.</div>;
        default:
            return null;
    }
  }

  return (
    <div className="pb-16 md:pb-0">
      <ProfileHeader {...props} />
      <ProfileHighlights user={props.user} isCurrentUser={props.isCurrentUser} onAddNew={props.onOpenCreateHighlightModal} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileView;
