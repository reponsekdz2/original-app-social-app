import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import ProfileView from './components/ProfileView.tsx';
import Header from './components/Header.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import BottomNav from './components/BottomNav.tsx';
import AuthView from './components/AuthView.tsx';
import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import PremiumView from './components/PremiumView.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import Toast from './components/Toast.tsx';
import MessagesView from './MessagesView.tsx';
import CallModal from './components/CallModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import NewMessageModal from './components/NewMessageModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';

import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

import type { User, Post, Story, Reel, View, Conversation, Comment, StoryItem } from './types.ts';

const App: React.FC = () => {
    // --- State Management ---
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [appData, setAppData] = useState<any>({});
    
    // Modal & Panel State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);
    const [conversationToSelect, setConversationToSelect] = useState<string | null>(null);

    // --- Utility Functions ---
    const showToast = (message: string) => setToastMessage(message);
    const navigate = (newView: View, data?: any) => {
        if (newView === 'profile' && data) setProfileUser(data);
        else if (newView === 'profile' && !data) setProfileUser(currentUser);
        setView(newView);
        setSearchVisible(false);
        setNotificationsVisible(false);
    };
    
    // --- Data Fetching & Initialization ---
    const handleLoginSuccess = async (user: User) => {
        setCurrentUser(user);
        socketService.connect(user.id);
        
        try {
            const data = await api.getAppData(user.id);
            setUsers(data.users);
            setPosts(data.posts.map((p: Post) => ({...p, isSaved: data.currentUser.savedPostIds.includes(p.id) })));
            setStories(data.stories);
            setReels(data.reels);
            setConversations(data.conversations);
            setAppData(data);
            setCurrentUser(data.currentUser);
            setView('home');
        } catch (error) {
            console.error("Failed to load app data", error);
            showToast("Could not load app data.");
        }
    };
    
    // Auto-login for development
    useEffect(() => {
        const devUserId = 'user-1';
        if (!currentUser) {
            api.getAppData(devUserId).then(data => {
                if (data.currentUser) {
                    handleLoginSuccess(data.currentUser);
                }
            }).catch(e => console.error("Auto-login failed:", e));
        }
        return () => socketService.disconnect();
    }, []);

    // --- Handlers ---
    const handleLogout = () => {
        socketService.disconnect();
        setCurrentUser(null);
        // Clear all state
        setPosts([]); setStories([]); setReels([]); setUsers([]); setConversations([]); setAppData({});
    };

    const handleFollow = async (userToFollow: User) => {
        setCurrentUser(prev => ({...prev!, following: [...prev!.following, userToFollow]}));
        showToast(`Followed ${userToFollow.username}`);
        await api.followUser(currentUser!.id, userToFollow.id).catch(() => showToast('Error following user'));
    };
    
    const handleUnfollow = async (userToUnfollow: User) => {
        setCurrentUser(prev => ({...prev!, following: prev!.following.filter(u => u.id !== userToUnfollow.id)}));
        showToast(`Unfollowed ${userToUnfollow.username}`);
        await api.unfollowUser(currentUser!.id, userToUnfollow.id).catch(() => showToast('Error unfollowing user'));
    };

    const handleTogglePostLike = async (postId: string) => {
        const originalPosts = [...posts];
        const updatedPosts = posts.map(p => p.id === postId ? {...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes -1 : p.likes + 1} : p);
        setPosts(updatedPosts);
        await api.togglePostLike(postId, currentUser!.id).catch(() => { showToast('Error liking post'); setPosts(originalPosts); });
    };

    const handleTogglePostSave = async (postId: string) => {
        const originalPosts = [...posts];
        const updatedPosts = posts.map(p => p.id === postId ? {...p, isSaved: !p.isSaved } : p);
        setPosts(updatedPosts);
        await api.togglePostSave(postId, currentUser!.id).catch(() => { showToast('Error saving post'); setPosts(originalPosts); });
    };

    const handleAddComment = async (contentId: string, text: string, type: 'post' | 'reel', replyToId?: string) => {
        const apiCall = type === 'post' ? api.addPostComment : api.addReelComment;
        const newComment = await apiCall(contentId, currentUser!.id, text, replyToId);
        
        const updateState = (items: any[], setItems: Function) => {
            const newItems = items.map(item => {
                if (item.id === contentId) {
                    return {...item, comments: [newComment, ...item.comments]};
                }
                return item;
            });
            setItems(newItems);
        };

        if(type === 'post') updateState(posts, setPosts);
        else updateState(reels, setReels);
    };
    
    const handleSendMessage = async (messageData: any) => {
        const convo = conversations.find(c => c.participants.some(p => p.id === messageData.recipientId));
        if (convo) {
            await api.sendMessage(convo.id, {...messageData, senderId: currentUser!.id });
        }
    };
    
    const handleStartConversation = async (user: User) => {
        const convo = await api.findOrCreateConversation(currentUser!.id, user.id);
        if (!conversations.some(c => c.id === convo.id)) {
            setConversations(prev => [convo, ...prev]);
        }
        setConversationToSelect(convo.id);
        setActiveModal(null);
        navigate('messages');
    };
    
    const handleCreatePost = async (postData: any) => {
        const newPost = await api.createPost(postData);
        setPosts(prev => [newPost, ...prev]);
        setActiveModal(null);
        showToast("Post created successfully!");
    };

    const handleSwitchUser = async (userId: string) => {
        const userToSwitch = users.find(u => u.id === userId);
        if(userToSwitch) {
            setActiveModal(null);
            await handleLoginSuccess(userToSwitch);
        }
    };

    const handleUpdateProfile = async (updatedUser: User) => {
        const user = await api.updateUser(currentUser!.id, updatedUser);
        setCurrentUser(user);
        setActiveModal(null);
        showToast("Profile updated!");
    };
    
    // --- Render Logic ---
    if (!currentUser) {
        return <AuthView 
            onLoginSuccess={handleLoginSuccess} 
            onForgotPassword={() => setActiveModal('forgot-password')} 
        />;
    }

    const mainContent = () => {
        switch(view) {
            case 'explore': return <ExploreView posts={posts} onViewPost={(p) => {setActiveModal('post'); setModalData(p);}} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={() => {}} onCommentOnReel={(r) => {setActiveModal('reel-comments'); setModalData(r);}} onShareReel={(r) => {setActiveModal('share'); setModalData(r);}} />;
            case 'profile': 
                const user = profileUser || currentUser;
                // Fix: Add the missing onEditPost prop to ProfileView.
                return <ProfileView user={user} posts={posts.filter(p => p.user.id === user.id)} reels={reels.filter(r => r.user.id === user.id)} isCurrentUser={user.id === currentUser.id} currentUser={currentUser} onEditProfile={() => setActiveModal('edit-profile')} onViewPost={(p) => {setActiveModal('post'); setModalData(p);}} onShowFollowers={(users) => {setActiveModal('follow-list'); setModalData({title: 'Followers', users});}} onShowFollowing={(users) => {setActiveModal('follow-list'); setModalData({title: 'Following', users});}} onFollow={handleFollow} onUnfollow={(u) => {setActiveModal('unfollow'); setModalData(u)}} onViewReel={(r) => {setView('reels');}} onMessage={handleStartConversation} onOpenCreateHighlightModal={() => setActiveModal('create-highlight')} onViewArchive={() => {}} onEditPost={(p) => { setActiveModal('edit-post'); setModalData(p); }} />;
            case 'saved': return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={(p) => {setActiveModal('post'); setModalData(p);}} />;
            case 'settings': return <SettingsView currentUser={currentUser} onNavigate={navigate} onShowHelp={() => {}} onShowSupport={() => {}} onChangePassword={() => setActiveModal('change-password')} onManageAccount={() => setActiveModal('edit-profile')} onTwoFactorAuth={() => setActiveModal('2fa')} onGetVerified={() => setActiveModal('get-verified')} />;
            case 'premium': return <PremiumView testimonials={appData.testimonials || []} isCurrentUserPremium={currentUser.isPremium} onShowPaymentModal={() => setActiveModal('payment')} />;
            case 'messages': return <MessagesView conversations={conversations} setConversations={setConversations} currentUser={currentUser} onSendMessage={handleSendMessage} onViewProfile={(u) => navigate('profile', u)} onInitiateCall={(user, type) => {setActiveModal('call'); setModalData({user, type})}} onUpdateUserRelationship={() => {}} onNewMessage={() => setActiveModal('new-message')} conversationToSelect={conversationToSelect} setConversationToSelect={setConversationToSelect} />;
            case 'home': default:
                return <HomeView posts={posts} stories={stories} currentUser={currentUser} suggestedUsers={appData.suggestedUsers || []} trendingTopics={appData.trendingTopics || []} feedActivities={appData.feedActivities || []} sponsoredContent={appData.sponsoredContent || []} conversations={conversations} onToggleLike={handleTogglePostLike} onToggleSave={handleTogglePostSave} onComment={(id, txt) => handleAddComment(id, txt, 'post')} onShare={(p) => {setActiveModal('share'); setModalData(p);}} onViewStory={(s) => {setActiveModal('story'); setModalData({stories, startIndex: stories.indexOf(s)});}} onViewLikes={(u) => {setActiveModal('view-likes'); setModalData(u);}} onViewProfile={(u) => navigate('profile', u)} onViewPost={(p) => {setActiveModal('post'); setModalData(p);}} onOptions={(p) => {setActiveModal('post-options'); setModalData(p);}} onShowSuggestions={() => setActiveModal('suggestions')} onShowTrends={() => setActiveModal('trends')} onCreateStory={() => setActiveModal('create-story')} onShowSearch={() => setSearchVisible(true)} onNavigate={navigate} onFollow={handleFollow} onUnfollow={(u) => {setActiveModal('unfollow'); setModalData(u)}} />;
        }
    }
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Header currentUser={currentUser} onNavigate={navigate} onCreatePost={() => setActiveModal('create-post')} onShowNotifications={() => setNotificationsVisible(true)} onLogout={handleLogout} onSwitchAccount={() => setActiveModal('switch-account')} />
            <div className="flex">
                <LeftSidebar currentUser={currentUser} currentView={view} onNavigate={navigate} onCreatePost={() => setActiveModal('create-post')} onShowNotifications={() => setNotificationsVisible(true)} onShowSearch={() => setSearchVisible(true)} onLogout={handleLogout} onSwitchAccount={() => setActiveModal('switch-account')} />
                <main className="flex-1 md:ml-[72px] lg:ml-64">{mainContent()}</main>
            </div>
            <BottomNav currentUser={currentUser} currentView={view} onNavigate={navigate} onCreatePost={() => setActiveModal('create-post')} />
            
            {/* --- Modals & Panels --- */}
            {activeModal === 'post' && modalData && <PostModal post={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onToggleLike={handleTogglePostLike} onToggleSave={handleTogglePostSave} onComment={(postId, text, replyToId) => handleAddComment(postId, text, 'post', replyToId)} onToggleCommentLike={() => {}} onShare={(p) => { setActiveModal('share'); setModalData(p); }} onViewLikes={(u) => { setActiveModal('view-likes'); setModalData(u); }} onViewProfile={(u) => { setActiveModal(null); navigate('profile', u);}} onOptions={(p) => {setActiveModal('post-options'); setModalData(p);}} />}
            {activeModal === 'story' && modalData && <StoryViewer stories={modalData.stories} startIndex={modalData.startIndex} onClose={() => setActiveModal(null)} onViewProfile={(u) => { setActiveModal(null); navigate('profile', u); }} onReply={(u,c) => showToast(`Replied to ${u.username}`)} onShare={(s) => {setActiveModal('share'); setModalData(s);}} />}
            {activeModal === 'create-post' && <CreatePostModal currentUser={currentUser} onClose={() => setActiveModal(null)} onCreatePost={handleCreatePost} />}
            {activeModal === 'create-story' && <CreateStoryModal onClose={() => setActiveModal(null)} onCreateStory={() => { setActiveModal(null); showToast("Story added!"); }} />}
            {activeModal === 'share' && modalData && <ShareModal content={modalData} users={users} onClose={() => setActiveModal(null)} onSendShare={(u) => showToast(`Shared with ${u.username}`)} onCopyLink={() => showToast("Link copied!")} />}
            {activeModal === 'view-likes' && modalData && <ViewLikesModal users={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={(u) => { setActiveModal(null); navigate('profile', u);}} onFollow={handleFollow} onUnfollow={(u) => {setActiveModal('unfollow'); setModalData(u)}} />}
            {activeModal === 'follow-list' && modalData && <FollowListModal title={modalData.title} users={modalData.users} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={(u) => { setActiveModal(null); navigate('profile', u);}} onFollow={handleFollow} onUnfollow={(u) => {setActiveModal('unfollow'); setModalData(u)}} />}
            {activeModal === 'switch-account' && <AccountSwitcherModal accounts={users.slice(0,3)} currentUser={currentUser} onClose={() => setActiveModal(null)} onSwitchAccount={handleSwitchUser} onAddAccount={handleLogout} />}
            {activeModal === 'edit-profile' && <EditProfileModal user={currentUser} onClose={() => setActiveModal(null)} onSave={handleUpdateProfile} />}
            {activeModal === 'payment' && <PaymentModal onClose={() => setActiveModal(null)} onConfirmPayment={() => { setCurrentUser({...currentUser, isPremium: true }); setActiveModal(null); showToast("Welcome to Premium!"); }} />}
            {activeModal === 'call' && modalData && <CallModal user={modalData.user} type={modalData.type} onClose={() => setActiveModal(null)} />}
            {activeModal === 'forgot-password' && <ForgotPasswordModal onClose={() => setActiveModal(null)} onSubmit={async (id) => { showToast('Password reset email sent (mock)'); setActiveModal('reset-password'); setModalData(id); }} />}
            {activeModal === 'reset-password' && modalData && <ResetPasswordModal onClose={() => setActiveModal(null)} onSubmit={async (pw) => { await api.resetPassword(modalData, pw); showToast('Password reset successfully!'); setActiveModal(null); }} />}
            {activeModal === 'unfollow' && modalData && <UnfollowModal user={modalData} onCancel={() => setActiveModal(null)} onConfirm={() => { handleUnfollow(modalData); setActiveModal(null); }} />}
            {activeModal === 'post-options' && modalData && <PostWithOptionsModal post={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onUnfollow={(u) => { setActiveModal('unfollow'); setModalData(u); }} onFollow={handleFollow} onEdit={(p) => setActiveModal('edit-post')} onDelete={() => { showToast('Post deleted'); setActiveModal(null); }} onArchive={() => {}} onReport={(p) => setActiveModal('report')} />}
            {activeModal === 'edit-post' && modalData && <EditPostModal post={modalData} onClose={() => setActiveModal(null)} onSave={(id, cap) => { showToast('Post updated'); setActiveModal(null); }} />}
            {activeModal === 'report' && <ReportModal onClose={() => setActiveModal(null)} onSubmitReport={(r) => { showToast('Report submitted'); setActiveModal(null); }} />}
            {activeModal === '2fa' && <TwoFactorAuthModal onClose={() => setActiveModal(null)} onEnable={() => { showToast('2FA Enabled!'); setActiveModal(null); }} />}
            {activeModal === 'get-verified' && <GetVerifiedModal onClose={() => setActiveModal(null)} onSubmit={() => { showToast('Application submitted!'); setActiveModal(null); }} />}
            {activeModal === 'trends' && <TrendsModal topics={appData.trendingTopics || []} onClose={() => setActiveModal(null)} />}
            {activeModal === 'suggestions' && <SuggestionsModal users={appData.suggestedUsers || []} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={(u) => navigate('profile', u)} onFollow={handleFollow} onUnfollow={(u) => {setActiveModal('unfollow'); setModalData(u)}} />}
            {activeModal === 'new-message' && <NewMessageModal users={users.filter(u => u.id !== currentUser.id)} onClose={() => setActiveModal(null)} onSelectUser={handleStartConversation} />}
            {activeModal === 'change-password' && <ChangePasswordModal onClose={() => setActiveModal(null)} onSave={() => { showToast('Password changed!'); setActiveModal(null); }} />}
            {activeModal === 'reel-comments' && modalData && <ReelCommentsModal reel={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onPostComment={(id, txt) => handleAddComment(id, txt, 'reel')} onLikeComment={() => {}} onViewProfile={(u) => navigate('profile', u)} />}
            {activeModal === 'create-highlight' && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={() => setActiveModal(null)} onCreate={() => { showToast("Highlight created!"); setActiveModal(null); }} />}

            {isSearchVisible && <SearchView users={users} onClose={() => setSearchVisible(false)} onViewProfile={(u) => { setSearchVisible(false); navigate('profile', u); }} />}
            {isNotificationsVisible && <NotificationsPanel notifications={appData.notifications || []} onClose={() => setNotificationsVisible(false)} />}
            
            {toastMessage && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"><Toast message={toastMessage} onDismiss={() => setToastMessage(null)} /></div>}
        </div>
    );
};

export default App;