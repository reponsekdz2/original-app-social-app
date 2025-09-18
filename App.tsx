
import React, { useState, useEffect, useCallback } from 'react';
import HomeView from './components/HomeView.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import PremiumView from './components/PremiumView.tsx';
import ActivityView from './components/ActivityView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import MessagesView from './MessagesView.tsx';
import AuthView from './components/AuthView.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import Toast from './components/Toast.tsx';
import CallModal from './components/CallModal.tsx';
import NewMessageModal from './components/NewMessageModal.tsx';

import { db, hydrate, generateId } from './backend/data.js';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

import type { User, Post, Story, Reel, View, Comment, Post as PostType, Reel as ReelType, StoryItem, SupportTicket, Conversation, Message, Activity, HelpArticle, Testimonial, TrendingTopic, FeedActivity, SponsoredContent, Notification } from './types.ts';

// A mock state management solution. In a real app, this would be a context, Redux, etc.
const useMockDatabase = () => {
    const [data, setData] = useState(db);

    const findUser = (id: string) => data.users.find(u => u.id === id);

    const updateUser = (userId: string, updates: Partial<User>) => {
        setData(prev => ({
            ...prev,
            users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u)
        }));
    };

    const updatePost = (postId: string, updates: Partial<Post>) => {
        setData(prev => ({
            ...prev,
            posts: prev.posts.map(p => p.id === postId ? { ...p, ...updates } : p)
        }));
    };
    
    // Add more update functions as needed...

    return { data, findUser, updateUser, updatePost };
};


const App: React.FC = () => {
    const { data: appData, findUser, updateUser, updatePost } = useMockDatabase();
    
    // --- STATE ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewedProfile, setViewedProfile] = useState<User | null>(null);

    // Data states
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);

    // Modal states
    const [modal, setModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    // --- EFFECTS ---
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            const hydratedPosts = appData.posts.map(p => hydrate(p, ['user', 'comments.user', 'comments.replies', 'likedBy']));
            setPosts(hydratedPosts);
            const hydratedStories = appData.stories.map(s => hydrate(s, ['user']));
            setStories(hydratedStories);
            const hydratedReels = appData.reels.map(r => hydrate(r, ['user', 'comments.user', 'likedBy']));
            setReels(hydratedReels);
            const hydratedUsers = appData.users.map(u => hydrate(u, ['followers', 'following']));
            setAllUsers(hydratedUsers);
            const hydratedConversations = appData.conversations.map(c => hydrate(c, ['participants', 'messages.replyTo']));
            setConversations(hydratedConversations);
            setNotifications(appData.notifications.map(n => hydrate(n, ['user', 'post.media'])));
            setFeedActivities(appData.feedActivities.map(a => hydrate(a, ['user', 'targetPost.user', 'targetUser'])));
            
            socketService.connect(currentUser.id);
            // Example of listening to a socket event
            socketService.on('receive_message', (data: { conversation: Conversation }) => {
                const { conversation: updatedConvo } = data;
                setConversations(prev => {
                    const exists = prev.some(c => c.id === updatedConvo.id);
                    if (exists) {
                        return prev.map(c => c.id === updatedConvo.id ? updatedConvo : c);
                    }
                    return [updatedConvo, ...prev];
                });
            });

        } else {
            socketService.disconnect();
        }

        return () => {
            socketService.disconnect();
            socketService.off('receive_message');
        }
    }, [isAuthenticated, currentUser, appData]);

    const showToast = (message: string) => {
        setToastMessage(message);
    }
    
    // --- EVENT HANDLERS ---
    const handleLoginSuccess = (user: User) => {
        const fullUser = hydrate(user, ['followers', 'following', 'highlights']);
        setCurrentUser(fullUser);
        setIsAuthenticated(true);
        setCurrentView('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
    }

    const handleNavigate = (view: View, data?: any) => {
        if (view === 'profile' && data) {
            setViewedProfile(data);
        } else if (view === 'profile' && !data) {
            setViewedProfile(currentUser);
        } else {
            setViewedProfile(null);
        }
        setCurrentView(view);
        setModal(null); // Close any open modals on navigation
    }

    const handleFollow = (userToFollow: User) => {
      if (!currentUser) return;
      const updatedCurrentUser = {
          ...currentUser,
          following: [...currentUser.following, userToFollow]
      };
      setCurrentUser(updatedCurrentUser);
      // In a real app, you'd also update the followed user's followers list.
      showToast(`Followed @${userToFollow.username}`);
    }

    const handleUnfollow = (userToUnfollow: User) => {
      if (!currentUser) return;
       const updatedCurrentUser = {
          ...currentUser,
          following: currentUser.following.filter(u => u.id !== userToUnfollow.id)
      };
      setCurrentUser(updatedCurrentUser);
      setModal(null);
      showToast(`Unfollowed @${userToUnfollow.username}`);
    }


    // --- RENDER LOGIC ---

    if (!isAuthenticated || !currentUser) {
        return (
            <>
                <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setModal('forgot-password')} />
                {modal === 'forgot-password' && <ForgotPasswordModal 
                    onClose={() => setModal(null)} 
                    onSubmit={async (identifier) => {
                        await api.forgotPassword(identifier);
                        showToast("If an account exists, a reset link has been sent.");
                        setModal(null);
                    }} 
                />}
            </>
        );
    }
    
    const renderView = () => {
        const profileUser = viewedProfile || currentUser;
        switch(currentView) {
            case 'home':
                return <HomeView 
                    posts={posts} 
                    stories={stories} 
                    currentUser={currentUser} 
                    suggestedUsers={allUsers.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id)).slice(0,5)}
                    trendingTopics={appData.trendingTopics}
                    feedActivities={feedActivities}
                    sponsoredContent={appData.sponsoredContent}
                    conversations={conversations}
                    onToggleLike={(postId) => {}}
                    onToggleSave={(postId) => {}}
                    onComment={(postId, text) => {}}
                    onShare={(post) => setModalData({ type: 'post', content: post })}
                    onViewStory={(story) => setModalData({ type: 'story', content: story })}
                    onViewLikes={(users) => setModalData({ type: 'likes', content: users })}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onViewPost={(post) => setModal('view-post', post)}
                    onOptions={(post) => setModalData({ type: 'post-options', content: post })}
                    onShowSuggestions={() => setModal('suggestions')}
                    onShowTrends={() => setModal('trends')}
                    onCreateStory={() => setModal('create-story')}
                    onShowSearch={() => setModal('search')}
                    onNavigate={handleNavigate}
                    onFollow={handleFollow}
                    onUnfollow={(user) => setModalData({ type: 'unfollow', content: user })}
                />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={(post) => setModal('view-post', post)} />;
            case 'reels':
                return <ReelsView 
                    reels={reels} 
                    currentUser={currentUser}
                    onLikeReel={(reelId) => {}}
                    onCommentOnReel={(reel) => setModalData({ type: 'reel-comments', content: reel })}
                    onShareReel={(reel) => setModalData({ type: 'share', content: reel })}
                />;
            case 'messages':
                return <MessagesView 
                    conversations={conversations}
                    setConversations={setConversations}
                    currentUser={currentUser}
                    onSendMessage={(msg) => {}}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onInitiateCall={(user, type) => setModalData({ type: 'call', content: { user, type } })}
                    onUpdateUserRelationship={() => {}}
                    onNewMessage={() => setModal('new-message')}
                    conversationToSelect={null}
                    setConversationToSelect={() => {}}
                />
            case 'profile':
                if (!profileUser) return null;
                return <ProfileView 
                    user={profileUser}
                    posts={posts.filter(p => p.user.id === profileUser.id)}
                    reels={reels.filter(r => r.user.id === profileUser.id)}
                    isCurrentUser={profileUser.id === currentUser.id}
                    currentUser={currentUser}
                    onEditProfile={() => setModal('edit-profile')}
                    onViewArchive={() => handleNavigate('archive')}
                    onFollow={handleFollow}
                    onUnfollow={(user) => setModalData({ type: 'unfollow', content: user })}
                    onShowFollowers={(users) => setModalData({ type: 'followers', content: users })}
                    onShowFollowing={(users) => setModalData({ type: 'following', content: users })}
                    onEditPost={(post) => setModalData({ type: 'edit-post', content: post })}
                    onViewPost={(post) => setModal('view-post', post)}
                    onViewReel={(reel) => {}}
                    onOpenCreateHighlightModal={() => setModal('create-highlight')}
                    onMessage={(user) => {}}
                />;
             case 'saved':
                return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={(post) => setModal('view-post', post)} />;
            case 'settings':
                return <SettingsView 
                    currentUser={currentUser}
                    onNavigate={handleNavigate}
                    onShowHelp={() => handleNavigate('help')}
                    onShowSupport={() => handleNavigate('support')}
                    onChangePassword={() => setModal('change-password')}
                    onManageAccount={() => setModal('edit-profile')}
                    onTwoFactorAuth={() => setModal('2fa')}
                    onGetVerified={() => setModal('get-verified')}
                />;
            case 'archive':
                return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={(post) => setModal('view-post', post)} />;
            case 'premium':
                return <PremiumView 
                    isCurrentUserPremium={currentUser.isPremium} 
                    testimonials={appData.testimonials.map(t => hydrate(t, ['user']))} 
                    onShowPaymentModal={() => setModal('payment')} 
                />;
            case 'premium-welcome':
                return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'activity':
                return <ActivityView activities={notifications} />;
            case 'help':
                return <HelpCenterView articles={appData.helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support':
                return <SupportInboxView tickets={appData.supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setModal('new-support-request')} />;
            default:
                return <HomeView 
                    posts={posts} 
                    stories={stories} 
                    currentUser={currentUser} 
                    suggestedUsers={allUsers.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id)).slice(0,5)}
                    trendingTopics={appData.trendingTopics}
                    feedActivities={feedActivities}
                    sponsoredContent={appData.sponsoredContent}
                    conversations={conversations}
                    onToggleLike={(postId) => {}}
                    onToggleSave={(postId) => {}}
                    onComment={(postId, text) => {}}
                    onShare={(post) => setModalData({ type: 'post', content: post })}
                    onViewStory={(story) => setModalData({ type: 'story', content: story })}
                    onViewLikes={(users) => setModalData({ type: 'likes', content: users })}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onViewPost={(post) => setModal('view-post', post)}
                    onOptions={(post) => setModalData({ type: 'post-options', content: post })}
                    onShowSuggestions={() => setModal('suggestions')}
                    onShowTrends={() => setModal('trends')}
                    onCreateStory={() => setModal('create-story')}
                    onShowSearch={() => setModal('search')}
                    onNavigate={handleNavigate}
                    onFollow={handleFollow}
                    onUnfollow={(user) => setModalData({ type: 'unfollow', content: user })}
                />;
        }
    }
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Header 
                currentUser={currentUser} 
                onNavigate={handleNavigate} 
                onSwitchAccount={() => setModal('account-switcher')}
                onCreatePost={() => setModal('create-post')}
                onShowNotifications={() => setModal('notifications')}
                onLogout={handleLogout}
            />
            <LeftSidebar 
                 currentUser={currentUser}
                 currentView={currentView}
                 onNavigate={handleNavigate}
                 onShowSearch={() => setModal('search')}
                 onShowNotifications={() => setModal('notifications')}
                 onCreatePost={() => setModal('create-post')}
                 onSwitchAccount={() => setModal('account-switcher')}
                 onLogout={handleLogout}
            />
            <main className="md:pl-[72px] lg:pl-64">
                {renderView()}
            </main>
            <BottomNav 
                 currentView={currentView}
                 onNavigate={handleNavigate}
                 onCreatePost={() => setModal('create-post')}
                 currentUser={currentUser}
            />
            
            {/* --- Modals & Panels --- */}
            {modal === 'create-post' && <CreatePostModal 
                currentUser={currentUser} 
                onClose={() => setModal(null)}
                onCreatePost={(postData) => {
                    showToast("Post created successfully!");
                    setModal(null);
                }}
            />}
            {modal === 'view-post' && modalData && <PostModal 
                post={modalData}
                currentUser={currentUser}
                onClose={() => setModal(null)}
                onToggleLike={(postId) => {}}
                onToggleSave={(postId) => {}}
                onComment={(postId, text, replyToId) => {}}
                onToggleCommentLike={(postId, commentId) => {}}
                onShare={(post) => setModalData({ type: 'share', content: post })}
                onViewLikes={(users) => setModalData({ type: 'likes', content: users })}
                onViewProfile={(user) => handleNavigate('profile', user)}
                onOptions={(post) => setModalData({ type: 'post-options', content: post })}
            />}
            {modalData?.type === 'story' && <StoryViewer 
                stories={stories} 
                startIndex={stories.findIndex(s => s.id === modalData.content.id)}
                onClose={() => setModalData(null)} 
                onViewProfile={(user) => handleNavigate('profile', user)}
                onReply={(storyUser, content) => showToast(`Replied to ${storyUser.username}`)}
                onShare={(story) => setModalData({ type: 'share', content: story })}
            />}
             {modalData?.type === 'unfollow' && <UnfollowModal user={modalData.content} onConfirm={() => handleUnfollow(modalData.content)} onCancel={() => setModalData(null)}/>}

            {/* A more robust modal system would be better */}
            {modal === 'notifications' && <NotificationsPanel notifications={notifications} onClose={() => setModal(null)} />}
            {modal === 'search' && <SearchView users={allUsers} onViewProfile={(user) => handleNavigate('profile', user)} onClose={() => setModal(null)} />}
            {/* etc. for all other modals */}

            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};

export default App;
