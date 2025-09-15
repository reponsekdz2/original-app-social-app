import React, { useState, useEffect } from 'react';
import type { User, View, Post as PostType, Story as StoryType, Comment, StoryItem, NotificationSettings } from './types.ts';
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES, MOCK_REELS, MOCK_CONVERSATIONS, MOCK_ACTIVITIES, MOCK_ADS, MOCK_FEED_ACTIVITIES, MOCK_TRENDING_TOPICS } from './constants.ts';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
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
import EditProfileModal from './components/EditProfileModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewedProfile, setViewedProfile] = useState<User | null>(null);

  // Modals and Panels State
  const [viewedPost, setViewedPost] = useState<PostType | null>(null);
  const [viewedStory, setViewedStory] = useState<{ stories: StoryType[], startIndex: number } | null>(null);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<PostType | null>(null);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [isGetVerifiedModalOpen, setGetVerifiedModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [followListModal, setFollowListModal] = useState<{ title: 'Followers' | 'Following', users: User[] } | null>(null);
  const [likesModalUsers, setLikesModalUsers] = useState<User[] | null>(null);

  // Content State
  const [posts, setPosts] = useState<PostType[]>(MOCK_POSTS);
  const [stories, setStories] = useState<StoryType[]>(MOCK_STORIES);
  
  // App-wide Settings State
  const [isPrivateAccount, setPrivateAccount] = useState(false);
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ likes: true, comments: true, follows: false });


  // Handlers
  const handleNavigate = (view: View, profileUser: User | null = null) => {
      if (view === 'profile' && profileUser) {
          setViewedProfile(profileUser);
      } else if (view === 'profile' && !profileUser) {
          setViewedProfile(null); // Viewing own profile
      }
      setCurrentView(view);
  };
  
  const handleViewProfile = (user: User) => {
      handleNavigate('profile', user);
      setSearchVisible(false);
      if (likesModalUsers) setLikesModalUsers(null);
  };
  
  const handleFollow = (userIdToFollow: string) => {
      // This is a mock implementation. In a real app, this would be an API call.
      const isFollowing = currentUser.following.some(u => u.id === userIdToFollow);

      let updatedCurrentUser = { ...currentUser };

      if (isFollowing) {
          updatedCurrentUser.following = currentUser.following.filter(u => u.id !== userIdToFollow);
      } else {
          const userToFollow = users.find(u => u.id === userIdToFollow);
          if (userToFollow) {
              updatedCurrentUser.following = [...currentUser.following, userToFollow];
          }
      }
      
      setCurrentUser(updatedCurrentUser);

      // Also update the viewed profile if it's the one being followed/unfollowed
      if (viewedProfile && viewedProfile.id === userIdToFollow) {
          let updatedViewedProfile = { ...viewedProfile };
           if (isFollowing) {
              // This is a simplification; we're not updating the other user's followers list
           } else {
              // Same simplification
           }
      }
  };

  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setEditProfileModalOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            const isLiked = !p.isLiked;
            const newLikes = isLiked ? p.likes + 1 : p.likes - 1;
            const newLikedBy = isLiked 
                ? [...p.likedBy, currentUser]
                : p.likedBy.filter(u => u.id !== currentUser.id);
            return {...p, isLiked, likes: newLikes, likedBy: newLikedBy};
        }
        return p;
    }));
  };
  
  const handleViewLikes = (users: User[]) => {
      setLikesModalUsers(users);
  };
  
  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? {...p, isSaved: !p.isSaved } : p));
  };

  const handleComment = (postId: string, commentText: string) => {
      const newComment: Comment = {
          id: `c-${Date.now()}`,
          user: currentUser,
          text: commentText,
          timestamp: 'Just now',
          likes: 0,
          likedByUser: false,
      };
      setPosts(prev => prev.map(p => p.id === postId ? {...p, comments: [...p.comments, newComment] } : p));
  };
  
  const handleLikeComment = (postId: string, commentId: string) => {
      setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === postId) {
              const updatedComments = p.comments.map(c => {
                  if (c.id === commentId) {
                      return { ...c, likedByUser: !c.likedByUser, likes: c.likedByUser ? c.likes - 1 : c.likes + 1 };
                  }
                  return c;
              });
              return { ...p, comments: updatedComments };
          }
          return p;
      }));
  };

  const handleCreatePost = (postData: Omit<PostType, 'id' | 'likes' | 'likedBy' | 'comments' | 'timestamp' | 'isSaved' | 'isLiked'>) => {
      const newPost: PostType = {
          ...postData,
          id: `p-${Date.now()}`,
          likes: 0,
          likedBy: [],
          comments: [],
          timestamp: 'Just now',
          isSaved: false,
          isLiked: false,
      };
      setPosts(prev => [newPost, ...prev]);
      setCreatePostModalOpen(false);
  };
  
  const handleUpdatePost = (postId: string, newCaption: string) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, caption: newCaption } : p));
      setEditingPost(null);
  };

  const handleCreateStory = (storyItem: Omit<StoryItem, 'id'>) => {
      const newStoryItem: StoryItem = { ...storyItem, id: `si-${Date.now()}` };
      // Check if current user already has a story object
      const userStoryIndex = stories.findIndex(s => s.user.id === currentUser.id);
      if (userStoryIndex > -1) {
          const updatedStories = [...stories];
          updatedStories[userStoryIndex].stories.push(newStoryItem);
          setStories(updatedStories);
      } else {
          // Create a new story object for the user
          const newStory: StoryType = {
              id: `s-${currentUser.id}`,
              user: currentUser,
              stories: [newStoryItem],
          };
          setStories(prev => [newStory, ...prev]);
      }
      setCreateStoryModalOpen(false);
  };

  const handleShare = (post: PostType) => {
    setPostToShare(post);
    setShareModalOpen(true);
  };
  
  const handleViewStory = (story: StoryType) => {
      const storyIndex = stories.findIndex(s => s.id === story.id);
      if (storyIndex > -1) {
          setViewedStory({ stories, startIndex: storyIndex });
      }
  };
  
  const handleSubscribe = () => {
    setCurrentUser(prev => ({...prev, isPremium: true}));
    setPaymentModalOpen(false);
  };
  
  const handleUpdateNotificationSettings = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
  };

  const renderView = () => {
      const profileToShow = viewedProfile || currentUser;
      const mainContent = (() => {
        switch (currentView) {
        case 'home':
            return <HomeView posts={posts} stories={stories} currentUser={currentUser} onLike={handleLike} onComment={handleComment} onViewPost={setViewedPost} onViewStory={handleViewStory} onSave={handleSave} onShare={handleShare} onCreateStory={() => setCreateStoryModalOpen(true)} onViewProfile={handleViewProfile} onEditPost={setEditingPost} onViewLikes={handleViewLikes} />;
        case 'explore':
            return <ExploreView posts={posts} onViewPost={setViewedPost} />;
        case 'reels':
            return <ReelsView reels={MOCK_REELS} />;
        case 'messages':
            return <MessagesView currentUser={currentUser} conversations={MOCK_CONVERSATIONS} onViewProfile={handleViewProfile} />;
        case 'profile':
            return <ProfileView user={profileToShow} posts={posts.filter(p => p.user.id === profileToShow.id)} isCurrentUser={profileToShow.id === currentUser.id} onEditProfile={() => setEditProfileModalOpen(true)} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onShowFollowers={(users) => setFollowListModal({ title: 'Followers', users })} onShowFollowing={(users) => setFollowListModal({ title: 'Following', users })} onEditPost={setEditingPost} onViewPost={setViewedPost}/>;
        case 'settings':
            return <SettingsView onGetVerified={() => setGetVerifiedModalOpen(true)} onEditProfile={() => setEditProfileModalOpen(true)} onChangePassword={() => setChangePasswordModalOpen(true)} isPrivateAccount={isPrivateAccount} onTogglePrivateAccount={setPrivateAccount} isTwoFactorEnabled={isTwoFactorEnabled} onToggleTwoFactor={setTwoFactorEnabled} notificationSettings={notificationSettings} onUpdateNotificationSettings={handleUpdateNotificationSettings} />;
        case 'saved':
            return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={setViewedPost} />;
        case 'archive':
            return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={setViewedPost} />;
        case 'premium':
            return <PremiumView onShowPaymentModal={() => setPaymentModalOpen(true)} isCurrentUserPremium={currentUser.isPremium || false} />;
        case 'activity':
            return <ActivityView activities={MOCK_ACTIVITIES} />;
        default:
            return <HomeView posts={posts} stories={stories} currentUser={currentUser} onLike={handleLike} onComment={handleComment} onViewPost={setViewedPost} onViewStory={handleViewStory} onSave={handleSave} onShare={handleShare} onCreateStory={() => setCreateStoryModalOpen(true)} onViewProfile={handleViewProfile} onEditPost={setEditingPost} onViewLikes={handleViewLikes} />;
        }
      })();

      return (
        <div className="w-full max-w-4xl mx-auto">
            {mainContent}
        </div>
      );
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="flex">
        <LeftSidebar 
            currentUser={currentUser}
            currentView={currentView}
            onNavigate={handleNavigate}
            onCreatePost={() => setCreatePostModalOpen(true)}
            onShowNotifications={() => setNotificationsVisible(true)}
            onShowSearch={() => setSearchVisible(true)}
            onSwitchAccount={() => setAccountSwitcherOpen(true)}
        />
        <div className="flex flex-1 md:pl-[72px] lg:pl-64">
             <main className="flex-1">
                 <Header 
                    currentUser={currentUser}
                    onNavigate={handleNavigate}
                    onSwitchAccount={() => setAccountSwitcherOpen(true)}
                    onCreatePost={() => setCreatePostModalOpen(true)}
                    onShowNotifications={() => setNotificationsVisible(p => !p)}
                  />
                {renderView()}
              </main>
              <div className="hidden lg:block w-80 flex-shrink-0">
                  <Sidebar 
                    currentUser={currentUser} 
                    users={users} 
                    trendingTopics={MOCK_TRENDING_TOPICS}
                    onViewProfile={handleViewProfile} 
                    onSwitchAccount={() => setAccountSwitcherOpen(true)}
                    onNavigate={handleNavigate}
                    onShowSearch={() => setSearchVisible(true)}
                  />
              </div>
        </div>
      </div>

      <BottomNav 
        currentView={currentView}
        onNavigate={handleNavigate}
        onCreatePost={() => setCreatePostModalOpen(true)}
        currentUser={currentUser}
      />
      
      {viewedPost && <PostModal post={viewedPost} currentUser={currentUser} onClose={() => setViewedPost(null)} onLike={handleLike} onSave={handleSave} onComment={handleComment} onLikeComment={handleLikeComment} onShare={handleShare} onViewProfile={handleViewProfile} onEdit={setEditingPost} onViewLikes={handleViewLikes} />}
      {viewedStory && <StoryViewer stories={viewedStory.stories} startIndex={viewedStory.startIndex} onClose={() => setViewedStory(null)} onViewProfile={handleViewProfile} />}
      {isCreatePostModalOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostModalOpen(false)} onCreatePost={handleCreatePost} />}
      {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleUpdatePost} />}
      {isCreateStoryModalOpen && <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreateStory={handleCreateStory} />}
      {isAccountSwitcherOpen && <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => {setCurrentUser(user); setAccountSwitcherOpen(false)}} />}
      {isShareModalOpen && <ShareModal post={postToShare} onClose={() => setShareModalOpen(false)} />}
      {isSearchVisible && <SearchView users={users} onClose={() => setSearchVisible(false)} onViewProfile={handleViewProfile} />}
      {isNotificationsVisible && <NotificationsPanel activities={MOCK_ACTIVITIES} onClose={() => setNotificationsVisible(false)} />}
      {isGetVerifiedModalOpen && <GetVerifiedModal onClose={() => setGetVerifiedModalOpen(false)} />}
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setChangePasswordModalOpen(false)} />}
      {isEditProfileModalOpen && <EditProfileModal user={currentUser} onClose={() => setEditProfileModalOpen(false)} onSave={handleUpdateUser} />}
      {followListModal && <FollowListModal title={followListModal.title} users={followListModal.users} onClose={() => setFollowListModal(null)} onFollow={handleFollow} currentUser={currentUser} onViewProfile={handleViewProfile} />}
      {likesModalUsers && <ViewLikesModal users={likesModalUsers} onClose={() => setLikesModalUsers(null)} onViewProfile={handleViewProfile} onFollow={handleFollow} currentUser={currentUser} />}
      {isPaymentModalOpen && <PaymentModal onClose={() => setPaymentModalOpen(false)} onSuccess={handleSubscribe} />}
    </div>
  );
}

export default App;