import React, { useState, useEffect, useCallback } from 'react';
import type { View, User, Post, Story, Reel, Notification, Conversation, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, StoryItem, PostMedia, Comment } from './types.ts';
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
// ... other modal imports
import Toast from './components/Toast.tsx';

const App: React.FC = () => {
    // Global State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    // Fix: Add state for data required by HomeView and Sidebar
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    // ... other state
    
    // UI State
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [activeModals, setActiveModals] = useState<Record<string, any>>({});

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    }, []);

    // Check for existing token on app load
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const user = await api.getCurrentUser();
                    setCurrentUser(user);
                } catch (error) {
                    console.error("Session expired or invalid", error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        checkLoggedIn();
    }, []);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        try {
            // Fix: Fetch all data required for the main view in parallel
            const [
                feedData,
                trendingData,
                suggestionsData,
                activityData,
                sponsoredData,
                conversationsData
            ] = await Promise.all([
                api.getFeed(),
                api.getTrending(),
                api.getSuggestions(),
                api.getFeedActivity(),
                api.getSponsoredContent(),
                api.getConversations(),
            ]);
            setPosts(feedData.posts);
            setStories(feedData.stories);
            setTrendingTopics(trendingData);
            setSuggestedUsers(suggestionsData);
            setFeedActivities(activityData);
            setSponsoredContent(sponsoredData);
            setConversations(conversationsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            showToast("Failed to load data.");
        }
    }, [currentUser, showToast]);
    
    useEffect(() => {
        if(currentUser) {
            fetchData();
            socketService.connect(currentUser.id);

            socketService.on('post_updated', (updatedPost: Post) => {
                setPosts(current => current.map(p => p.id === updatedPost.id ? updatedPost : p));
            });
            // ... other socket listeners

            return () => socketService.disconnect();
        }
    }, [currentUser, fetchData]);

    const handleLoginSuccess = async (data: { user: User, token: string }) => {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        setCurrentView('home');
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setCurrentView('home');
    };
    
    // Navigation & Modal Management (remains mostly the same)
    const handleNavigate = (view: View, user?: User) => { /* ... */ };
    const openModal = (modalName: string, data: any = true) => setActiveModals(prev => ({...prev, [modalName]: data}));
    const closeModal = (modalName: string) => setActiveModals(prev => ({...prev, [modalName]: null}));

    // --- REAL API-driven Actions ---
    const handleToggleLike = async (postId: string) => {
        try {
            await api.togglePostLike(postId);
        } catch (error) {
            console.error("Failed to toggle like", error);
            showToast("Action failed.");
        }
    };
    
    const handleComment = async (postId: string, text: string) => {
        try {
            await api.addComment(postId, text);
        } catch (error) {
            console.error("Failed to add comment", error);
            showToast("Could not post comment.");
        }
    };

    const handleCreatePost = async (formData: FormData) => {
        try {
            await api.createPost(formData);
            closeModal('createPost');
            showToast('Post created!');
            fetchData(); // Refresh feed
        } catch (error) {
            console.error("Failed to create post", error);
            showToast("Could not create post.");
        }
    };
    
    const handleUpdateProfile = async (formData: FormData) => {
        if (!currentUser) return;
        try {
            const updatedUser = await api.updateUser(formData);
            setCurrentUser(u => u ? { ...u, ...updatedUser } : null);
            setProfileUser(p => p ? { ...p, ...updatedUser } : null);
            closeModal('editProfile');
            showToast("Profile updated!");
        } catch (error) {
            console.error("Failed to update profile", error);
            showToast("Could not update profile.");
        }
    };

    // ... implement all other action handlers similarly ...
    const handleCreateStory = async (formData: FormData) => { /* ... */ };
    const handleDeletePost = async (post: Post) => { /* ... */ };
    const handleFollow = async (user: User) => { /* ... */ };
    const handleLikeReel = async (reelId: string) => { /* ... */ };

    // Fix: Add dummy handlers for props required by HomeView
    const handleUnfollow = async (user: User) => { console.log('unfollow', user); /* API call */ };
    const handleToggleSave = (postId: string) => console.log('toggle save', postId);
    const handleShare = (post: Post) => openModal('share', post);
    const handleViewStory = (story: Story) => openModal('story', story);
    const handleViewLikes = (users: User[]) => openModal('likes', users);
    const handleViewProfile = (user: User) => handleNavigate('profile', user);
    const handleViewPost = (post: Post) => openModal('post', post);
    const onOptions = (post: Post) => openModal('options', post);
    const onShowSuggestions = () => openModal('suggestions');
    const onShowTrends = () => openModal('trends');


    if (isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }
    
    const renderView = () => {
        if (!currentUser) return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => {}} />;
        
        switch(currentView) {
            // Fix: Pass all required props to HomeView
            case 'home': return <HomeView 
                posts={posts} 
                stories={stories} 
                currentUser={currentUser} 
                suggestedUsers={suggestedUsers}
                trendingTopics={trendingTopics}
                feedActivities={feedActivities}
                sponsoredContent={sponsoredContent}
                conversations={conversations}
                onToggleLike={handleToggleLike} 
                onToggleSave={handleToggleSave}
                onComment={handleComment} 
                onShare={handleShare}
                onViewStory={handleViewStory}
                onViewLikes={handleViewLikes}
                onViewProfile={handleViewProfile}
                onViewPost={handleViewPost}
                onOptions={onOptions}
                onShowSuggestions={onShowSuggestions}
                onShowTrends={onShowTrends}
                onCreateStory={() => openModal('createStory')}
                onShowSearch={() => openModal('search')}
                onNavigate={handleNavigate}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                />;
            // ... other cases
            default: return <div>Not implemented</div>;
        }
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans">
            {currentUser && (
                <div className="md:pl-[72px] lg:pl-64">
                    <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => openModal('search')} onShowNotifications={() => openModal('notifications')} onCreatePost={() => openModal('createPost')} onSwitchAccount={() => {}} onLogout={handleLogout} />
                    <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => {}} onCreatePost={() => openModal('createPost')} onShowNotifications={() => openModal('notifications')} onLogout={handleLogout} />
                    <main className="container mx-auto">
                        {renderView()}
                    </main>
                    <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} />
                </div>
            )}
            {!currentUser && renderView()}

            {/* Modals */}
            {activeModals.createPost && <CreatePostModal onClose={() => closeModal('createPost')} onCreatePost={handleCreatePost} />}
            {/* ... other modals will use the real handlers ... */}
            
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};

export default App;
