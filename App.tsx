import React, { useState, useEffect, useCallback } from 'react';
import type { View, User, Post, Story, Reel, Notification, Conversation, Message, LiveStream } from './types.ts';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

import AuthView from './components/AuthView.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import ActivityView from './components/ActivityView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import AdminView from './components/AdminView.tsx';
import PremiumView from './components/PremiumView.tsx';
import LiveStreamsView from './components/LiveStreamsView.tsx';
import LiveStreamView from './components/LiveStreamView.tsx';

import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import CreateReelModal from './components/CreateReelModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import CreateChoiceModal from './components/CreateChoiceModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SearchView from './components/SearchView.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    
    // Data states
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

    // Modal/Panel states
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalContent, setModalContent] = useState<any>(null);
    const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [activeLiveStream, setActiveLiveStream] = useState<LiveStream | null>(null);


    const fetchData = useCallback(async () => {
        try {
            const [postsData, storiesData, reelsData, usersData, liveStreamsData] = await Promise.all([
                api.getPosts(),
                api.getStories(),
                api.getReels(),
                api.getAllUsers(),
                api.getLiveStreams(),
            ]);
            setPosts(postsData);
            setStories(storiesData);
            setReels(reelsData);
            setAllUsers(usersData);
            setLiveStreams(liveStreamsData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { user } = await api.getSession();
                setCurrentUser(user);
                await fetchData();
                socketService.connect('/');
            } catch (error) {
                console.log("No active session");
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
        
        return () => {
            socketService.disconnect();
        }
    }, [fetchData]);

    const handleLoginSuccess = async (data: { user: User }) => {
        setCurrentUser(data.user);
        await fetchData();
        socketService.connect('/');
    };
    
    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        socketService.disconnect();
    };

    const handleNavigate = (view: View, user: User | null = null) => {
        setCurrentView(view);
        setViewingUser(user);
        window.scrollTo(0, 0);
    };

    // Placeholder handlers - these would have full logic in a real app
    const handleToggleLike = (postId: string) => console.log('Toggle Like:', postId);
    const handleToggleSave = (postId: string) => console.log('Toggle Save:', postId);
    const handleComment = (postId: string, text: string) => console.log('Comment:', postId, text);
    const handleFollow = (user: User) => console.log('Follow:', user.username);
    const handleUnfollow = (user: User) => console.log('Unfollow:', user.username);
    const handleCreatePost = (formData: FormData) => { console.log('Creating Post', formData); setActiveModal(null); };

    const renderView = () => {
        const profileUser = viewingUser || currentUser;
        switch (currentView) {
            case 'home':
                return <HomeView posts={posts} stories={stories} currentUser={currentUser!} onViewStory={(story, index) => { setModalContent({ stories, index }); setActiveModal('storyViewer'); }} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => { setModalContent(post); setActiveModal('share'); }} onViewLikes={(users) => { setModalContent(users); setActiveModal('viewLikes'); }} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} onOptions={(post) => { setModalContent(post); setActiveModal('postOptions'); }} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => { setModalContent(post); setActiveModal('tip'); }} onVote={(optionId) => console.log('voted', optionId)} />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} />;
            case 'reels':
                return <ReelsView reels={reels} currentUser={currentUser!} onLikeReel={(id) => console.log(id)} onCommentOnReel={(reel) => console.log(reel)} onShareReel={(reel) => console.log(reel)} />;
            case 'messages':
                return <MessagesView currentUser={currentUser!} onNavigate={(view, user) => handleNavigate(view, user)} onInitiateCall={() => {}} onViewMedia={() => {}} />;
            case 'profile':
                 return profileUser ? <ProfileView user={profileUser} posts={posts.filter(p => p.user.id === profileUser.id)} reels={reels.filter(r => r.user.id === profileUser.id)} isCurrentUser={currentUser!.id === profileUser.id} currentUser={currentUser!} onEditProfile={() => setActiveModal('editProfile')} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={handleUnfollow} onShowFollowers={(users) => { setModalContent({title: 'Followers', users}); setActiveModal('followList')}} onShowFollowing={(users) => { setModalContent({title: 'Following', users}); setActiveModal('followList')}} onEditPost={(post) => { setModalContent(post); setActiveModal('editPost'); }} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} onViewReel={(reel) => { setModalContent(reel); setActiveModal('reelViewer'); }} onOpenCreateHighlightModal={() => setActiveModal('createHighlight')} onMessage={(user) => handleNavigate('messages', user)} /> : null;
            case 'settings':
                return <SettingsView onBack={() => handleNavigate('profile')} onNavigate={(setting) => console.log(setting)} />;
            case 'saved':
                return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} />;
            case 'activity':
                 return <ActivityView activities={notifications} />;
             case 'archive':
                return <ArchiveView posts={[]} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} onUnarchivePost={(post) => console.log(post)} />;
            case 'admin':
                return <AdminView onExit={() => handleNavigate('home')} />;
            case 'premium':
                return <PremiumView />;
            case 'live':
                return <LiveStreamsView streams={liveStreams} onJoinStream={(stream) => setActiveLiveStream(stream)} />;
            default:
                return <HomeView posts={posts} stories={stories} currentUser={currentUser!} onViewStory={() => {}} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={() => {}} onViewLikes={() => {}} onViewProfile={() => {}} onViewPost={() => {}} onOptions={() => {}} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={() => {}} onVote={() => {}} />;
        }
    };

    if (isLoading) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} />;
    }

    if(activeLiveStream){
        return <LiveStreamView stream={activeLiveStream} currentUser={currentUser} onClose={() => setActiveLiveStream(null)} />
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="flex">
                <LeftSidebar 
                    currentView={currentView}
                    onNavigate={(view) => handleNavigate(view)}
                    onCreate={() => setActiveModal('createChoice')}
                    onShowNotifications={() => setNotificationsPanelOpen(p => !p)}
                    onShowSearch={() => setSearchOpen(true)}
                    onLogout={handleLogout}
                />
                <main className="flex-1">
                    <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setActiveModal('accountSwitcher')} onCreatePost={() => setActiveModal('createPost')} onShowNotifications={() => setNotificationsPanelOpen(p => !p)} onLogout={handleLogout} />
                    {renderView()}
                </main>
            </div>
            <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreate={() => setActiveModal('createChoice')} currentUser={currentUser} />
            
            {/* Modals & Panels */}
            {isNotificationsPanelOpen && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsPanelOpen(false)} currentUser={currentUser} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {isSearchOpen && <SearchView onClose={() => setSearchOpen(false)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} />}
            
            {activeModal === 'post' && modalContent && <PostModal post={modalContent} currentUser={currentUser} onClose={() => setActiveModal(null)} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={() => {}} onViewLikes={() => {}} onViewProfile={(user) => handleNavigate('profile', user)} onOptions={() => {}} />}
            {activeModal === 'storyViewer' && modalContent && <StoryViewer stories={modalContent.stories} initialStoryIndex={modalContent.index} onClose={() => setActiveModal(null)} onNextUser={() => {}} onPrevUser={() => {}} />}
            {activeModal === 'createChoice' && <CreateChoiceModal onClose={() => setActiveModal(null)} onChoice={(type) => { setActiveModal(type === 'post' ? 'createPost' : type === 'reel' ? 'createReel' : 'createStory'); }} />}
            {activeModal === 'createPost' && <CreatePostModal onClose={() => setActiveModal(null)} onCreatePost={handleCreatePost} allUsers={allUsers} currentUser={currentUser} />}
            {activeModal === 'createReel' && <CreateReelModal onClose={() => setActiveModal(null)} onCreateReel={(data) => { console.log(data); setActiveModal(null); }} />}
            {activeModal === 'createStory' && <CreateStoryModal onClose={() => setActiveModal(null)} onCreateStory={(data) => { console.log(data); setActiveModal(null); }} />}
            {activeModal === 'accountSwitcher' && <AccountSwitcherModal accounts={[currentUser]} currentUser={currentUser} onClose={() => setActiveModal(null)} onSwitchAccount={() => {}} onAddAccount={() => {}} />}
        </div>
    );
};

export default App;
