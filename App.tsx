import React, { useState, useEffect, useCallback } from 'react';

// API & Services
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import { webRTCManager } from './services/WebRTCManager.ts';

// Types
import type { View, User, Post, Story, Reel, Conversation, Notification, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, StoryItem, Comment, Message, LiveStream } from './types.ts';

// Views
import AuthView from './components/AuthView.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import PremiumView from './components/PremiumView.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import ActivityView from './components/ActivityView.tsx';
import SearchView from './components/SearchView.tsx';
import LiveStreamsView from './components/LiveStreamsView.tsx';
import AdminView from './components/AdminView.tsx';

// Components
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import Toast from './components/Toast.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';

// Modals
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import IncomingCallModal from './components/IncomingCallModal.tsx';
import CallModal from './components/CallModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import TipModal from './components/TipModal.tsx';
import GoLiveModal from './components/GoLiveModal.tsx';
import LiveStreamView from './components/LiveStreamView.tsx';


type CallState = {
    status: 'idle' | 'outgoing' | 'incoming' | 'active';
    fromUser?: User;
    toUser?: User;
    withUser?: User;
}

const App: React.FC = () => {
    // Auth & User
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Navigation
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [previousView, setPreviousView] = useState<View>('home');

    // Data
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

    // Modals & Panels
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [callState, setCallState] = useState<CallState>({ status: 'idle' });
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    const showToast = (message: string) => setToastMessage(message);
    
    const fetchInitialData = useCallback(async () => {
        if (!localStorage.getItem('authToken')) {
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        try {
            const [
                feedRes, storiesRes, trendingRes, suggestionsRes, activitiesRes, sponsoredRes, conversationsRes, allUsersRes, reelsRes, notificationsRes, liveStreamsRes
            ] = await Promise.all([
                api.getFeed(), api.getStories(), api.getTrending(), api.getSuggestions(), api.getFeedActivities(),
                api.getSponsoredContent(), api.getConversations(), api.getAllUsers(), api.getReels(), api.getNotifications(), api.getLiveStreams()
            ]);

            setPosts(feedRes.posts);
            setStories(storiesRes.stories);
            setTrendingTopics(trendingRes);
            setSuggestedUsers(suggestionsRes);
            setFeedActivities(activitiesRes);
            setSponsoredContent(sponsoredRes);
            setConversations(conversationsRes);
            setAllUsers(allUsersRes);
            setReels(reelsRes);
            setNotifications(notificationsRes);
            setLiveStreams(liveStreamsRes);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLoginSuccess = useCallback((data: { user: User, token: string }) => {
        localStorage.setItem('authToken', data.token);
        setCurrentUser(data.user);
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        if (currentUser && !socketService.socket) {
            socketService.connect(currentUser.id);

            // Socket listeners here...
        }
    }, [currentUser]);

    // Check for password reset token on initial load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('resetToken');
        if (resetToken) {
            openModal('resetPassword', { token: resetToken });
        }
    }, []);

    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const { user } = await api.checkAuth();
                    setCurrentUser(user);
                    await fetchInitialData();
                } catch (error) {
                    handleLogout(); 
                }
            } else {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, [fetchInitialData]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        socketService.disconnect();
        setCurrentView('home');
    };
    
    const handleNavigate = async (view: View, data?: any) => {
        setPreviousView(currentView);
        if (view === 'profile' && data) { setProfileUser(data as User); } 
        else if (view !== 'profile') { setProfileUser(null); }

        if (view === 'saved') setSavedPosts(await api.getSavedPosts());
        else if (view === 'archive') setArchivedPosts(await api.getArchivedPosts());
        else if (view === 'premium') setTestimonials(await api.getTestimonials());
        else if (view === 'help') setHelpArticles(await api.getHelpArticles());
        else if (view === 'support') setSupportTickets(await api.getSupportTickets());
        else if (view === 'live') setLiveStreams(await api.getLiveStreams());

        setCurrentView(view);
    };
    
    const openModal = (modalName: string, data: any = null) => {
        setActiveModal(modalName);
        setModalData(data);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    const handleToggleLike = async (postId: string) => { /* ... */ };
    const handleToggleSave = async (postId: string) => { /* ... */ };
    const handleComment = async (postId: string, text: string) => { /* ... */ };
    const handleFollow = async (userToFollow: User) => { /* ... */ };
    const handleUnfollow = (userToUnfollow: User) => { openModal('unfollow', userToUnfollow); };
    const confirmUnfollow = async (userToUnfollow: User) => { /* ... */ };
    const handleCreatePost = async (formData: FormData) => { /* ... */ };
    const handleCreateStory = async (formData: FormData) => { /* ... */ };

    // --- Post Actions ---
    const handleEditPost = async (updatedPost: Post) => {
        await api.editPost(updatedPost.id, updatedPost.caption, updatedPost.location || '');
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        showToast("Post updated");
        closeModal();
    };
    const handleDeletePost = async (postToDelete: Post) => {
        await api.deletePost(postToDelete.id);
        setPosts(posts.filter(p => p.id !== postToDelete.id));
        showToast("Post deleted");
    };
    const handleArchivePost = async (postToArchive: Post) => {
        await api.archivePost(postToArchive.id);
        setPosts(posts.filter(p => p.id !== postToArchive.id));
        showToast("Post archived");
    };
    const handleUnarchivePost = async (postToUnarchive: Post) => {
        await api.unarchivePost(postToUnarchive.id);
        setArchivedPosts(archivedPosts.filter(p => p.id !== postToUnarchive.id));
        showToast("Post unarchived");
    };
    const handleCreateHighlight = async (title: string, storyIds: string[]) => {
        await api.createHighlight(title, storyIds);
        showToast("Highlight created!");
        closeModal();
        // You might want to refetch the user profile here
    };
    const handleReport = async (reason: string, details: string) => {
        const entityType = modalData.username ? 'user' : 'post';
        await api.submitReport(modalData.id, entityType, reason, details);
        showToast("Report submitted. Thank you.");
        closeModal();
    };

    // --- Monetization ---
    const handleSendTip = async (amount: number) => {
        if (!modalData || !modalData.id) return;
        await api.sendTip(modalData.id, amount);
        showToast(`Sent a $${amount} tip to ${modalData.user.username}!`);
    };

    // --- Live Streaming ---
    const handleStartStream = async (title: string) => {
        const newStream = await api.startLiveStream(title);
        closeModal();
        openModal('liveStream', newStream);
    };

    // --- Call Handlers ---
    const handleInitiateCall = async (userToCall: User) => { /* ... */ };
    const handleAcceptCall = async () => { /* ... */ };
    const handleDeclineCall = () => { /* ... */ };
    const handleEndCall = () => { /* ... */ };
    const handleToggleMute = useCallback(() => { /* ... */ }, []);
    const handleToggleCamera = useCallback(() => { /* ... */ }, []);


    const renderView = () => {
        switch (currentView) {
            case 'home': return <HomeView posts={posts} stories={stories} currentUser={currentUser!} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewStory={(story) => openModal('story', story)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', post)} onOptions={(post) => openModal('postOptions', post)} onCreateStory={() => openModal('createStory')} onShowSearch={() => setSearchVisible(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => openModal('tip', post)} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onShowSuggestions={() => openModal('suggestions', suggestedUsers)} onShowTrends={() => openModal('trends', trendingTopics)} />;
            case 'live': return <LiveStreamsView streams={liveStreams} onJoinStream={(stream) => openModal('liveStream', stream)} />;
            case 'admin': return currentUser?.isAdmin ? <AdminView /> : <h1 className="text-center text-red-500 p-8">Access Denied</h1>;
            // Other cases remain the same...
            default: return <HomeView posts={posts} stories={stories} currentUser={currentUser!} onToggleLike={handleToggleLike} onToggleSave={() => {}} onComment={() => {}} onShare={(post) => openModal('share', post)} onViewStory={(story) => openModal('story', story)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', post)} onOptions={(post) => openModal('postOptions', post)} onCreateStory={() => openModal('createStory')} onShowSearch={() => setSearchVisible(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => openModal('tip', post)} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onShowSuggestions={() => {}} onShowTrends={() => {}} />;
        }
    };
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-black"><p className="text-white">Loading...</p></div>;
    }

    if (!currentUser) {
        return (
            <>
                <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />
                {activeModal === 'forgotPassword' && <ForgotPasswordModal onClose={closeModal} onSubmit={async (email) => { const res = await api.forgotPassword(email); showToast(res.message); if (res.resetTokenForSimulation) { window.history.pushState({}, '', `/?resetToken=${res.resetTokenForSimulation}`); } closeModal(); }} />}
                {activeModal === 'resetPassword' && <ResetPasswordModal onClose={() => { window.history.pushState({}, '', '/'); closeModal(); }} onSubmit={async (password) => { await api.resetPassword(modalData.token, password); showToast("Password reset successfully!"); window.history.pushState({}, '', '/'); closeModal(); }} />}
            </>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen font-sans flex">
            <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => setSearchVisible(true)} onShowNotifications={() => setNotificationsVisible(true)} onCreatePost={() => openModal('createPost')} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} onGoLive={() => openModal('goLive')} />
            <div className="flex-1 md:ml-[72px] lg:ml-64">
                <Header currentUser={currentUser} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} onShowNotifications={() => setNotificationsVisible(true)} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} />
                <main className="md:pt-4">
                    {renderView()}
                </main>
            </div>
            <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} />
            
            {/* ... other modals */}
            {activeModal === 'postOptions' && <PostWithOptionsModal post={modalData} currentUser={currentUser} onClose={closeModal} onUnfollow={handleUnfollow} onFollow={handleFollow} onEdit={(post) => openModal('editPost', post)} onDelete={handleDeletePost} onArchive={handleArchivePost} onUnarchive={handleUnarchivePost} onReport={() => openModal('report', modalData)} onShare={(post) => openModal('share', post)} onCopyLink={() => { navigator.clipboard.writeText(`${window.location.origin}/p/${modalData.id}`); showToast('Link copied!'); }} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onGoToPost={(post) => {closeModal(); openModal('post', post)}} />}
            {activeModal === 'editPost' && <EditPostModal post={modalData} onClose={closeModal} onSave={handleEditPost} />}
            {activeModal === 'report' && <ReportModal content={modalData} onClose={closeModal} onSubmitReport={handleReport} />}
            {activeModal === 'createHighlight' && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={closeModal} onCreate={handleCreateHighlight} />}
            {activeModal === 'tip' && <TipModal post={modalData} onClose={closeModal} onSendTip={handleSendTip} />}
            {activeModal === 'goLive' && <GoLiveModal onClose={closeModal} onStartStream={handleStartStream} />}
            {activeModal === 'liveStream' && <LiveStreamView stream={modalData} currentUser={currentUser} onClose={closeModal} />}


            {(callState?.status === 'outgoing' || callState?.status === 'active') && (callState.toUser || callState.withUser) && 
                <CallModal user={(callState.toUser || callState.withUser)!} status={callState.status} onEndCall={handleEndCall} localStream={localStream} remoteStream={remoteStream} isMuted={isMuted} isCameraOff={isCameraOff} onToggleMute={handleToggleMute} onToggleCamera={handleToggleCamera} />
            }
            
            {toastMessage && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"><Toast message={toastMessage} onDismiss={() => setToastMessage(null)} /></div>}
        </div>
    );
}

export default App;