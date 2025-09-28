import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import { webRTCManager } from './services/WebRTCManager.ts';
import type { User, View, Post, Reel, Story, Conversation, Message, Notification, AuthCarouselImage, ToastMessage } from './types.ts';

// Import Views
import AuthView from './components/AuthView.tsx';
// FIX: Resolve 'is not a module' error by ensuring HomeView is a module.
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
// FIX: Resolve 'is not a module' error by ensuring ReelsView is a module.
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './components/MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import AdminView from './components/AdminView.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import BlockedUsersView from './components/BlockedUsersView.tsx';
import LoginActivityView from './components/LoginActivityView.tsx';
import AccountStatusView from './components/AccountStatusView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
// FIX: Resolve 'is not a module' error by ensuring TagView is a module.
import TagView from './components/TagView.tsx';
import LiveStreamsView from './components/LiveStreamsView.tsx';

// Import Components
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import CreateReelModal from './components/CreateReelModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SearchView from './components/SearchView.tsx';
import ReportModal from './components/ReportModal.tsx';
import Toast from './components/Toast.tsx';
import WelcomeOnboardingModal from './components/WelcomeOnboardingModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import AnnouncementBanner from './components/AnnouncementBanner.tsx';
import LiveStreamView from './components/LiveStreamView.tsx';
import GoLiveModal from './components/GoLiveModal.tsx';
import IncomingCallModal from './components/IncomingCallModal.tsx';
import CallModal from './components/CallModal.tsx';
import CreateChoiceModal from './components/CreateChoiceModal.tsx';
// FIX: Import Sidebar component
import Sidebar from './components/Sidebar.tsx';

type ModalState = 
    | { type: 'post', data: Post }
    | { type: 'createPost' }
    | { type: 'createReel' }
    | { type: 'createStory' }
    | { type: 'createChoice' }
    | { type: 'story', data: { stories: Story[], initialIndex: number } }
    | { type: 'share', data: Post | Reel }
    | { type: 'postOptions', data: Post }
    | { type: 'followers', data: User[] }
    | { type: 'following', data: User[] }
    | { type: 'viewLikes', data: User[] }
    | { type: 'editProfile', data: User }
    | { type: 'accountSwitcher', data: User[] }
    | { type: 'notifications' }
    | { type: 'search' }
    | { type: 'report', data: Post | User }
    | { type: 'welcomeOnboarding', data: User[] }
    | { type: 'newSupportRequest' }
    | { type: 'goLive' }
    | { type: 'liveStream', data: any }
    | { type: 'incomingCall', data: { caller: User, offer: any, type: 'video' | 'audio' } }
    | { type: 'call', data: { user: User, status: 'calling' | 'connected', type: 'video' | 'audio' } };


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [activeModal, setActiveModal] = useState<ModalState | null>(null);
    
    // Data states
    const [stories, setStories] = useState<Story[]>([]);
    const [feedPosts, setFeedPosts] = useState<Post[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [announcement, setAnnouncement] = useState<any>(null);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const showToast = (message: string, type: ToastMessage['type']) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const fetchData = useCallback(async () => {
        try {
            const [storiesData, postsData, reelsData, convosData, usersData, notificationsData, announcementData] = await Promise.all([
                api.getStories(),
                api.getFeedPosts(),
                api.getReels(),
                api.getConversations(),
                api.getAllUsers(),
                api.getNotifications(),
// FIX: Corrected function name from getActiveAnnouncement to getActiveAnnouncement
                api.getActiveAnnouncement()
            ]);
            setStories(storiesData);
            setFeedPosts(postsData);
            setReels(reelsData);
            setConversations(convosData);
            setAllUsers(usersData);
            setNotifications(notificationsData);
            setAnnouncement(announcementData);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            // Handle error, maybe show a toast
        }
    }, []);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const data = await api.checkSession();
                if (data.user) {
                    setCurrentUser(data.user);
                    socketService.connect('/');
                    await fetchData();
                }
            } catch (error) {
                console.log("No active session");
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, [fetchData]);

    useEffect(() => {
        if (currentUser && socketService.socket) {
            socketService.emit('user_connect', { userId: currentUser.id });
            socketService.on('new_notification', (notif: Notification) => {
                setNotifications(prev => [notif, ...prev]);
                showToast(`New notification from ${notif.actor.username}`, 'info');
            });
            socketService.on('receive_message', (message: Message) => {
                showToast(`New message from ${message.sender?.username}`, 'info');
                // Update conversation list logic here
            });
            socketService.on('incoming-call', ({ from, offer, type }) => {
                const caller = allUsers.find(u => u.id === from);
                if(caller) {
                    setActiveModal({ type: 'incomingCall', data: { caller, offer, type } });
                }
            });
        }
        return () => {
            socketService.off('new_notification');
            socketService.off('receive_message');
            socketService.off('incoming-call');
        };
    }, [currentUser, allUsers]);

    const handleLoginSuccess = async (data: { user: User, isNewUser?: boolean }) => {
        setCurrentUser(data.user);
        setIsLoading(true);
        socketService.connect('/');
        await fetchData();
        setIsLoading(false);
        setCurrentView('home');
        if (data.isNewUser) {
            const suggested = await api.getSuggestedUsers();
            setActiveModal({ type: 'welcomeOnboarding', data: suggested });
        }
    };

    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        socketService.disconnect();
    };

    const handleNavigate = (view: View, data?: any) => {
        if (view === 'profile' && data) {
            setProfileUser(data as User);
        } else if (view === 'profile' && !data) {
            setProfileUser(currentUser);
        } else if (view === 'tag' && data) {
            setActiveTag(data as string);
        }
        setCurrentView(view);
        setActiveModal(null);
    };

    const handleOpenModal = (type: ModalState['type'], data?: any) => setActiveModal({ type, data } as ModalState);
    const handleCloseModal = () => setActiveModal(null);

    const renderView = () => {
        switch (currentView) {
// FIX: Added api.voteOnPoll to resolve missing property error.
            case 'home': return <HomeView stories={stories} posts={feedPosts} currentUser={currentUser!} onViewStory={(s, i) => handleOpenModal('story', { stories: s, initialIndex: i })} onViewPost={p => handleOpenModal('post', p)} onLikePost={api.likePost} onUnlikePost={api.likePost} onSavePost={api.savePost} onCommentOnPost={p => handleOpenModal('post', p)} onSharePost={p => handleOpenModal('share', p)} onOptionsForPost={p => handleOpenModal('postOptions', p)} onViewProfile={u => handleNavigate('profile', u)} onViewLikes={u => handleOpenModal('viewLikes', u)} onVote={api.voteOnPoll} onViewTag={(tag) => handleNavigate('tag', tag)} />;
            case 'explore': return <ExploreView posts={[]} onViewPost={p => handleOpenModal('post', p)} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser!} onLikeReel={api.likeReel} onCommentOnReel={() => {}} onShareReel={p => handleOpenModal('share', p)} />;
            case 'messages': return <MessagesView currentUser={currentUser!} conversations={conversations} allUsers={allUsers} onSelectConversation={() => {}} onNewConversation={(c) => setConversations(prev => [...prev, c])} />;
            case 'profile': return <ProfileView user={profileUser} isCurrentUser={profileUser?.id === currentUser?.id} currentUser={currentUser!} onNavigate={handleNavigate} onShowFollowers={u => handleOpenModal('followers', u)} onShowFollowing={u => handleOpenModal('following', u)} />;
            case 'settings': return <SettingsView onLogout={handleLogout} onNavigate={handleNavigate} />;
            case 'saved': return <SavedView posts={savedPosts} onViewPost={p => handleOpenModal('post', p)} />;
            case 'archive': return <ArchiveView posts={archivedPosts} onViewPost={p => handleOpenModal('post', p)} onUnarchivePost={() => {}} />;
            case 'admin': return <AdminView onExit={() => setCurrentView('home')} />;
            case 'changePassword': return <ChangePasswordModal onClose={() => setCurrentView('settings')} onSubmit={api.changePassword} />;
            case 'blockedUsers': return <BlockedUsersView onBack={() => setCurrentView('settings')} />;
            case 'loginActivity': return <LoginActivityView onBack={() => setCurrentView('settings')} />;
            case 'accountStatus': return <AccountStatusView onBack={() => setCurrentView('settings')} />;
            case 'help': return <HelpCenterView onBack={() => setCurrentView('settings')} onNavigate={handleNavigate} />;
            case 'support_inbox': return <SupportInboxView onBack={() => setCurrentView('help')} onNewRequest={() => handleOpenModal('newSupportRequest')} />;
            case 'tag': return <TagView tag={activeTag!} onViewPost={p => handleOpenModal('post', p)} />;
            case 'livestreams': return <LiveStreamsView onViewStream={(s) => handleOpenModal('liveStream', s)} />;
// FIX: Added api.voteOnPoll to resolve missing property error.
            default: return <HomeView stories={stories} posts={feedPosts} currentUser={currentUser!} onViewStory={(s, i) => handleOpenModal('story', { stories: s, initialIndex: i })} onViewPost={p => handleOpenModal('post', p)} onLikePost={api.likePost} onUnlikePost={api.likePost} onSavePost={api.savePost} onCommentOnPost={p => handleOpenModal('post', p)} onSharePost={p => handleOpenModal('share', p)} onOptionsForPost={p => handleOpenModal('postOptions', p)} onViewProfile={u => handleNavigate('profile', u)} onViewLikes={u => handleOpenModal('viewLikes', u)} onVote={api.voteOnPoll} onViewTag={(tag) => handleNavigate('tag', tag)} />;
        }
    };
    
    const renderModal = () => {
        if (!activeModal) return null;
        switch (activeModal.type) {
            case 'post': return <PostModal post={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} onLike={api.likePost} onSave={api.savePost} onComment={() => {}} onShare={p => handleOpenModal('share', p)} onOptions={p => handleOpenModal('postOptions', p)} onViewProfile={u => handleNavigate('profile', u)} onViewLikes={u => handleOpenModal('viewLikes', u)} />;
            case 'story': return <StoryViewer stories={activeModal.data.stories} initialStoryIndex={activeModal.data.initialIndex} onClose={handleCloseModal} onNextUser={() => {}} onPrevUser={() => {}} />;
            case 'createChoice': return <CreateChoiceModal onClose={handleCloseModal} onChoice={(type) => { handleCloseModal(); handleOpenModal(`create${type.charAt(0).toUpperCase() + type.slice(1)}` as any); }} />;
            case 'createPost': return <CreatePostModal onClose={handleCloseModal} onCreatePost={() => {}} allUsers={allUsers} currentUser={currentUser!} />;
            case 'createReel': return <CreateReelModal onClose={handleCloseModal} onCreateReel={() => {}} />;
            case 'createStory': return <CreateStoryModal onClose={handleCloseModal} onCreateStory={() => {}} />;
            case 'share': return <ShareModal content={activeModal.data} currentUser={currentUser!} conversations={conversations} onClose={handleCloseModal} onShareSuccess={() => {}} />;
            case 'postOptions': return <PostWithOptionsModal post={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} onUnfollow={() => {}} onFollow={() => {}} onEdit={() => {}} onDelete={() => {}} onArchive={() => {}} onReport={c => handleOpenModal('report', c)} onShare={p => handleOpenModal('share', p)} onCopyLink={() => {}} onViewProfile={u => handleNavigate('profile', u)} onGoToPost={p => { handleCloseModal(); handleOpenModal('post', p); }} />;
            case 'followers': return <FollowListModal title="Followers" users={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onFollow={() => {}} onUnfollow={() => {}} />;
            case 'following': return <FollowListModal title="Following" users={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onFollow={() => {}} onUnfollow={() => {}} />;
            case 'viewLikes': return <ViewLikesModal users={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onFollow={() => {}} onUnfollow={() => {}} />;
            case 'editProfile': return <EditProfileModal user={activeModal.data} onClose={handleCloseModal} onSave={() => {}} />;
            case 'accountSwitcher': return <AccountSwitcherModal accounts={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} onSwitchAccount={() => {}} onAddAccount={() => {}} />;
            case 'notifications': return <NotificationsPanel notifications={notifications} onClose={handleCloseModal} currentUser={currentUser!} onFollow={() => {}} onUnfollow={() => {}} />;
            case 'search': return <SearchView onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onViewPost={p => handleOpenModal('post', p)} />;
            case 'report': return <ReportModal content={activeModal.data} onClose={handleCloseModal} onSubmitReport={() => {}} />;
            case 'welcomeOnboarding': return <WelcomeOnboardingModal currentUser={currentUser!} suggestedUsers={activeModal.data} onClose={handleCloseModal} onFollow={() => {}} onUnfollow={() => {}} />;
            case 'newSupportRequest': return <NewSupportRequestModal onClose={handleCloseModal} onSubmit={() => {}} />;
            case 'goLive': return <GoLiveModal onClose={handleCloseModal} onStartStream={async (title) => { const { streamId } = await api.startLiveStream(title); handleCloseModal(); handleNavigate('livestreams'); }} />;
            case 'liveStream': return <LiveStreamView stream={activeModal.data} currentUser={currentUser!} onClose={handleCloseModal} />;
            case 'incomingCall': return <IncomingCallModal caller={activeModal.data.caller} onAccept={() => {}} onDecline={() => {}} />;
            case 'call': return <CallModal user={activeModal.data.user} status={activeModal.data.status} type={activeModal.data.type} onHangUp={() => {}} remoteStream={null} />;
            default: return null;
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-black"><div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div></div>;
    }

    return (
        <div className="bg-black text-white min-h-screen">
            {!currentUser ? (
                <AuthView onLoginSuccess={handleLoginSuccess} />
            ) : (
                <div className="flex">
                    <LeftSidebar currentView={currentView} onNavigate={handleNavigate} onCreate={() => handleOpenModal('createChoice')} onShowNotifications={() => handleOpenModal('notifications')} onShowSearch={() => handleOpenModal('search')} onLogout={handleLogout} />
                    <div className="flex-1 md:ml-20 xl:ml-64">
                         {announcement && <AnnouncementBanner announcement={announcement} onClose={() => setAnnouncement(null)} />}
                         <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => {}} onCreatePost={() => handleOpenModal('createChoice')} onShowNotifications={() => handleOpenModal('notifications')} onLogout={handleLogout} />
                        <main className="lg:flex">
                           <div className="w-full lg:w-[630px] xl:w-[700px] mx-auto">
                             {renderView()}
                           </div>
                           <div className="flex-1 hidden lg:block">
                             <Sidebar currentUser={currentUser} onViewProfile={(u) => handleNavigate('profile', u)} onFollow={() => {}} onUnfollow={() => {}} onSwitchAccount={() => {}}/>
                           </div>
                        </main>
                        <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreate={() => handleOpenModal('createChoice')} currentUser={currentUser} />
                    </div>
                </div>
            )}
            {renderModal()}
            <div className="fixed bottom-5 right-5 z-50 space-y-2">
                 {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
                ))}
            </div>
        </div>
    );
};

export default App;