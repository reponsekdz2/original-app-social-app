
import React, { useState, useEffect } from 'react';
import type { View, User, Post, Story, Reel, Notification, Conversation, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, StoryItem } from './types.ts';
import { socketService } from './services/socketService.ts';
import * as api from './services/apiService.ts';

// Main View Components
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import PremiumView from './components/PremiumView.tsx';
import AuthView from './components/AuthView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import ActivityView from './components/ActivityView.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';

// Layout Components
import Header from './components/Header.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import BottomNav from './components/BottomNav.tsx';

// Modal Components
import CreatePostModal from './components/CreatePostModal.tsx';
import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SearchView from './components/SearchView.tsx';
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';

// Other Components
import Toast from './components/Toast.tsx';

const App: React.FC = () => {
    // Global State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    
    // Sidebar State
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    
    // UI State
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Modal State
    const [activeModals, setActiveModals] = useState<Record<string, any>>({});
    
    // Static data (fetched once)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);


    // Mock accounts for switcher
    const [accounts] = useState<User[]>([]);

    useEffect(() => {
        if (currentUser) {
            socketService.connect(currentUser.id);
        } else {
            socketService.disconnect();
        }
        return () => { socketService.disconnect(); };
    }, [currentUser]);

    // Data Fetching
    const fetchData = async () => {
        try {
            const [{posts, stories}, explorePosts, reelsData, sidebarData, users, convos, notifs, staticData] = await Promise.all([
                api.getFeed(),
                api.getExplore(),
                api.getReels(),
                api.getSidebarData(),
                api.getAllUsers(),
                api.getConversations(),
                api.getNotifications(),
                Promise.all([api.getTestimonials(), api.getHelpArticles(), api.getSupportTickets()])
            ]);
            setPosts(posts);
            setStories(stories);
            setReels(reelsData);
            setTrendingTopics(sidebarData.trendingTopics);
            setSuggestedUsers(sidebarData.suggestedUsers);
            setFeedActivities(sidebarData.feedActivities);
            setSponsoredContent(sidebarData.sponsoredContent);
            setConversations(sidebarData.conversations.length > 0 ? sidebarData.conversations : convos);
            setAllUsers(users);
            setNotifications(notifs);
            setTestimonials(staticData[0]);
            setHelpArticles(staticData[1]);
            setSupportTickets(staticData[2]);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            showToast("Failed to load data. Please refresh.");
        }
    };
    
    useEffect(() => {
        if(currentUser) fetchData();
    }, [currentUser]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setCurrentView('home');
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
    }
    
    // Navigation
    const handleNavigate = (view: View, user?: User) => {
        if (view === 'profile' && user) {
            setProfileUser(user);
        } else if (view === 'profile' && currentUser) {
            setProfileUser(currentUser);
        }
        setCurrentView(view);
        // Close any open side panels
        setActiveModals(m => ({...m, notifications: null, search: null}));
    };

    // Modal Management
    const openModal = (modalName: string, data: any = true) => setActiveModals(prev => ({...prev, [modalName]: data}));
    const closeModal = (modalName: string) => setActiveModals(prev => ({...prev, [modalName]: null}));

    // Actions
    const handleToggleLike = (postId: string) => {
      // Mock logic, in real app this would be an API call
      setPosts(posts.map(p => p.id === postId ? {...p, likedBy: p.likedBy.some(u => u.id === currentUser!.id) ? p.likedBy.filter(u => u.id !== currentUser!.id) : [...p.likedBy, currentUser!], likes: p.likedBy.some(u => u.id === currentUser!.id) ? p.likes-1 : p.likes+1 } : p));
    };

    const handleToggleSave = (postId: string) => {
      setPosts(posts.map(p => p.id === postId ? {...p, savedBy: p.savedBy.some(u => u.id === currentUser!.id) ? p.savedBy.filter(u => u.id !== currentUser!.id) : [...p.savedBy, currentUser!]} : p));
      showToast('Post saved!');
    };
    
    const handleComment = (postId: string, text: string) => {
       const newComment = { id: `c${Date.now()}`, user: currentUser!, text, timestamp: 'now', likes: 0, likedBy: [] };
       setPosts(posts.map(p => p.id === postId ? {...p, comments: [...p.comments, newComment]} : p));
    };
    
    const handleCreatePost = (media: Omit<PostMedia, 'id'>[], caption: string, location: string) => {
        const newPost: Post = {
            id: `p${Date.now()}`,
            user: currentUser!,
            media: media.map((m, i) => ({...m, id: `m${Date.now()}-${i}`})),
            caption,
            location,
            likes: 0,
            likedBy: [],
            comments: [],
            savedBy: [],
            timestamp: 'now',
        };
        setPosts([newPost, ...posts]);
        closeModal('createPost');
    };

    const handleCreateStory = (storyItem: Omit<StoryItem, 'id'>) => {
        const newStoryItem = {...storyItem, id: `si${Date.now()}`};
        const userStory = stories.find(s => s.user.id === currentUser!.id);
        if (userStory) {
            setStories(stories.map(s => s.id === userStory.id ? {...s, stories: [...s.stories, newStoryItem]} : s));
        } else {
            const newStory: Story = { id: `s${currentUser!.id}`, user: currentUser!, stories: [newStoryItem] };
            setStories([newStory, ...stories]);
        }
        closeModal('createStory');
        showToast('Story posted!');
    };


    const renderView = () => {
        if (!currentUser) return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
        switch(currentView) {
            case 'home': return <HomeView posts={posts} stories={stories} currentUser={currentUser} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onViewStory={(story) => openModal('story', {stories: stories.filter(s => s.stories.length > 0), startIndex: stories.filter(s => s.stories.length > 0).findIndex(s => s.id === story.id)})} onViewPost={(post) => openModal('post', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onOptions={(post) => openModal('postOptions', post)} onShare={(post) => openModal('share', post)} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => openModal('search', true)} onNavigate={handleNavigate} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => openModal('unfollow', user)} />;
            case 'explore': return <ExploreView posts={posts.slice().reverse()} onViewPost={(post) => openModal('post', post)} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={(id) => showToast(`Liked reel ${id}`)} onCommentOnReel={(reel) => openModal('reelComments', reel)} onShareReel={(reel) => openModal('share', reel)} />;
            case 'messages': return <MessagesView conversations={conversations} currentUser={currentUser} onNavigate={handleNavigate} allUsers={allUsers.filter(u => u.id !== currentUser.id)} />;
            case 'profile': return <ProfileView user={profileUser!} posts={posts.filter(p => p.user.id === profileUser!.id)} reels={reels.filter(r => r.user.id === profileUser!.id)} isCurrentUser={profileUser!.id === currentUser.id} currentUser={currentUser} onEditProfile={() => openModal('editProfile')} onViewArchive={() => handleNavigate('archive')} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => openModal('unfollow', user)} onShowFollowers={(users) => openModal('followList', {title: 'Followers', users})} onShowFollowing={(users) => openModal('followList', {title: 'Following', users})} onEditPost={(post) => openModal('editPost', post)} onViewPost={(post) => openModal('post', post)} onViewReel={(reel) => showToast(`Viewing reel ${reel.id}`)} onOpenCreateHighlightModal={() => openModal('createHighlight')} onMessage={(user) => showToast(`Messaging ${user.username}`)} />;
            case 'settings': return <SettingsView currentUser={currentUser} onNavigate={handleNavigate} onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')} onChangePassword={() => openModal('changePassword')} onManageAccount={() => openModal('editProfile')} onToggleTwoFactor={() => openModal('2fa')} onGetVerified={() => openModal('getVerified')} onUpdateSettings={(settings) => {setCurrentUser({...currentUser, ...settings}); showToast('Settings updated');}} />;
            case 'saved': return <SavedView posts={posts.filter(p => p.savedBy.some(u => u.id === currentUser.id))} onViewPost={(post) => openModal('post', post)} />;
            case 'premium': return <PremiumView onShowPaymentModal={() => openModal('payment')} isCurrentUserPremium={currentUser.isPremium} testimonials={testimonials} />;
            case 'archive': return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={(post) => openModal('post', post)} onUnarchivePost={(post) => showToast(`Unarchived ${post.id}`)} />;
            case 'activity': return <ActivityView activities={notifications} />;
            case 'premium-welcome': return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help': return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support': return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => openModal('newSupportRequest')} />;
            default: return <HomeView posts={posts} stories={stories} currentUser={currentUser} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onViewStory={(story) => openModal('story', {stories: stories, startIndex: stories.findIndex(s => s.id === story.id)})} onViewPost={(post) => openModal('post', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onOptions={(post) => openModal('postOptions', post)} onShare={(post) => openModal('share', post)} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => openModal('search', true)} onNavigate={handleNavigate} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => openModal('unfollow', user)} />;
        }
    };

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
    }
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <div className="md:pl-[72px] lg:pl-64">
                <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => openModal('search')} onShowNotifications={() => openModal('notifications')} onCreatePost={() => openModal('createPost')} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} />
                <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => openModal('accountSwitcher')} onCreatePost={() => openModal('createPost')} onShowNotifications={() => openModal('notifications')} onLogout={handleLogout} />
                <main className="container mx-auto">
                    {renderView()}
                </main>
                <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} />
            </div>

            {/* Modals */}
            {activeModals.createPost && <CreatePostModal onClose={() => closeModal('createPost')} onCreatePost={handleCreatePost} />}
            {activeModals.post && <PostModal post={activeModals.post} currentUser={currentUser} onClose={() => closeModal('post')} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => {closeModal('post'); handleNavigate('profile', user);}} onOptions={(post) => openModal('postOptions', post)} />}
            {activeModals.story && <StoryViewer stories={activeModals.story.stories} startIndex={activeModals.story.startIndex} onClose={() => closeModal('story')} onViewProfile={(user) => {closeModal('story'); handleNavigate('profile', user);}} onReply={(user, content) => showToast(`Replied to ${user.username}: ${content}`)} onShare={(story) => {closeModal('story'); openModal('share', story)}} />}
            {activeModals.accountSwitcher && <AccountSwitcherModal accounts={[currentUser, ...accounts]} currentUser={currentUser} onClose={() => closeModal('accountSwitcher')} onSwitchAccount={(id) => showToast(`Switched to account ${id}`)} onAddAccount={() => showToast('Add account clicked')} />}
            {activeModals.notifications && <NotificationsPanel notifications={notifications} onClose={() => closeModal('notifications')} />}
            {activeModals.search && <SearchView users={allUsers} onClose={() => closeModal('search')} onViewProfile={(user) => {closeModal('search'); handleNavigate('profile', user);}} />}
            {activeModals.share && <ShareModal content={activeModals.share} users={allUsers.filter(u => u.id !== currentUser.id)} onClose={() => closeModal('share')} onSendShare={(user) => showToast(`Shared with ${user.username}`)} onCopyLink={() => {showToast('Link copied!');}} />}
            {activeModals.viewLikes && <ViewLikesModal users={activeModals.viewLikes} currentUser={currentUser} onClose={() => closeModal('viewLikes')} onViewProfile={(user) => {closeModal('viewLikes'); handleNavigate('profile', user);}} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => openModal('unfollow', user)} />}
            {activeModals.followList && <FollowListModal {...activeModals.followList} currentUser={currentUser} onClose={() => closeModal('followList')} onViewProfile={(user) => {closeModal('followList'); handleNavigate('profile', user);}} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => openModal('unfollow', user)} />}
            {activeModals.editProfile && <EditProfileModal user={currentUser} onClose={() => closeModal('editProfile')} onSave={(updatedUser) => {setCurrentUser(updatedUser); closeModal('editProfile'); showToast('Profile updated!');}} />}
            {activeModals.unfollow && <UnfollowModal user={activeModals.unfollow} onCancel={() => closeModal('unfollow')} onConfirm={() => {showToast(`Unfollowed ${activeModals.unfollow.username}`); closeModal('unfollow');}} />}
            {activeModals.postOptions && <PostWithOptionsModal post={activeModals.postOptions} currentUser={currentUser} onClose={() => closeModal('postOptions')} onUnfollow={(user) => {showToast(`Unfollowed ${user.username}`);}} onFollow={(user) => showToast(`Followed ${user.username}`)} onEdit={(post) => openModal('editPost', post)} onDelete={(post) => {setPosts(posts.filter(p => p.id !== post.id)); showToast('Post deleted');}} onArchive={(post) => showToast('Post archived')} onReport={(post) => openModal('report', post)} onShare={(post) => openModal('share', post)} onCopyLink={() => showToast('Link copied')} onViewProfile={(user) => handleNavigate('profile', user)} onGoToPost={(post) => openModal('post', post)} />}
            {activeModals.reelComments && <ReelCommentsModal reel={activeModals.reelComments} currentUser={currentUser} onClose={() => closeModal('reelComments')} onPostComment={(id, text) => showToast(`Commented on reel ${id}`)} onLikeComment={(id) => showToast(`Liked comment ${id}`)} onViewProfile={(user) => handleNavigate('profile', user)} />}
            {activeModals.createStory && <CreateStoryModal onClose={() => closeModal('createStory')} onCreateStory={handleCreateStory} />}
            {activeModals.createHighlight && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={() => closeModal('createHighlight')} onCreate={(title) => {showToast(`Created highlight "${title}"`); closeModal('createHighlight');}} />}
            {activeModals.trends && <TrendsModal topics={trendingTopics} onClose={() => closeModal('trends')} />}
            {activeModals.suggestions && <SuggestionsModal users={suggestedUsers} currentUser={currentUser} onClose={() => closeModal('suggestions')} onViewProfile={(user) => handleNavigate('profile', user)} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => openModal('unfollow', user)}/>}
            {activeModals.payment && <PaymentModal onClose={() => closeModal('payment')} onConfirmPayment={() => {setCurrentUser({...currentUser, isPremium: true}); closeModal('payment'); handleNavigate('premium-welcome');}} />}
            {activeModals.getVerified && <GetVerifiedModal onClose={() => closeModal('getVerified')} onSubmit={() => {showToast('Verification application submitted!'); closeModal('getVerified');}} />}
            {activeModals.changePassword && <ChangePasswordModal onClose={() => closeModal('changePassword')} onSave={() => {showToast('Password changed successfully!'); closeModal('changePassword');}} />}
            {activeModals.twoFA && <TwoFactorAuthModal onClose={() => closeModal('2fa')} onEnable={() => {showToast('Two-factor authentication enabled!'); closeModal('2fa');}} />}
            {activeModals.newSupportRequest && <NewSupportRequestModal onClose={() => closeModal('newSupportRequest')} onSubmit={() => {showToast('Support ticket submitted!'); closeModal('newSupportRequest');}} />}
            {activeModals.forgotPassword && <ForgotPasswordModal onClose={() => closeModal('forgotPassword')} onSubmit={async (id) => {await api.forgotPassword(id); showToast('Password reset link sent!'); closeModal('forgotPassword');}} />}
            {activeModals.resetPassword && <ResetPasswordModal onClose={() => closeModal('resetPassword')} onSubmit={async (pw) => {showToast('Password has been reset.'); closeModal('resetPassword');}} />}
            {activeModals.report && <ReportModal onClose={() => closeModal('report')} onSubmitReport={(reason) => {showToast(`Report submitted for: ${reason}`); closeModal('report');}} />}
            {activeModals.editPost && <EditPostModal post={activeModals.editPost} onClose={() => closeModal('editPost')} onSave={(post) => {setPosts(posts.map(p => p.id === post.id ? post : p)); closeModal('editPost'); showToast('Post updated!');}} />}
            
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};

export default App;
