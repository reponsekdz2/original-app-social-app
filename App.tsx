import React, { useState, useEffect, useCallback } from 'react';
import type { View, User, Post, Reel, Story, Conversation, Notification, Testimonial, HelpArticle, SupportTicket, TrendingTopic, FeedActivity, SponsoredContent, Comment } from './types.ts';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

// Import Views
import AuthView from './components/AuthView.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './components/MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import PremiumView from './components/PremiumView.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import ActivityView from './components/ActivityView.tsx';


// Import Components and Modals
import LeftSidebar from './components/LeftSidebar.tsx';
import BottomNav from './components/BottomNav.tsx';
import Toast from './components/Toast.tsx';
import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    
    // Auth & User State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]); // For search, suggestions etc.

    // View & Navigation State
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null); // User whose profile is being viewed

    // Data State
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [explorePosts, setExplorePosts] = useState<Post[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
    
    // Sidebar/Dynamic Content State
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);


    // Modal & UI State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null); // Data for the active modal
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
    const [showSearch, setShowSearch] = useState(false);


    // --- AUTHENTICATION & DATA FETCHING ---

    const fetchData = useCallback(async () => {
        try {
            const [
                feedData, exploreData, storiesData, reelsData, trendingData, 
                suggestionsData, feedActivityData, sponsoredData, savedData, 
                archivedData, notificationsData, testimonialsData, helpData, supportData
            ] = await Promise.all([
                api.getFeed(),
                api.getExplore(),
                api.getStories(),
                api.getReels(), // Assuming a getReels endpoint exists
                api.getTrending(),
                api.getSuggestions(),
                api.getFeedActivities(),
                api.getSponsoredContent(),
                api.getSavedPosts(),
                api.getArchivedPosts(),
                api.getNotifications(),
                api.getTestimonials(),
                api.getHelpArticles(),
                api.getSupportTickets(),
            ]);
            setPosts(feedData.posts);
            setExplorePosts(exploreData.posts);
            setStories(storiesData.stories);
            setReels(reelsData);
            setTrendingTopics(trendingData);
            setSuggestedUsers(suggestionsData);
            setFeedActivities(feedActivityData);
            setSponsoredContent(sponsoredData);
            setSavedPosts(savedData);
            setArchivedPosts(archivedData);
            setNotifications(notificationsData);
            setTestimonials(testimonialsData);
            setHelpArticles(helpData);
            setSupportTickets(supportData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            showToast("Could not load data. Please refresh.");
        }
    }, []);
    
    // Check for token on initial load
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('currentUser');
        if (token && userJson) {
            const user = JSON.parse(userJson);
            setCurrentUser(user);
        }
    }, []);

    // Fetch data when user logs in
    useEffect(() => {
        if (currentUser) {
            fetchData();
            socketService.connect(currentUser.id);
        }
        return () => {
            socketService.disconnect();
        }
    }, [currentUser, fetchData]);

    // --- REAL-TIME SOCKET.IO LISTENERS ---

    useEffect(() => {
        const handleNewNotification = (newNotification: Notification) => {
            setNotifications(prev => [newNotification, ...prev]);
            showToast(`New notification from @${newNotification.user.username}`);
        };
        const handleNewMessage = (newMessage: { conversationId: string; message: any }) => {
            // Logic to update conversations state
             showToast(`New message received`);
        };

        socketService.on('new_notification', handleNewNotification);
        socketService.on('receive_message', handleNewMessage);

        return () => {
            socketService.off('new_notification');
            socketService.off('receive_message');
        };
    }, []);


    // --- UI & NAVIGATION HANDLERS ---

    const showToast = (message: string) => {
        setToastMessage(message);
    };

    const handleNavigate = (view: View, data?: any) => {
        if (view === 'profile' && data) {
            setProfileUser(data as User);
        } else if (view === 'profile' && !data) {
            setProfileUser(currentUser);
        } else {
             setProfileUser(null);
        }
        setCurrentView(view);
        window.scrollTo(0, 0); // Scroll to top on view change
    };

    // --- MODAL HANDLERS ---
    
    const openModal = (name: string, data?: any) => {
        setActiveModal(name);
        setModalData(data);
    };
    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };


    // --- ACTION HANDLERS (Likes, Comments, Follows, etc.) ---
    
    const handleLoginSuccess = ({ user, token }: { user: User, token: string }) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setCurrentView('home'); // or a dedicated login screen
    };
    
    // ... other action handlers ...
    const handleToggleLike = async (postId: string) => { /* ... API call ... */ };
    const handleToggleSave = async (postId: string) => { /* ... API call ... */ };
    const handleComment = async (postId: string, text: string) => { /* ... API call ... */ };
    const handleFollow = async (userToFollow: User) => { /* ... API call ... */ };
    const handleUnfollow = async (userToUnfollow: User) => { /* ... API call ... */ };
    const handleCreatePost = async (formData: FormData) => { /* ... API call ... */ };
    const handleCreateStory = async (formData: FormData) => { /* ... API call ... */ };
    const handleUpdateProfile = async (formData: FormData) => { /* ... API call ... */ };
    const handleArchivePost = async (post: Post) => { /* ... API call ... */ };
    const handleUnarchivePost = async (post: Post) => { /* ... API call ... */ };
    const handleCreateHighlight = async (title: string, storyIds: string[]) => { /* ... API call ... */ };
    const handleLikeReel = async (reelId: string) => { /* ... API call ... */ };
    const handlePostReelComment = async (reelId: string, text: string) => { /* ... API call ... */ };
    const handleLikeComment = async (commentId: string) => { /* ... API call ... */ };
    const handleUpdateSettings = async (settings: any) => { /* ... API call ... */ };
    const handleChangePassword = async (oldPass: string, newPass: string) => { /* ... API call ... */ };
    const handleShareAsMessage = async (recipient: User, content: Post | Reel) => { /* ... API call ... */ };
    const handleStoryReply = async (story: Story, replyText: string) => { /* ... API call ... */ };
    const handleSubmitSupportTicket = async (subject: string, description: string) => {
        try {
            await api.createSupportTicket(subject, description);
            showToast("Support ticket submitted.");
        } catch(error) {
            showToast("Failed to submit support ticket.");
            console.error(error);
        }
    };
    const handleSubmitReport = async (reason: string, details: string) => { /* ... API call ... */ };
    const handleSubscribePremium = async () => { /* ... API call ... */ };
    const handleApplyForVerification = async (appData: any) => { /* ... API call ... */ };
    const handleEnable2FA = async () => { /* ... API call ... */ };
    const handleUpdateUserRelationship = async (targetUser: User, action: 'mute' | 'unmute' | 'block' | 'unblock') => { /* ... API call ... */ };
    const handleMarkNotificationsRead = async () => { /* ... API call ... */ };



    // --- RENDER LOGIC ---

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
    }

    const renderView = () => {
        switch(currentView) {
            case 'home': return <HomeView posts={posts} stories={stories} currentUser={currentUser} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewStory={(story) => openModal('story', story)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', post)} onOptions={(post) => openModal('postOptions', post)} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => setShowSearch(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} />;
            case 'explore': return <ExploreView posts={explorePosts} onViewPost={(post) => openModal('post', post)} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={handleLikeReel} onCommentOnReel={(reel) => openModal('reelComments', reel)} onShareReel={(reel) => openModal('share', reel)} />;
            case 'messages': return <MessagesView conversations={conversations} currentUser={currentUser} allUsers={allUsers} onNavigate={(view, user) => handleNavigate(view, user)} />;
            case 'profile': return <ProfileView user={profileUser || currentUser} posts={posts.filter(p => p.user.id === (profileUser || currentUser).id)} reels={reels.filter(r => r.user.id === (profileUser || currentUser).id)} isCurrentUser={!profileUser || profileUser.id === currentUser.id} currentUser={currentUser} onEditProfile={() => openModal('editProfile')} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} onShowFollowers={(users) => openModal('followList', { title: 'Followers', users })} onShowFollowing={(users) => openModal('followList', { title: 'Following', users })} onEditPost={(post) => openModal('editPost', post)} onViewPost={(post) => openModal('post', post)} onViewReel={(reel) => {}} onOpenCreateHighlightModal={() => openModal('createHighlight')} onMessage={(user) => {}} />;
            case 'settings': return <SettingsView currentUser={currentUser} onNavigate={handleNavigate} onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')} onChangePassword={() => openModal('changePassword')} onManageAccount={() => openModal('editProfile')} onToggleTwoFactor={handleEnable2FA} onGetVerified={() => openModal('getVerified')} onUpdateSettings={handleUpdateSettings} />;
            case 'saved': return <SavedView posts={savedPosts} onViewPost={(post) => openModal('post', post)} />;
            case 'premium': return <PremiumView testimonials={testimonials} onSubscribe={() => openModal('payment')} />;
            case 'premium-welcome': return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help': return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support': return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => openModal('newSupportRequest')} />;
            case 'archive': return <ArchiveView posts={archivedPosts} onViewPost={(post) => openModal('post', post)} onUnarchivePost={handleUnarchivePost} />;
            case 'activity': return <ActivityView activities={notifications} />;
            default: return <HomeView posts={posts} stories={stories} currentUser={currentUser} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewStory={(story) => openModal('story', story)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', post)} onOptions={(post) => openModal('postOptions', post)} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => setShowSearch(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} />;
        }
    };
    
    const renderModal = () => {
        if (!activeModal) return null;
        switch(activeModal) {
            case 'post': return <PostModal post={modalData} currentUser={currentUser} onClose={closeModal} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => { closeModal(); handleNavigate('profile', user); }} onOptions={(post) => openModal('postOptions', post)} />;
            case 'story': return <StoryViewer stories={stories} initialStoryIndex={stories.findIndex(s => s.id === modalData.id)} onClose={closeModal} onNextUser={() => {}} onPrevUser={() => {}} />;
            case 'createPost': return <CreatePostModal onClose={closeModal} onCreatePost={handleCreatePost} />;
            case 'editProfile': return <EditProfileModal user={currentUser} onClose={closeModal} onSave={handleUpdateProfile} />;
            case 'followList': return <FollowListModal title={modalData.title} users={modalData.users} currentUser={currentUser} onClose={closeModal} onViewProfile={(user) => { closeModal(); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={handleUnfollow} />;
            case 'viewLikes': return <ViewLikesModal users={modalData} currentUser={currentUser} onClose={closeModal} onViewProfile={(user) => { closeModal(); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={handleUnfollow} />;
            case 'accountSwitcher': return <AccountSwitcherModal accounts={[currentUser]} currentUser={currentUser} onClose={closeModal} onSwitchAccount={() => {}} onAddAccount={() => {}} />;
            case 'createStory': return <CreateStoryModal onClose={closeModal} onCreateStory={handleCreateStory} />;
            case 'editPost': return <EditPostModal post={modalData} onClose={closeModal} onSave={() => {}} />;
            case 'postOptions': return <PostWithOptionsModal post={modalData} currentUser={currentUser} onClose={closeModal} onUnfollow={(user) => openModal('unfollow', user)} onFollow={handleFollow} onEdit={(post) => openModal('editPost', post)} onDelete={() => {}} onArchive={handleArchivePost} onUnarchive={handleUnarchivePost} onReport={(content) => openModal('report', content)} onShare={(post) => openModal('share', post)} onCopyLink={() => showToast('Link copied to clipboard!')} onViewProfile={(user) => { closeModal(); handleNavigate('profile', user); }} onGoToPost={(post) => { closeModal(); openModal('post', post); }} />;
            case 'unfollow': return <UnfollowModal user={modalData} onCancel={closeModal} onConfirm={() => { handleUnfollow(modalData); closeModal(); }} />;
            case 'share': return <ShareModal post={modalData} currentUser={currentUser} onClose={closeModal} onShareToUser={(user) => handleShareAsMessage(user, modalData)} />;
            case 'createHighlight': return <CreateHighlightModal userStories={stories.find(s=>s.user.id === currentUser.id)?.stories || []} onClose={closeModal} onCreate={handleCreateHighlight} />;
            case 'reelComments': return <ReelCommentsModal reel={modalData} currentUser={currentUser} onClose={closeModal} onPostComment={handlePostReelComment} onViewProfile={(user) => { closeModal(); handleNavigate('profile', user); }} />;
            case 'changePassword': return <ChangePasswordModal onClose={closeModal} onSubmit={handleChangePassword} />;
            case 'getVerified': return <GetVerifiedModal onClose={closeModal} onSubmit={handleApplyForVerification} />;
            case 'twoFactorAuth': return <TwoFactorAuthModal onClose={closeModal} onEnable={handleEnable2FA} />;
            case 'payment': return <PaymentModal onClose={closeModal} onConfirmPayment={() => { handleSubscribePremium(); closeModal(); handleNavigate('premium-welcome'); }} />;
            case 'forgotPassword': return <ForgotPasswordModal onClose={closeModal} onSubmit={() => showToast("Password reset link sent!")} />;
            case 'newSupportRequest': return <NewSupportRequestModal onClose={closeModal} onSubmit={handleSubmitSupportTicket} />;
            case 'report': return <ReportModal content={modalData} onClose={closeModal} onSubmitReport={handleSubmitReport} />;
            default: return null;
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="flex">
                <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => setShowSearch(true)} onShowNotifications={() => setShowNotificationsPanel(true)} onCreatePost={() => openModal('createPost')} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} />
                <div className="flex-1 md:ml-[72px] lg:ml-64">
                    {renderView()}
                </div>
            </div>
            <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} currentUser={currentUser} />
            
            {/* Overlays */}
            {toastMessage && <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-50"><Toast message={toastMessage} onDismiss={() => setToastMessage(null)} /></div>}
            {renderModal()}
            {showNotificationsPanel && <NotificationsPanel notifications={notifications} onClose={() => setShowNotificationsPanel(false)} onViewProfile={(user) => {setShowNotificationsPanel(false); handleNavigate('profile', user);}} onMarkAsRead={handleMarkNotificationsRead} />}
            {showSearch && <SearchView users={allUsers} onClose={() => setShowSearch(false)} onViewProfile={(user) => {setShowSearch(false); handleNavigate('profile', user);}} />}
        </div>
    );
};

export default App;
