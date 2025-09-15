import React, { useState } from 'react';
import type { User, Post as PostType } from '../types.ts';
import ProfileHeader from './ProfileHeader.tsx';
import ProfileHighlights from './ProfileHighlights.tsx';
import ProfileTabs from './ProfileTabs.tsx';
import PostGrid from './PostGrid.tsx';

interface ProfileViewProps {
  user: User;
  posts: PostType[];
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
  onOpenCreateHighlightModal: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');

  return (
    <div className="pb-16 md:pb-0">
      <ProfileHeader {...props} />
      <ProfileHighlights user={props.user} isCurrentUser={props.isCurrentUser} onAddNew={props.onOpenCreateHighlightModal} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-1">
        <PostGrid posts={props.posts} onViewPost={props.onViewPost} />
      </div>
    </div>
  );
};

export default ProfileView;