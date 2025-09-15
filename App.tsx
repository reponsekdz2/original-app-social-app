import React, { useState, useEffect } from 'react';
import type { User, View, Post as PostType, Story as StoryType, Comment, StoryItem, NotificationSettings, Conversation, Message, Testimonial, SupportTicket, Reel as ReelType, StoryHighlight } from './types.ts';
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES, MOCK_REELS, MOCK_CONVERSATIONS, MOCK_ACTIVITIES, MOCK_ADS, MOCK_FEED_ACTIVITIES, MOCK_TRENDING_TOPICS, MOCK_TESTIMONIALS, MOCK_HELP_ARTICLES, MOCK_SUPPORT_TICKETS } from './constants.ts';
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
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';

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
  const [isCreateHighlightModalOpen, setCreateHighlightModalOpen] = useState(false);
  const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<PostType | null>(null);
  const [viewedReelForComments, setViewedReelForComments] = useState<ReelType | null>(null);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [isGetVerifiedModalOpen, setGetVerifiedModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isNewSupportRequestModalOpen, setNewSupportRequestModalOpen] = useState(false);
  const [followListModal, setFollowListModal] = useState<{ title: 'Followers' | 'Following', users: User[] } | null>(null);
  const [likesModalUsers, setLikesModalUsers] = useState<User[] | null>(null);
  const [userToUnfollow, setUserToUnfollow] = useState<User | null>(null);

  // Content State
  const [posts, setPosts] = useState<PostType[]>(MOCK_POSTS);
  const [stories, setStories] = useState<StoryType[]>(MOCK_STORIES);
  const [reels, setReels] = useState<ReelType[]>(MOCK_REELS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  
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
  
  const handleFollow = (userToFollow: User) => {
    setCurrentUser(prev => ({
      ...prev,
      following: [...prev.following, userToFollow]
    }));
  };

  const handleUnfollow = (userToUnfollow: User) => {
    if (userToUnfollow.isPrivate) {
      setUserToUnfollow(userToUnfollow);
    } else {
      performUnfollow(userToUnfollow.id);
    }
  };

  const performUnfollow = (userIdToUnfollow: string) => {
    setCurrentUser(prev => ({
      ...prev,
      following: prev.following.filter(u => u.id !== userIdToUnfollow)
    }));
    setUserToUnfollow(null);
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
    handleNavigate('premium-welcome');
  };
  
  const handleUpdateNotificationSettings = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: 'Just now',
      type: 'text',
    };

    setConversations(prev =>
      prev.map(convo =>
        convo.id === conversationId
          ? { ...convo, messages: [...convo.messages, newMessage] }
          : convo
      )
    );
  };

  const handleNewSupportRequest = (subject: string, description: string) => {
    const newTicket: SupportTicket = {
        id: `st-${Date.now()}`,
        subject,
        status: 'Open',
        lastUpdated: 'Just now',
        messages: [
            { sender: 'user', text: description, timestamp: 'Just now' }
        ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    setNewSupportRequestModalOpen(false);
  };
  
  const handleLikeReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
        if (r.id === reelId) {
            const isLiked = !r.isLiked;
            const newLikes = isLiked ? r.likes + 1 : r.likes - 1;
            return {...r, isLiked, likes: newLikes };
        }
        return r;
    }));
  };

  const handleCommentOnReel = (reelId: string, text: string) => {
      const newComment: Comment = {
          id: `c-reel-${Date.now()}`,
          user: currentUser,
          text,
          timestamp: 'Just now',
          likes: 0,
          likedByUser: false,
      };
      setReels(prev => prev.map(r => r.id === reelId ? {...r, comments: [...r.comments, newComment]} : r));
  };

  const handleShareReel = (reel: ReelType) => {
      const tempPost: PostType = {
          id: reel.id,
          user: reel.user,
          media: [{ url: reel.video, type: 'video' }],
          caption: reel.caption,
          likes: reel.likes,
          likedBy: [],
          comments: reel.comments,
          timestamp: 'Reel',
          isSaved: false,
          isLiked: reel.isLiked,
      };
      setPostToShare(tempPost);
      setShareModalOpen(true);
  };

  const handleReplyToStory = (storyUser: User, content: string) => {
      let convo = conversations.find(c => c.participants.some(p => p.id === storyUser.id) && c.participants.some(p => p.id === currentUser.id));
      
      const newMessage: Message = {
          id: `m-story-reply-${Date.now()}`,
          senderId: currentUser.id,
          content,
          timestamp: 'Just now',
          type: 'text',
      };

      if (convo) {
          setConversations(prev => prev.map(c => c.id === convo!.id ? {...c, messages: [...c.messages, newMessage]} : c));
      } else {
          const newConvo: Conversation = {
              id: `conv-${Date.now()}`,
              participants: [currentUser, storyUser],
              messages: [newMessage],
              lastMessageSeenId: '',
          };
          setConversations(prev => [newConvo, ...prev]);
      }
  };

  const handleShareStory = (story: StoryType) => {
       const tempPost: PostType = {
          id: story.id,
          user: story.user,
          media: [{ url: story.stories[0].media, type: story.stories[0].mediaType }],
          caption: `Check out this story by @${story.user.username}`,
          likes: 0,
          likedBy: [],
          comments: [],
          timestamp: 'Story',
          isSaved: false,
          isLiked: false,
      };
      setPostToShare(tempPost);
      setShareModalOpen(true);
  };

  const handleCreateHighlight = (title: string, selectedStories: StoryItem[]) => {
    if (!title || selectedStories.length === 0) return;

    const newHighlight: StoryHighlight = {
        id: `h-${Date.now()}`,
        title,
        stories: selectedStories,
        cover: selectedStories[0].media,
    };

    setCurrentUser(prevUser => {
        const updatedUser = {
            ...prevUser,
            highlights: [...(prevUser.highlights || []), newHighlight]
        };
        // Also update the master users list
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        return updatedUser;
    });

    setCreateHighlightModalOpen(false);
  };

  const handleSendShare = (recipient: User) => {
    if (!postToShare) return;

    const newMessage: Message = {
        id: `m-share-${Date.now()}`,
        senderId: currentUser.id,
        content: `Check out this post from @${postToShare.user.username}`,
        timestamp: 'Just now',
        type: 'share',
        sharedPost: postToShare,
    };

    // Find if a conversation already exists
    let convo = conversations.find(c => 
        c.participants.length === 2 && 
        c.participants.some(p => p.id === recipient.id) && 
        c.participants.some(p => p.id === currentUser.id)
    );

    if (convo) {
        setConversations(prev => prev.map(c => 
            c.id === convo!.id 
            ? {...c, messages: [...c.messages, newMessage]} 
            : c
        ));
    } else {
        // Create a new conversation
        const newConvo: Conversation = {
            id: `conv-${Date.now()}`,
            participants: [currentUser, recipient],
            messages: [newMessage],
            lastMessageSeenId: '',
        };
        setConversations(prev => [newConvo, ...prev]);
    }
  };

  const getUserStories = (user: User): StoryItem[] => {
      return stories
          .filter(s => s.user.id === user.id)
          .flatMap(s => s.stories);
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
            return <ReelsView 
              reels={reels}
              onLikeReel={handleLikeReel}
              onCommentOnReel={(reel) => setViewedReelForComments(reel)}
              onShareReel={handleShareReel}
             />;
        case 'messages':
            return <MessagesView currentUser={currentUser} conversations={conversations} onViewProfile={handleViewProfile} onSendMessage={handleSendMessage} />;
        case 'profile':
            return <ProfileView user={profileToShow} posts={posts.filter(p => p.user.id === profileToShow.id)} isCurrentUser={profileToShow.id === currentUser.id} onEditProfile={() => setEditProfileModalOpen(true)} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={handleUnfollow} onShowFollowers={(users) => setFollowListModal({ title: 'Followers', users })} onShowFollowing={(users) => setFollowListModal({ title: 'Following', users })} onEditPost={setEditingPost} onViewPost={setViewedPost} currentUser={currentUser} onOpenCreateHighlightModal={() => setCreateHighlightModalOpen(true)} />;
        case 'settings':
            return <SettingsView onGetVerified={() => setGetVerifiedModalOpen(true)} onEditProfile={() => setEditProfileModalOpen(true)} onChangePassword={() => setChangePasswordModalOpen(true)} isPrivateAccount={isPrivateAccount} onTogglePrivateAccount={setPrivateAccount} isTwoFactorEnabled={isTwoFactorEnabled} onToggleTwoFactor={setTwoFactorEnabled} notificationSettings={notificationSettings} onUpdateNotificationSettings={handleUpdateNotificationSettings} onNavigate={handleNavigate} />;
        case 'saved':
            return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={setViewedPost} />;
        case 'archive':
            return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={setViewedPost} />;
        case 'premium':
            return <PremiumView onShowPaymentModal={() => setPaymentModalOpen(true)} isCurrentUserPremium={currentUser.isPremium || false} testimonials={MOCK_TESTIMONIALS} />;
        case 'premium-welcome':
            return <PremiumWelcomeView onNavigate={handleNavigate} />;
        case 'activity':
            return <ActivityView activities={MOCK_ACTIVITIES} />;
        case 'help-center':
            return <HelpCenterView articles={MOCK_HELP_ARTICLES} onBack={() => handleNavigate('settings')} />;
        case 'support-inbox':
            return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setNewSupportRequestModalOpen(true)} />;
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
      {viewedStory && <StoryViewer stories={viewedStory.stories} startIndex={viewedStory.startIndex} onClose={() => setViewedStory(null)} onViewProfile={handleViewProfile} onReply={handleReplyToStory} onShare={handleShareStory} />}
      {isCreatePostModalOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostModalOpen(false)} onCreatePost={handleCreatePost} />}
      {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleUpdatePost} />}
      {isCreateStoryModalOpen && <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreateStory={handleCreateStory} />}
      {isAccountSwitcherOpen && <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => {setCurrentUser(user); setAccountSwitcherOpen(false)}} />}
      {isShareModalOpen && <ShareModal post={postToShare} onClose={() => setShareModalOpen(false)} onSendShare={handleSendShare} users={users.filter(u => u.id !== currentUser.id)} />}
      {isSearchVisible && <SearchView users={users} onClose={() => setSearchVisible(false)} onViewProfile={handleViewProfile} />}
      {isNotificationsVisible && <NotificationsPanel activities={MOCK_ACTIVITIES} onClose={() => setNotificationsVisible(false)} />}
      {isGetVerifiedModalOpen && <GetVerifiedModal onClose={() => setGetVerifiedModalOpen(false)} />}
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setChangePasswordModalOpen(false)} />}
      {isEditProfileModalOpen && <EditProfileModal user={currentUser} onClose={() => setEditProfileModalOpen(false)} onSave={handleUpdateUser} />}
      {followListModal && <FollowListModal title={followListModal.title} users={followListModal.users} onClose={() => setFollowListModal(null)} currentUser={currentUser} onViewProfile={handleViewProfile} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
      {likesModalUsers && <ViewLikesModal users={likesModalUsers} onClose={() => setLikesModalUsers(null)} onViewProfile={handleViewProfile} onFollow={handleFollow} onUnfollow={handleUnfollow} currentUser={currentUser} />}
      {isPaymentModalOpen && <PaymentModal onClose={() => setPaymentModalOpen(false)} onSuccess={handleSubscribe} />}
      {isNewSupportRequestModalOpen && <NewSupportRequestModal onClose={() => setNewSupportRequestModalOpen(false)} onSubmit={handleNewSupportRequest} />}
      {userToUnfollow && <UnfollowModal user={userToUnfollow} onCancel={() => setUserToUnfollow(null)} onConfirm={() => performUnfollow(userToUnfollow.id)} />}
      {viewedReelForComments && <ReelCommentsModal reel={viewedReelForComments} currentUser={currentUser} onClose={() => setViewedReelForComments(null)} onComment={handleCommentOnReel} onViewProfile={handleViewProfile} />}
      {isCreateHighlightModalOpen && <CreateHighlightModal userStories={getUserStories(currentUser)} onClose={() => setCreateHighlightModalOpen(false)} onCreate={handleCreateHighlight} />}
    </div>
  );
}

export default App;