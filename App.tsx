import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import type { View, User, Post, Story, Reel, Notification, Conversation, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, Comment, Message, StoryItem } from './types.ts';

// Import Views
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

// Import Components and Modals
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import Toast from './components/Toast.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';

const App: React.FC = () => {
    // App State
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewedProfileData, setViewedProfileData] = useState<{user: User, posts: Post[], reels: Reel[]} | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Data State
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [explorePosts, setExplorePosts] = useState<Post[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
    
    // Modal & Panel State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        try {
            const [feed, reelsData, convos, sidebar, allUsersData, premiumData, helpData, supportData, savedData, archivedData, notificationsData] = await Promise.all([
                api.getFeed(),
                api.getReels(),
                api.getConversations(),
                api.getSidebarData(),
                api.getAllUsers(),
                api.getPremiumPageData(),
                api.getHelpArticles(),
                api.getSupportTickets(),
                api.getSavedPosts(),
                api.getArchivedPosts(),
                api.getNotifications()
            ]);
            setPosts(feed.posts);
            setStories(feed.stories);
            setReels(reelsData);
            setConversations(convos);
            setAllUsers(allUsersData);
            setExplorePosts(await api.getExplorePosts()); // Fetch explore separately
            setSuggestedUsers(sidebar.suggestedUsers);
            setTrendingTopics(sidebar.trendingTopics);
            setFeedActivities(sidebar.feedActivities);
            setSponsoredContent(sidebar.sponsoredContent);
            setTestimonials(premiumData.testimonials);
            setHelpArticles(helpData);
            setSupportTickets(supportData);
            setSavedPosts(savedData);
            setArchivedPosts(archivedData);
            setNotifications(notificationsData);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            showToast("Could not load your feed.");
        }
    }, [currentUser]);

    const handleLoginSuccess = useCallback((data: { user: User, token: string }) => {
        localStorage.setItem('authToken', data.token);
        api.setAuthToken(data.token);
        setCurrentUser(data.user);
        socketService.connect(data.user.id);
        setCurrentView('home');
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        api.setAuthToken(null);
        setCurrentUser(null);
        socketService.disconnect();
    }, []);
    
    // Optimistic UI updates
    const optimisticallyUpdatePost = (postId: string, update: (post: Post) => Post) => {
        setPosts(prev => prev.map(p => p.id === postId ? update(p) : p));
        if (activeModal === 'post' && modalData?.id === postId) {
            setModalData((prev: Post) => update(prev));
        }
    };

    const handleToggleLike = async (postId: string) => {
        if (!currentUser) return;
        const originalPosts = [...posts];
        optimisticallyUpdatePost(postId, post => {
            const isLiked = post.likedBy.some(u => u.id === currentUser.id);
            return {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                likedBy: isLiked ? post.likedBy.filter(u => u.id !== currentUser.id) : [...post.likedBy, currentUser],
            };
        });
        try {
            await api.toggleLikePost(postId);
        } catch (error) {
            showToast("Couldn't like post.");
            setPosts(originalPosts);
        }
    };
    
    // All other handlers from previous turns would be here...
    const handleFollow = async (userToFollow: User) => {
        if (!currentUser) return;
        const originalUser = { ...currentUser };
        setCurrentUser(prev => prev ? { ...prev, following: [...prev.following, userToFollow] } : null);
        try {
            await api.followUser(userToFollow.id);
            showToast(`You are now following ${userToFollow.username}`);
        } catch (error) {
            setCurrentUser(originalUser);
            showToast(`Could not follow ${userToFollow.username}`);
        }
    };

    const handleUnfollow = async (userToUnfollow: User) => {
        if (!currentUser) return;
        const originalUser = { ...currentUser };
        setCurrentUser(prev => prev ? { ...prev, following: prev.following.filter(u => u.id !== userToUnfollow.id) } : null);
        try {
            await api.unfollowUser(userToUnfollow.id);
            showToast(`You have unfollowed ${userToUnfollow.username}`);
        } catch (error) {
            setCurrentUser(originalUser);
            showToast(`Could not unfollow ${userToUnfollow.username}`);
        }
    };
    
    const handleCreatePost = async (formData: FormData) => {
        try {
            const newPost = await api.createPost(formData);
            setPosts(prev => [newPost, ...prev]);
            setActiveModal(null);
            showToast("Post created successfully!");
        } catch (error) {
            console.error("Failed to create post", error);
            showToast("Could not create post.");
        }
    };
    
    const handleCreateStory = async (formData: FormData) => {
        try {
            await api.createStory(formData);
            setActiveModal(null);
            showToast("Story created successfully!");
            // Refetch stories or update state optimistically
            fetchData();
        } catch (error) {
            console.error("Failed to create story", error);
            showToast("Could not create story.");
        }
    };

    const handleUpdateUser = async (formData: FormData) => {
        try {
            const updatedUser = await api.updateUser(formData);
            setCurrentUser(updatedUser);
            setActiveModal(null);
            showToast("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            showToast("Could not update profile.");
        }
    }

    const handleComment = async (postId: string, text: string) => {
        try {
            const newComment = await api.addComment(postId, text);
            optimisticallyUpdatePost(postId, post => ({
                ...post,
                comments: [...post.comments, newComment]
            }));
        } catch (error) {
            showToast("Failed to post comment.");
        }
    };
    
    const handleNavigate = (view: View) => {
        setCurrentView(view);
        setViewedProfileData(null);
    };

    const handleViewProfile = async (user: User) => {
        if (currentUser && user.id === currentUser.id) {
            setViewedProfileData(null);
            setCurrentView('profile');
        } else {
            try {
                const profileData = await api.getUserProfile(user.username);
                setViewedProfileData(profileData);
                setCurrentView('profile');
            } catch (error) {
                console.error("Failed to load profile:", error);
                showToast("Could not load profile.");
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.setAuthToken(token);
            api.getCurrentUser()
                .then(data => {
                    setCurrentUser(data.user);
                    socketService.connect(data.user.id);
                })
                .catch(() => handleLogout())
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
        return () => socketService.disconnect();
    }, [handleLogout]);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, fetchData]);
    
    // ... all other handlers would be implemented here connecting to apiService
    

    if (isLoading) {
        return <div className="bg-black text-white flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setActiveModal('forgotPassword')} />;
    }
    
    const renderView = () => {
        switch (currentView) {
            case 'home':
                return <HomeView posts={posts} stories={stories} currentUser={currentUser} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onNavigate={handleNavigate} onShowSearch={() => setSearchVisible(true)} onViewProfile={handleViewProfile} onFollow={handleFollow} onUnfollow={handleUnfollow} onToggleLike={handleToggleLike} onToggleSave={() => {}} onComment={handleComment} onShare={(p) => { setModalData(p); setActiveModal('share'); }} onViewStory={(s) => { setModalData(s); setActiveModal('story'); }} onViewLikes={(u) => { setModalData(u); setActiveModal('viewLikes'); }} onViewPost={(p) => { setModalData(p); setActiveModal('post'); }} onOptions={(p) => { setModalData(p); setActiveModal('postOptions'); }} onShowSuggestions={() => setActiveModal('suggestions')} onShowTrends={() => setActiveModal('trends')} onCreateStory={() => setActiveModal('createStory')} />;
            case 'explore':
                return <ExploreView posts={explorePosts} onViewPost={(p) => { setModalData(p); setActiveModal('post'); }} />;
            case 'reels':
                return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={() => {}} onCommentOnReel={(r) => { setModalData(r); setActiveModal('reelComments'); }} onShareReel={(r) => { setModalData(r); setActiveModal('share'); }} />;
            case 'messages':
                return <MessagesView conversations={conversations} currentUser={currentUser} allUsers={allUsers} onNavigate={(view, user) => handleViewProfile(user)} />;
            case 'profile':
                 const userToView = viewedProfileData?.user || currentUser;
                 const postsToView = viewedProfileData?.posts || posts.filter(p => p.user.id === currentUser.id);
                 const reelsToView = viewedProfileData?.reels || reels.filter(r => r.user.id === currentUser.id);
                 return <ProfileView user={userToView} posts={postsToView} reels={reelsToView} isCurrentUser={!viewedProfileData} currentUser={currentUser} onEditProfile={() => setActiveModal('editProfile')} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={handleUnfollow} onShowFollowers={(u) => { setModalData({title: 'Followers', users: u}); setActiveModal('followList'); }} onShowFollowing={(u) => { setModalData({title: 'Following', users: u}); setActiveModal('followList'); }} onEditPost={(p) => { setModalData(p); setActiveModal('editPost'); }} onViewPost={(p) => { setModalData(p); setActiveModal('post'); }} onViewReel={() => {}} onOpenCreateHighlightModal={() => { setModalData({userStories: stories.find(s=>s.user.id === currentUser.id)?.stories || []}); setActiveModal('createHighlight'); }} onMessage={() => {}} />;
            case 'settings':
                return <SettingsView currentUser={currentUser} onNavigate={handleNavigate} onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')} onChangePassword={() => setActiveModal('changePassword')} onManageAccount={() => setActiveModal('editProfile')} onToggleTwoFactor={() => setActiveModal('2fa')} onGetVerified={() => setActiveModal('getVerified')} onUpdateSettings={() => {}} />;
            case 'saved':
                return <SavedView posts={savedPosts} onViewPost={(p) => { setModalData(p); setActiveModal('post'); }} />;
            case 'archive':
                return <ArchiveView posts={archivedPosts} onViewPost={(p) => { setModalData(p); setActiveModal('post'); }} onUnarchivePost={()=>{}} />;
            case 'premium':
                return <PremiumView onShowPaymentModal={() => setActiveModal('payment')} isCurrentUserPremium={currentUser.isPremium} testimonials={testimonials} />;
            case 'premium-welcome':
                return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help':
                return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support':
                return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setActiveModal('newSupport')} />;
            case 'activity':
                return <ActivityView activities={notifications} />;
            default:
                return <HomeView posts={posts} stories={stories} currentUser={currentUser} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onNavigate={handleNavigate} onShowSearch={() => setSearchVisible(true)} onViewProfile={handleViewProfile} onFollow={handleFollow} onUnfollow={handleUnfollow} onToggleLike={handleToggleLike} onToggleSave={() => {}} onComment={handleComment} onShare={(p) => { setModalData(p); setActiveModal('share'); }} onViewStory={(s) => { setModalData(s); setActiveModal('story'); }} onViewLikes={(u) => { setModalData(u); setActiveModal('viewLikes'); }} onViewPost={(p) => { setModalData(p); setActiveModal('post'); }} onOptions={(p) => { setModalData(p); setActiveModal('postOptions'); }} onShowSuggestions={() => setActiveModal('suggestions')} onShowTrends={() => setActiveModal('trends')} onCreateStory={() => setActiveModal('createStory')} />;
        }
    };

    return (
        <div className="bg-black text-white font-sans min-h-screen">
             <div className="flex">
                <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => setSearchVisible(true)} onShowNotifications={() => setNotificationsVisible(true)} onCreatePost={() => setActiveModal('createPost')} onSwitchAccount={() => setActiveModal('accountSwitcher')} onLogout={handleLogout} />
                <div className="flex-1 md:ml-[72px] lg:ml-64">
                    <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setActiveModal('accountSwitcher')} onCreatePost={() => setActiveModal('createPost')} onShowNotifications={() => setNotificationsVisible(true)} onLogout={handleLogout} />
                    <main className="md:border-t md:border-gray-800">{renderView()}</main>
                </div>
            </div>
            <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => setActiveModal('createPost')} />
            
            {/* Modals & Panels */}
            {activeModal === 'createPost' && <CreatePostModal onClose={() => setActiveModal(null)} onCreatePost={handleCreatePost} />}
            {activeModal === 'createStory' && <CreateStoryModal onClose={() => setActiveModal(null)} onCreateStory={handleCreateStory} />}
            {activeModal === 'editProfile' && <EditProfileModal user={currentUser} onClose={() => setActiveModal(null)} onSave={handleUpdateUser} />}
            {activeModal === 'post' && <PostModal post={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onToggleLike={handleToggleLike} onToggleSave={()=>{}} onComment={handleComment} onShare={()=>{}} onViewLikes={()=>{}} onViewProfile={handleViewProfile} onOptions={()=>{}} />}
            {activeModal === 'viewLikes' && <ViewLikesModal users={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={handleViewProfile} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModal === 'followList' && <FollowListModal title={modalData.title} users={modalData.users} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={handleViewProfile} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModal === 'postOptions' && <PostWithOptionsModal post={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onUnfollow={handleUnfollow} onFollow={handleFollow} onEdit={()=>{}} onDelete={()=>{}} onArchive={()=>{}} onReport={()=>{}} onShare={()=>{}} onCopyLink={()=>{}} onViewProfile={handleViewProfile} onGoToPost={()=>{}} />}
            {isSearchVisible && <SearchView users={allUsers} onClose={() => setSearchVisible(false)} onViewProfile={handleViewProfile} />}
            {isNotificationsVisible && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsVisible(false)} />}

            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};

export default App;
