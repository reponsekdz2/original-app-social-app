
import React, { useState, useEffect, useCallback } from 'react';
import type { User, Post, Story, View, Conversation, Reel, Notification } from './types.ts';
import * as api from './services/apiService.ts';
import { mockUser, mockPosts, mockStories, mockSuggested, mockTrending, mockActivities, mockSponsored, mockConversations, mockReels, mockAllUsers } from './services/mockData.ts';

import AuthView from './components/AuthView.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './components/MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import Sidebar from './components/Sidebar.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import BottomNav from './components/BottomNav.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import AdminView from './components/AdminView.tsx';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [isLoading, setIsLoading] = useState(true);
    
    // Data state
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    
    // Modal/Panel state
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [viewingStory, setViewingStory] = useState<{ story: Story, index: number } | null>(null);
    const [viewingPost, setViewingPost] = useState<Post | null>(null);
    const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
    const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);

    useEffect(() => {
        // Mock session check
        const sessionUser = localStorage.getItem('currentUser');
        if (sessionUser) {
            setCurrentUser(JSON.parse(sessionUser));
        } else {
            // For development, auto-login mock user
            setCurrentUser(mockUser);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (currentUser) {
            // Fetch data when user logs in
            setPosts(mockPosts);
            setStories(mockStories);
            setReels(mockReels);
            setConversations(mockConversations);
        }
    }, [currentUser]);

    const handleLoginSuccess = (data: { user: User }) => {
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const handleNavigate = (view: View) => {
        setCurrentView(view);
        setNotificationsPanelOpen(false);
    };

    const renderView = () => {
        if (!currentUser) return null;
        switch (currentView) {
            case 'home':
                return <HomeView posts={posts} stories={stories} currentUser={currentUser} onViewStory={(story, index) => setViewingStory({ story, index })} onToggleLike={() => {}} onToggleSave={() => {}} onComment={() => {}} onShare={() => {}} onViewLikes={() => {}} onViewProfile={() => {}} onViewPost={setViewingPost} onOptions={() => {}} onFollow={() => {}} onUnfollow={() => {}} onTip={() => {}} onVote={() => {}} />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={setViewingPost} />;
            case 'reels':
                return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={() => {}} onCommentOnReel={() => {}} onShareReel={() => {}} />;
            case 'messages':
                return <MessagesView conversations={conversations} currentUser={currentUser} allUsers={mockAllUsers} onNavigate={() => {}} onInitiateCall={() => {}} onUpdateConversation={() => {}} onUpdateUserRelationship={() => {}} onReport={() => {}} onViewMedia={() => {}} />;
            case 'profile':
                return <ProfileView user={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)} reels={reels.filter(r => r.user.id === currentUser.id)} isCurrentUser={true} currentUser={currentUser} onEditProfile={() => {}} onViewArchive={() => {}} onFollow={() => {}} onUnfollow={() => {}} onShowFollowers={() => {}} onShowFollowing={() => {}} onEditPost={() => {}} onViewPost={setViewingPost} onViewReel={() => {}} onOpenCreateHighlightModal={() => {}} onMessage={() => {}} />;
            case 'saved':
                return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={setViewingPost} />;
            case 'settings':
                return <SettingsView onBack={() => handleNavigate('profile')} onNavigate={(setting) => { if (setting === 'logout') handleLogout() }} />;
            case 'admin':
                return <AdminView onExit={() => handleNavigate('home')} />;
            default:
                return <div className="p-8">View "{currentView}" not implemented.</div>;
        }
    };
    
    if (isLoading) return <div className="bg-black min-h-screen"></div>;

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="bg-black text-white min-h-screen">
            {currentView !== 'admin' && <LeftSidebar currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => setCreateModalOpen(true)} onShowNotifications={() => setNotificationsPanelOpen(true)} />}
            
            <div className={`transition-transform duration-300 ${isNotificationsPanelOpen ? '-translate-x-[397px]' : 'translate-x-0'} md:ml-[72px] lg:ml-64`}>
                {currentView !== 'admin' && <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setAccountSwitcherOpen(true)} onCreatePost={() => setCreateModalOpen(true)} onShowNotifications={() => setNotificationsPanelOpen(p => !p)} onLogout={handleLogout} />}
                
                <main className="flex">
                    <div className="flex-1">
                        {renderView()}
                    </div>
                    {currentView === 'home' && <Sidebar trendingTopics={mockTrending} suggestedUsers={mockSuggested} feedActivities={mockActivities} sponsoredContent={mockSponsored} currentUser={currentUser} onFollow={() => {}} onUnfollow={() => {}} onViewProfile={() => {}} />}
                </main>

                {currentView !== 'admin' && <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreate={() => setCreateModalOpen(true)} currentUser={currentUser} />}
            </div>
            
            {/* Modals & Overlays */}
            {viewingStory && <StoryViewer stories={stories} initialStoryIndex={viewingStory.index} onClose={() => setViewingStory(null)} onNextUser={() => {}} onPrevUser={() => {}} />}
            {viewingPost && <PostModal post={viewingPost} currentUser={currentUser} onClose={() => setViewingPost(null)} onToggleLike={() => {}} onToggleSave={() => {}} onComment={() => {}} onShare={() => {}} onViewProfile={() => {}} onOptions={() => {}} />}
            {isCreateModalOpen && <CreatePostModal onClose={() => setCreateModalOpen(false)} onCreatePost={() => {}} allUsers={mockAllUsers} currentUser={currentUser} />}
            {isAccountSwitcherOpen && <AccountSwitcherModal accounts={mockAllUsers} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchAccount={() => {}} onAddAccount={() => {}} />}
            {isNotificationsPanelOpen && <NotificationsPanel notifications={[]} onClose={() => setNotificationsPanelOpen(false)} onViewProfile={() => {}} onMarkAsRead={() => {}} onCollaborationResponse={() => {}} />}
        </div>
    );
};

export default App;
