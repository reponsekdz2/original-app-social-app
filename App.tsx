
import React, { useState, useEffect, useCallback } from 'react';

// API & Services
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

// Types
import type { View, User, Post, Story, Reel, Conversation, Notification, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, StoryItem, Comment } from './types.ts';

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

// Components
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import Toast from './components/Toast.tsx';

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
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import MediaViewerModal from './components/MediaViewerModal.tsx';
import IncomingCallModal from './components/IncomingCallModal.tsx';
import CallModal from './components/CallModal.tsx';

const App: React.FC = () => {
    // Authentication & User State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]); // For search, messages, etc.
    const [isLoading, setIsLoading] = useState(true);
    
    // Navigation State
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null); // User whose profile is being viewed
    const [previousView, setPreviousView] = useState<View>('home');


    // Data State
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

    // Modal & Panel State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null); // Flexible data for modals
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
    };

    const handleLoginSuccess = useCallback((data: { user: User, token: string }) => {
        localStorage.setItem('authToken', data.token);
        setCurrentUser(data.user);
        socketService.connect(data.user.id);
        fetchInitialData();
    }, []);

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            // In a real app, you'd fetch all users separately or as needed.
            // For now, we simulate it.
            const feedData = await api.getFeed();
            const storiesData = await api.getStories();
            // const reelsData = await api.getReels();
            // const convosData = await api.getConversations();
            // const notifsData = await api.getNotifications();
            const trendingData = await api.getTrending();
            const suggestionsData = await api.getSuggestions();
            const activitiesData = await api.getFeedActivities();
            const sponsoredData = await api.getSponsoredContent();

            setPosts(feedData.posts);
            setStories(storiesData.stories);
            // setReels(reelsData);
            // setConversations(convoData);
            // setNotifications(notifsData);
            setTrendingTopics(trendingData);
            setSuggestedUsers(suggestionsData);
            setFeedActivities(activitiesData);
            setSponsoredContent(sponsoredData);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            // Could handle token expiry here
        } finally {
            setIsLoading(false);
        }
    }, []);


    // Initial Load Effect
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Here you would typically verify the token and get user data
            // For this mock, we assume the token is valid and refetch data.
            // A better implementation would be a /api/auth/me endpoint.
            // For now, we just proceed to fetch data, assuming currentUser will be set.
            // We'll skip setting the user from a `me` endpoint for simplicity and rely on login.
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        socketService.disconnect();
        setCurrentView('home');
    };
    
    const handleNavigate = (view: View, data?: any) => {
        setPreviousView(currentView);
        if (view === 'profile' && data) {
            setProfileUser(data as User);
        }
        setCurrentView(view);
    };
    
    // --- Generic Modal Handlers ---
    const openModal = (modalName: string, data: any = null) => {
        setActiveModal(modalName);
        setModalData(data);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // --- Specific Event Handlers ---
    const handleToggleLike = async (postId: string) => {
        // Optimistic update
        const originalPosts = [...posts];
        setPosts(currentPosts => currentPosts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likedBy.some(u => u.id === currentUser!.id);
                return {
                    ...p,
                    likes: isLiked ? p.likes - 1 : p.likes + 1,
                    likedBy: isLiked ? p.likedBy.filter(u => u.id !== currentUser!.id) : [...p.likedBy, currentUser!]
                };
            }
            return p;
        }));
        try {
            await api.toggleLike(postId);
        } catch (error) {
            setPosts(originalPosts); // Revert on error
            showToast('Failed to update like.');
        }
    };
    
    const handleFollow = async (userToFollow: User) => {
        // Optimistic update
        if (!currentUser) return;
        const originalUser = { ...currentUser };
        setCurrentUser({
            ...currentUser,
            following: [...currentUser.following, userToFollow]
        });
        showToast(`You are now following ${userToFollow.username}`);
        try {
            await api.followUser(userToFollow.id);
        } catch (error) {
            setCurrentUser(originalUser); // Revert
            showToast('Failed to follow user.');
        }
    };

    const handleUnfollow = (userToUnfollow: User) => {
        openModal('unfollow', userToUnfollow);
    };
    
    const confirmUnfollow = async (userToUnfollow: User) => {
        if (!currentUser) return;
        const originalUser = { ...currentUser };
        setCurrentUser({
            ...currentUser,
            following: currentUser.following.filter(u => u.id !== userToUnfollow.id)
        });
        closeModal();
        showToast(`You have unfollowed ${userToUnfollow.username}`);
        try {
            await api.unfollowUser(userToUnfollow.id);
        } catch (error) {
            setCurrentUser(originalUser); // Revert
            showToast('Failed to unfollow user.');
        }
    };

    const renderView = () => {
        if (isLoading) {
            return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
        }

        switch (currentView) {
            case 'home':
                return <HomeView 
                    posts={posts}
                    stories={stories}
                    currentUser={currentUser!}
                    suggestedUsers={suggestedUsers}
                    trendingTopics={trendingTopics}
                    feedActivities={feedActivities}
                    sponsoredContent={sponsoredContent}
                    conversations={conversations}
                    onToggleLike={handleToggleLike}
                    onToggleSave={() => {}}
                    onComment={() => {}}
                    onShare={(post) => openModal('share', post)}
                    onViewStory={(story) => openModal('story', story)}
                    onViewLikes={(users) => openModal('viewLikes', users)}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onViewPost={(post) => openModal('post', post)}
                    onOptions={(post) => openModal('postOptions', post)}
                    onShowSuggestions={() => openModal('suggestions', suggestedUsers)}
                    onShowTrends={() => openModal('trends', trendingTopics)}
                    onCreateStory={() => openModal('createStory')}
                    onShowSearch={() => setSearchVisible(true)}
                    onNavigate={handleNavigate}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={(post) => openModal('post', post)} />;
            case 'reels':
                return <ReelsView 
                            reels={reels} 
                            currentUser={currentUser!} 
                            onLikeReel={() => {}} 
                            onCommentOnReel={(reel) => openModal('reelComments', reel)}
                            onShareReel={(reel) => openModal('share', reel)}
                        />;
            case 'messages':
                return <MessagesView 
                            conversations={conversations} 
                            currentUser={currentUser!}
                            allUsers={allUsers}
                            onNavigate={(view, user) => handleNavigate(view, user)}
                        />;
            case 'profile':
                return <ProfileView 
                            user={profileUser || currentUser!}
                            posts={posts.filter(p => p.user.id === (profileUser || currentUser!).id)}
                            reels={reels.filter(r => r.user.id === (profileUser || currentUser!).id)}
                            isCurrentUser={!profileUser || profileUser.id === currentUser!.id}
                            currentUser={currentUser!}
                            onEditProfile={() => openModal('editProfile', currentUser)}
                            onViewArchive={() => handleNavigate('archive')}
                            onFollow={handleFollow}
                            onUnfollow={handleUnfollow}
                            onShowFollowers={(users) => openModal('followList', { title: 'Followers', users })}
                            onShowFollowing={(users) => openModal('followList', { title: 'Following', users })}
                            onEditPost={(post) => openModal('editPost', post)}
                            onViewPost={(post) => openModal('post', post)}
                            onViewReel={() => {}}
                            onOpenCreateHighlightModal={() => openModal('createHighlight')}
                            onMessage={(user) => handleNavigate('messages', user)} // Needs more logic
                        />;
            // Add other views...
            default:
                return <HomeView 
                posts={posts}
                stories={stories}
                currentUser={currentUser!}
                suggestedUsers={suggestedUsers}
                trendingTopics={trendingTopics}
                feedActivities={feedActivities}
                sponsoredContent={sponsoredContent}
                conversations={conversations}
                onToggleLike={handleToggleLike}
                onToggleSave={() => {}}
                onComment={() => {}}
                onShare={(post) => openModal('share', post)}
                onViewStory={(story) => openModal('story', story)}
                onViewLikes={(users) => openModal('viewLikes', users)}
                onViewProfile={(user) => handleNavigate('profile', user)}
                onViewPost={(post) => openModal('post', post)}
                onOptions={(post) => openModal('postOptions', post)}
                onShowSuggestions={() => openModal('suggestions', suggestedUsers)}
                onShowTrends={() => openModal('trends', trendingTopics)}
                onCreateStory={() => openModal('createStory')}
                onShowSearch={() => setSearchVisible(true)}
                onNavigate={handleNavigate}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
            />;
        }
    };
    
    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
    }

    return (
        <div className="bg-black text-white min-h-screen font-sans flex">
            <LeftSidebar 
                currentUser={currentUser}
                currentView={currentView}
                onNavigate={handleNavigate}
                onShowSearch={() => setSearchVisible(true)}
                onShowNotifications={() => setNotificationsVisible(true)}
                onCreatePost={() => openModal('createPost')}
                onSwitchAccount={() => openModal('accountSwitcher')}
                onLogout={handleLogout}
            />
            <div className="flex-1 md:ml-[72px] lg:ml-64">
                <Header 
                    currentUser={currentUser}
                    onNavigate={handleNavigate}
                    onCreatePost={() => openModal('createPost')}
                    onShowNotifications={() => setNotificationsVisible(true)}
                    onSwitchAccount={() => openModal('accountSwitcher')}
                    onLogout={handleLogout}
                />
                <main className="md:pt-16">
                    {renderView()}
                </main>
            </div>
            <BottomNav 
                currentUser={currentUser}
                currentView={currentView}
                onNavigate={handleNavigate}
                onCreatePost={() => openModal('createPost')}
            />
            
            {/* Panels */}
            {isSearchVisible && <SearchView users={allUsers} onClose={() => setSearchVisible(false)} onViewProfile={(user) => { handleNavigate('profile', user); setSearchVisible(false); }} />}
            {isNotificationsVisible && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsVisible(false)} onViewProfile={(user) => { handleNavigate('profile', user); setNotificationsVisible(false); }} onMarkAsRead={() => {}}/>}

            {/* Modals */}
            {activeModal === 'post' && <PostModal post={modalData} currentUser={currentUser} onClose={closeModal} onToggleLike={handleToggleLike} onToggleSave={() => {}} onComment={() => {}} onShare={(post) => openModal('share', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onOptions={(post) => openModal('postOptions', post)} />}
            {activeModal === 'createPost' && <CreatePostModal onClose={closeModal} onCreatePost={() => {closeModal(); showToast("Post created successfully!")}} />}
            
            {/* Generic handler for simple modals */}
            {activeModal === 'unfollow' && <UnfollowModal user={modalData} onCancel={closeModal} onConfirm={() => confirmUnfollow(modalData)}/>}
            {activeModal === 'followList' && <FollowListModal title={modalData.title} users={modalData.users} currentUser={currentUser} onClose={closeModal} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModal === 'viewLikes' && <ViewLikesModal users={modalData} currentUser={currentUser} onClose={closeModal} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onFollow={handleFollow} onUnfollow={handleUnfollow}/>}
            
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
}

export default App;
