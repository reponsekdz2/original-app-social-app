import React, { useState, useEffect } from 'react';
import type { User, View, Post as PostType, Story as StoryType } from './types.ts';
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES, MOCK_REELS, MOCK_CONVERSATIONS, MOCK_ACTIVITIES } from './constants.ts';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import PremiumView from './components/PremiumView.tsx';
import ActivityView from './components/ActivityView.tsx';
import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewedPost, setViewedPost] = useState<PostType | null>(null);
  const [viewedStory, setViewedStory] = useState<StoryType | null>(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<PostType | null>(null);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [isGetVerifiedModalOpen, setGetVerifiedModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  
  const [posts, setPosts] = useState(MOCK_POSTS);
  
  const handleLike = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === postId ? {...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes -1 : p.likes + 1 } : p))
  }
  const handleSave = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === postId ? {...p, isSaved: !p.isSaved } : p))
  }

  const handleShare = (post: PostType) => {
    setPostToShare(post);
    setShareModalOpen(true);
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView posts={posts} stories={MOCK_STORIES} currentUser={currentUser} onLike={handleLike} onComment={() => {}} onViewPost={setViewedPost} onViewStory={setViewedStory} onSave={handleSave} onShare={handleShare} onCreateStory={() => setCreateStoryModalOpen(true)} />;
      case 'explore':
        return <ExploreView posts={MOCK_POSTS} />;
      case 'reels':
        return <ReelsView reels={MOCK_REELS} />;
      case 'messages':
        return <MessagesView currentUser={currentUser} conversations={MOCK_CONVERSATIONS} />;
      case 'profile':
        return <ProfileView user={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)} />;
      case 'settings':
        return <SettingsView onGetVerified={() => setGetVerifiedModalOpen(true)} onEditProfile={() => {}} onChangePassword={() => setChangePasswordModalOpen(true)} isPrivateAccount={false} onTogglePrivateAccount={() => {}} isTwoFactorEnabled={false} onToggleTwoFactor={() => {}} />;
      case 'saved':
        return <SavedView posts={posts.filter(p => p.isSaved)} />;
      case 'archive':
         return <ArchiveView posts={[]} />;
      case 'premium':
        return <PremiumView onSubscribe={() => {}} isCurrentUserPremium={currentUser.isPremium || false} />;
      case 'activity':
        return <ActivityView activities={MOCK_ACTIVITIES} />;
      default:
        return <HomeView posts={posts} stories={MOCK_STORIES} currentUser={currentUser} onLike={handleLike} onComment={() => {}} onViewPost={setViewedPost} onViewStory={setViewedStory} onSave={handleSave} onShare={handleShare} onCreateStory={() => setCreateStoryModalOpen(true)} />;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="flex">
        <LeftSidebar 
            currentView={currentView}
            onNavigate={setCurrentView}
            onCreatePost={() => setCreatePostModalOpen(true)}
            onShowNotifications={() => setNotificationsVisible(true)}
            onShowSearch={() => setSearchVisible(true)}
        />
        <main className="w-full md:pl-[72px] lg:pl-64">
           <Header 
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onSwitchAccount={() => setAccountSwitcherOpen(true)}
              onCreatePost={() => setCreatePostModalOpen(true)}
              onShowNotifications={() => setNotificationsVisible(p => !p)}
              onShowSearch={() => setSearchVisible(p => !p)}
            />
          <div className="container mx-auto max-w-4xl">
            {renderView()}
          </div>
        </main>
      </div>

      <BottomNav 
        currentView={currentView}
        onNavigate={setCurrentView}
        onCreatePost={() => setCreatePostModalOpen(true)}
        currentUser={currentUser}
      />
      
      {viewedPost && <PostModal post={viewedPost} onClose={() => setViewedPost(null)} />}
      {viewedStory && <StoryViewer story={viewedStory} onClose={() => setViewedStory(null)} />}
      {isCreatePostModalOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostModalOpen(false)} onCreatePost={() => setCreatePostModalOpen(false)} />}
      {isCreateStoryModalOpen && <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreateStory={() => setCreateStoryModalOpen(false)} />}
      {isAccountSwitcherOpen && <AccountSwitcherModal users={MOCK_USERS} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => {setCurrentUser(user); setAccountSwitcherOpen(false)}} />}
      {isShareModalOpen && <ShareModal post={postToShare} onClose={() => setShareModalOpen(false)} />}
      {isSearchVisible && <SearchView users={MOCK_USERS} onClose={() => setSearchVisible(false)} />}
      {isNotificationsVisible && <NotificationsPanel activities={MOCK_ACTIVITIES} onClose={() => setNotificationsVisible(false)} />}
      {isGetVerifiedModalOpen && <GetVerifiedModal onClose={() => setGetVerifiedModalOpen(false)} />}
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setChangePasswordModalOpen(false)} />}
    </div>
  );
}

export default App;
