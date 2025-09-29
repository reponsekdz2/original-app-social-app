import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import { webRTCManager } from './services/WebRTCManager.ts';
import type { User, View, Post, Reel, Story, Conversation, Message, Notification, AuthCarouselImage, ToastMessage, Announcement, StoryItem } from './types.ts';

// Import Views
import AuthView from './components/AuthView.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
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
import Sidebar from './components/Sidebar.tsx';
import ReelViewerModal from './components/ReelViewerModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';


type ModalState = 
    | { type: 'post', data: Post }
    | { type: 'editPost', data: Post }
    | { type: 'createPost' }
    | { type: 'createReel' }
    | { type: 'createStory' }
    | { type: 'createHighlight' }
    | { type: 'createChoice' }
    | { type: 'story', data: { stories: Story[], initialIndex: number } }
    | { type: 'share', data: Post | Reel }
    | { type: 'postOptions', data: Post }
    | { type: 'followers', data: User }
    | { type: 'following', data: User }
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
    | { type: 'call', data: { user: User, status: 'calling' | 'connected', type: 'video' | 'audio' } }
    | { type: 'reelViewer', data: Reel }
    | { type: 'reelComments', data: Reel };


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
    const [archivedStories, setArchivedStories] = useState<StoryItem[]>([]);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const showToast = (message: string, type: ToastMessage['type']) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const fetchData = useCallback(async () => {
        try {
            const [storiesData, postsData, reelsData, convosData, usersData, notificationsData, announcementData, savedData, archivedData, archivedStoriesData] = await Promise.all([
                api.getStories(),
                api.getFeedPosts(),
                api.getReels(),
                api.getConversations(),
                api.getAllUsers(),
                api.getNotifications(),
                api.getActiveAnnouncement(),
                api.getSavedPosts(),
                api.getArchivedPosts(),
                api.getArchivedStories(),
            ]);
            setStories(storiesData);
            setFeedPosts(postsData);
            setReels(reelsData);
            setConversations(convosData);
            setAllUsers(usersData);
            setNotifications(notificationsData);
            setAnnouncement(announcementData);
            setSavedPosts(savedData);
            setArchivedPosts(archivedData);
            setArchivedStories(archivedStoriesData);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            showToast('Failed to load data from server.', 'error');
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
            webRTCManager.onRemoteStream = (stream) => setRemoteStream(stream);
            webRTCManager.onCallEnded = () => {
                if(activeModal?.type === 'call' || activeModal?.type === 'incomingCall') {
                    handleCloseModal();
                }
                webRTCManager.stopStream();
                setRemoteStream(null);
            };

            socketService.on('incoming-call', ({ from, offer, type }) => {
                const caller = allUsers.find(u => u.id === from);
                if(caller && activeModal?.type !== 'call') { // Don't show if already in a call
                    setActiveModal({ type: 'incomingCall', data: { caller, offer, type } });
                }
            });
            
            return () => {
                webRTCManager.onRemoteStream = null;
                webRTCManager.onCallEnded = null;
                socketService.off('incoming-call');
            }
        }
    }, [currentUser, allUsers, activeModal]);

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
        } else if (view === 'createHighlight') {
            handleOpenModal('createHighlight');
            return;
        }
        setCurrentView(view);
        handleCloseModal();
    };

    const handleOpenModal = (type: ModalState['type'], data?: any) => setActiveModal({ type, data } as ModalState);
    const handleCloseModal = () => setActiveModal(null);

    // --- Interaction Handlers for Central State Management ---
    const handleLikeUnlikePost = (postId: string) => {
        const post = feedPosts.find(p => p.id === postId) || savedPosts.find(p => p.id === postId) || archivedPosts.find(p => p.id === postId);
        if (!post || !currentUser) return;
        
        const isLiked = post.likedBy.some(u => u.id === currentUser.id);
        const optimisticPost = {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked ? post.likedBy.filter(u => u.id !== currentUser.id) : [...post.likedBy, currentUser]
        };

        const updateState = (setter: React.Dispatch<React.SetStateAction<Post[]>>) => {
            setter(prev => prev.map(p => p.id === postId ? optimisticPost : p));
        };
        
        updateState(setFeedPosts);
        updateState(setSavedPosts);
        updateState(setArchivedPosts);
        
        api.likePost(postId).catch(() => {
            showToast('Failed to update like.', 'error');
            // Revert state on error
            const revertState = (setter: React.Dispatch<React.SetStateAction<Post[]>>) => {
                 setter(prev => prev.map(p => p.id === postId ? post : p));
            };
            revertState(setFeedPosts);
            revertState(setSavedPosts);
            revertState(setArchivedPosts);
        });
    };

    const handleSavePost = (postId: string) => {
        api.savePost(postId);
        // Optimistic update
        setFeedPosts(prev => prev.map(p => p.id === postId ? {...p, isSaved: !p.isSaved} : p));
        // This will be properly updated on next fetch of saved posts
    };
    
    const handleFollowUser = (userId: string) => {
        api.followUser(userId);
        setCurrentUser(prev => prev ? {...prev, following_count: (prev.following_count || 0) + 1} : null);
    };
    
    const handleUnfollowUser = (userId: string) => {
        api.unfollowUser(userId);
        setCurrentUser(prev => prev ? {...prev, following_count: (prev.following_count || 0) - 1} : null);
    };

    // --- Content Creation Handlers ---
    const handleCreatePost = async (formData: FormData) => {
        try {
            const newPost = await api.createPost(formData);
            setFeedPosts(prev => [newPost, ...prev]);
            handleCloseModal();
            showToast('Post created!', 'success');
        } catch (e) { showToast('Failed to create post.', 'error'); }
    };
    const handleCreateReel = async (formData: FormData) => {
        try {
            const newReel = await api.createReel(formData);
            setReels(prev => [newReel, ...prev]);
            handleCloseModal();
            showToast('Reel shared!', 'success');
            handleNavigate('reels');
        } catch (e) { showToast('Failed to share reel.', 'error'); }
    };
    const handleCreateStory = async (formData: FormData) => {
        try {
            await api.createStory(formData);
            const newStories = await api.getStories();
            setStories(newStories);
            handleCloseModal();
            showToast('Story shared!', 'success');
        } catch (e) { showToast('Failed to share story.', 'error'); }
    };
    
    // --- Call Handlers ---
    const handleAcceptCall = () => {
        if(activeModal?.type === 'incomingCall') {
            const { caller, offer, type } = activeModal.data;
            webRTCManager.answerCall(offer, caller.id, type==='video');
            setActiveModal({ type: 'call', data: { user: caller, status: 'connected', type } });
        }
    };

    const handleDeclineCall = () => {
        if(activeModal?.type === 'incomingCall') {
            webRTCManager.rejectCall(activeModal.data.caller.id);
            handleCloseModal();
        }
    };

    const renderView = () => {
        if (!currentUser) return null;
        switch (currentView) {
            case 'home': return <HomeView stories={stories} initialPosts={feedPosts} currentUser={currentUser} onViewStory={(s, i) => handleOpenModal('story', { stories: s, initialIndex: i })} onViewPost={p => handleOpenModal('post', p)} onLikePost={handleLikeUnlikePost} onUnlikePost={handleLikeUnlikePost} onSavePost={handleSavePost} onCommentOnPost={p => handleOpenModal('post', p)} onSharePost={p => handleOpenModal('share', p)} onOptionsForPost={p => handleOpenModal('postOptions', p)} onViewProfile={u => handleNavigate('profile', u)} onViewLikes={u => handleOpenModal('viewLikes', u)} onVote={api.voteOnPoll} onViewTag={(tag) => handleNavigate('tag', tag)} />;
            case 'explore': return <ExploreView onViewPost={p => handleOpenModal('post', p)} />;
            case 'reels': return <ReelsView initialReels={reels} currentUser={currentUser} onLikeReel={api.likeReel} onCommentOnReel={(r) => handleOpenModal('reelComments', r)} onShareReel={p => handleOpenModal('share', p)} />;
            case 'messages': return <MessagesView currentUser={currentUser} conversations={conversations} allUsers={allUsers} onSelectConversation={() => {}} onNewConversation={(c) => setConversations(prev => [...prev, c])} />;
            case 'profile': return <ProfileView user={profileUser} isCurrentUser={profileUser?.id === currentUser?.id} currentUser={currentUser} onNavigate={(view, user) => handleNavigate(view, user)} onShowFollowers={u => handleOpenModal('followers', u)} onShowFollowing={u => handleOpenModal('following', u)} onViewPost={p => handleOpenModal('post', p)} onViewReel={r => handleOpenModal('reelViewer', r)} />;
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
            default: return <HomeView stories={stories} initialPosts={feedPosts} currentUser={currentUser} onViewStory={(s, i) => handleOpenModal('story', { stories: s, initialIndex: i })} onViewPost={p => handleOpenModal('post', p)} onLikePost={handleLikeUnlikePost} onUnlikePost={handleLikeUnlikePost} onSavePost={handleSavePost} onCommentOnPost={p => handleOpenModal('post', p)} onSharePost={p => handleOpenModal('share', p)} onOptionsForPost={p => handleOpenModal('postOptions', p)} onViewProfile={u => handleNavigate('profile', u)} onViewLikes={u => handleOpenModal('viewLikes', u)} onVote={api.voteOnPoll} onViewTag={(tag) => handleNavigate('tag', tag)} />;
        }
    };
    
    const renderModal = () => {
        if (!activeModal || !currentUser) return null;
        switch (activeModal.type) {
            case 'post': return <PostModal post={activeModal.data} currentUser={currentUser} onClose={handleCloseModal} onLike={handleLikeUnlikePost} onSave={handleSavePost} onComment={api.createComment} onShare={p => handleOpenModal('share', p)} onOptions={p => handleOpenModal('postOptions', p)} onViewProfile={u => handleNavigate('profile', u)} onViewLikes={u => handleOpenModal('viewLikes', u)} />;
            case 'story': return <StoryViewer stories={activeModal.data.stories} initialStoryIndex={activeModal.data.initialIndex} onClose={handleCloseModal} onNextUser={() => {}} onPrevUser={() => {}} />;
            case 'createChoice': return <CreateChoiceModal onClose={handleCloseModal} onChoice={(type) => { handleCloseModal(); if(type === 'live') { handleOpenModal('goLive'); } else { handleOpenModal(`create${type.charAt(0).toUpperCase() + type.slice(1)}` as any); } }} />;
            case 'createPost': return <CreatePostModal onClose={handleCloseModal} onCreatePost={handleCreatePost} allUsers={allUsers} currentUser={currentUser} />;
            case 'createReel': return <CreateReelModal onClose={handleCloseModal} onCreateReel={handleCreateReel} />;
            case 'createStory': return <CreateStoryModal onClose={handleCloseModal} onCreateStory={handleCreateStory} />;
            case 'createHighlight': return <CreateHighlightModal userStories={archivedStories} onClose={handleCloseModal} onCreate={async (title, ids) => { await api.createHighlight(title, ids); handleCloseModal(); showToast('Highlight created!', 'success'); }} />;
            case 'share': return <ShareModal content={activeModal.data} currentUser={currentUser} conversations={conversations} onClose={handleCloseModal} onShareSuccess={() => showToast('Shared successfully', 'success')} />;
            // FIX: The onFollow and onUnfollow handlers were incorrectly trying to access .id on a string argument. Changed to pass the handler functions directly.
            case 'postOptions': return <PostWithOptionsModal post={activeModal.data} currentUser={currentUser} onClose={handleCloseModal} onUnfollow={handleUnfollowUser} onFollow={handleFollowUser} onEdit={(p) => handleOpenModal('editPost', p)} onDelete={async (p) => { await api.deletePost(p.id); setFeedPosts(prev => prev.filter(post => post.id !== p.id)); handleCloseModal(); showToast('Post deleted', 'info'); }} onArchive={() => {}} onReport={c => handleOpenModal('report', c)} onShare={p => handleOpenModal('share', p)} onCopyLink={() => {}} onViewProfile={u => handleNavigate('profile', u)} onGoToPost={p => { handleCloseModal(); handleOpenModal('post', p); }} />;
            case 'editPost': return <EditPostModal post={activeModal.data} onClose={handleCloseModal} onSave={() => {}} />;
            // FIX: Pass function reference directly, as the handler now expects a userId.
            case 'followers': return <FollowListModal title="Followers" users={activeModal.data.followers || []} currentUser={currentUser} onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onFollow={handleFollowUser} onUnfollow={handleUnfollowUser} />;
            // FIX: Pass function reference directly, as the handler now expects a userId.
            case 'following': return <FollowListModal title="Following" users={activeModal.data.following || []} currentUser={currentUser} onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onFollow={handleFollowUser} onUnfollow={handleUnfollowUser} />;
            // FIX: Pass function reference directly, as the handler now expects a userId.
            case 'viewLikes': return <ViewLikesModal users={activeModal.data} currentUser={currentUser} onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onFollow={handleFollowUser} onUnfollow={handleUnfollowUser} />;
            case 'editProfile': return <EditProfileModal user={activeModal.data} onClose={handleCloseModal} onSave={async (data) => { await api.updateUserProfile(data); const user = await api.checkSession(); setCurrentUser(user.user); handleCloseModal(); showToast("Profile updated!", "success"); }} />;
            case 'accountSwitcher': return <AccountSwitcherModal accounts={allUsers} currentUser={currentUser} onClose={handleCloseModal} onSwitchAccount={() => {}} onAddAccount={() => {}} />;
            // FIX: Pass function reference directly, as the handler now expects a userId.
            case 'notifications': return <NotificationsPanel notifications={notifications} onClose={handleCloseModal} currentUser={currentUser} onFollow={handleFollowUser} onUnfollow={handleUnfollowUser} />;
            case 'search': return <SearchView onClose={handleCloseModal} onViewProfile={u => handleNavigate('profile', u)} onViewPost={p => handleOpenModal('post', p)} />;
            case 'report': return <ReportModal content={activeModal.data} onClose={handleCloseModal} onSubmitReport={async (reason, details) => { await api.submitReport(activeModal.data, reason, details); showToast('Report submitted', 'success'); }} />;
            // FIX: Pass function reference directly, as the handler now expects a userId.
            case 'welcomeOnboarding': return <WelcomeOnboardingModal currentUser={currentUser} suggestedUsers={activeModal.data} onClose={handleCloseModal} onFollow={handleFollowUser} onUnfollow={handleUnfollowUser} />;
            case 'newSupportRequest': return <NewSupportRequestModal onClose={handleCloseModal} onSubmit={(ticket) => showToast('Support ticket submitted!', 'success')} />;
            case 'goLive': return <GoLiveModal onClose={handleCloseModal} onStartStream={async (title) => { const stream = await api.startLiveStream(title); handleCloseModal(); handleOpenModal('liveStream', stream); }} />;
            case 'liveStream': return <LiveStreamView stream={activeModal.data} currentUser={currentUser} onClose={handleCloseModal} />;
            case 'incomingCall': return <IncomingCallModal caller={activeModal.data.caller} onAccept={handleAcceptCall} onDecline={handleDeclineCall} />;
            case 'call': return <CallModal user={activeModal.data.user} status={activeModal.data.status} type={activeModal.data.type} onHangUp={() => { if(activeModal.data.user) webRTCManager.hangUp(activeModal.data.user.id); handleCloseModal(); }} remoteStream={remoteStream} />;
            case 'reelViewer': return <ReelViewerModal reel={activeModal.data} currentUser={currentUser} onClose={handleCloseModal} onLikeReel={api.likeReel} onCommentOnReel={(r) => handleOpenModal('reelComments', r)} onShareReel={(r) => handleOpenModal('share', r)} />;
            case 'reelComments': return <ReelCommentsModal reel={activeModal.data} currentUser={currentUser} onClose={handleCloseModal} onComment={api.commentOnReel} />;
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
                         <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => handleOpenModal('accountSwitcher')} onCreatePost={() => handleOpenModal('createChoice')} onShowNotifications={() => handleOpenModal('notifications')} onLogout={handleLogout} />
                        <main className="lg:flex">
                           <div className="w-full lg:w-[630px] xl:w-[700px] mx-auto">
                             {renderView()}
                           </div>
                           <div className="flex-1 hidden lg:block">
                             {/* FIX: Pass function reference directly, as the handler now expects a userId. */}
                             <Sidebar currentUser={currentUser} onViewProfile={(u) => handleNavigate('profile', u)} onFollow={handleFollowUser} onUnfollow={handleUnfollowUser} onSwitchAccount={() => handleOpenModal('accountSwitcher')}/>
                           </div>
                        </main>
                        <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreate={() => handleOpenModal('createChoice')} currentUser={currentUser} />
                    </div>
                </div>
            )}
            {renderModal()}
            <div className="fixed bottom-5 right-5 z-[100] space-y-2">
                 {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
                ))}
            </div>
        </div>
    );
};

export default App;
