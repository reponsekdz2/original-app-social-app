import React, { useState, useEffect, useCallback } from 'react';
import type { View, User, Post, Story, Reel, Notification, Conversation, Message, LiveStream } from './types.ts';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import { webRTCManager } from './services/WebRTCManager.ts';

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
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import TipModal from './components/TipModal.tsx';
import Toast from './components/Toast.tsx';
import IncomingCallModal from './components/IncomingCallModal.tsx';
import CallModal from './components/CallModal.tsx';
import MediaViewerModal from './components/MediaViewerModal.tsx';
import ReelViewerModal from './components/ReelViewerModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import GoLiveModal from './components/GoLiveModal.tsx';
import WelcomeOnboardingModal from './components/WelcomeOnboardingModal.tsx';


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
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

    // WebRTC Call State
    const [incomingCall, setIncomingCall] = useState<{ from: User, offer: any, type: 'video' | 'audio' } | null>(null);
    const [activeCall, setActiveCall] = useState<{ user: User, status: 'calling' | 'connected', type: 'video' | 'audio' } | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const fetchData = useCallback(async () => {
        if(!currentUser) return;
        try {
            const [postsData, storiesData, reelsData, usersData, liveStreamsData, notificationsData, conversationsData] = await Promise.all([
                api.getPosts(),
                api.getStories(),
                api.getReels(),
                api.getAllUsers(),
                api.getLiveStreams(),
                api.getNotifications(),
                api.getConversations(),
            ]);
            setPosts(postsData);
            setStories(storiesData);
            setReels(reelsData);
            setAllUsers(usersData);
            setNotifications(notificationsData);
            setConversations(conversationsData);
            setLiveStreams(liveStreamsData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            if (error.message.includes('Unauthorized')) handleLogout();
        }
    }, [currentUser]);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { user } = await api.getSession();
                setCurrentUser(user);
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
    }, []);

    useEffect(() => {
        if(currentUser){
            fetchData();
        }
    }, [currentUser, fetchData]);
    
    // Socket.IO event listeners
    useEffect(() => {
        webRTCManager.onRemoteStream = (stream) => setRemoteStream(stream);
        webRTCManager.onCallEnded = () => {
            setToast({ message: "Call ended.", type: 'info'});
            setActiveCall(null);
            setIncomingCall(null);
            setRemoteStream(null);
        };
        
        socketService.on('incoming-call', ({ from, offer }) => {
            const caller = allUsers.find(u => u.id === from);
            if (caller) {
                setIncomingCall({ from: caller, offer, type: 'video' }); // Assume video for now
            }
        });

         return () => {
            webRTCManager.onRemoteStream = null;
            webRTCManager.onCallEnded = null;
        }
    }, [allUsers]);

    const handleLoginSuccess = (data: { user: User, isNewUser?: boolean }) => {
        setCurrentUser(data.user);
        socketService.connect('/');
        if (data.isNewUser) {
            setActiveModal('welcomeOnboarding');
        }
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
    
    const showToast = (message: string, type: 'success'|'error'|'info') => setToast({message, type});

    // --- API Handlers ---
    const handleToggleLike = async (postId: string) => {
        const originalPosts = [...posts];
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likedBy.some(u=>u.id===currentUser!.id) ? p.likes -1 : p.likes + 1, likedBy: p.likedBy.some(u=>u.id===currentUser!.id) ? p.likedBy.filter(u=>u.id!==currentUser!.id) : [...p.likedBy, currentUser!] } : p));
        try { await api.togglePostLike(postId); } catch (e) { console.error(e); setPosts(originalPosts); }
    };

    const handleToggleSave = async (postId: string) => {
        const originalPosts = [...posts];
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
        try { await api.togglePostSave(postId); } catch (e) { console.error(e); setPosts(originalPosts); }
    };
    
    const handleComment = async (postId: string, text: string) => {
        try {
            const newComment = await api.addPostComment(postId, text);
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments]} : p));
        } catch(e) { console.error(e); }
    };

    const handleFollow = async (user: User) => {
        try { await api.followUser(user.id); setCurrentUser(prev => ({ ...prev!, following: [...(prev!.following || []), user]})); } catch (e) { console.error(e); }
    };

    const handleUnfollow = async (user: User) => {
        try { await api.unfollowUser(user.id); setCurrentUser(prev => ({...prev!, following: prev!.following?.filter(u => u.id !== user.id)})); } catch (e) { console.error(e); }
    };
    
    const handleCreatePost = async (formData: FormData) => {
        try {
            await api.createPost(formData);
            setActiveModal(null);
            fetchData();
            showToast("Post created successfully!", 'success');
        } catch(e) { console.error(e); showToast("Failed to create post.", 'error');}
    };

    const handleCreateReel = async (formData: FormData) => {
        try {
            await api.createReel(formData);
            setActiveModal(null);
            fetchData();
            showToast("Reel created successfully!", 'success');
        } catch(e) { console.error(e); showToast("Failed to create reel.", 'error');}
    };
    
     const handleCreateStory = async (formData: FormData) => {
        try {
            await api.createStory(formData);
            setActiveModal(null);
            fetchData();
            showToast("Story created successfully!", 'success');
        } catch(e) { console.error(e); showToast("Failed to create story.", 'error');}
    };

    const handleSendTip = async (amount: number) => {
        if(!modalContent?.id) return;
        try {
            await api.sendTip(modalContent.id, amount);
            showToast(`Successfully tipped $${amount}!`, 'success');
        } catch (e) {
            console.error(e);
            showToast("Tipping failed. Check your balance.", 'error');
        }
    };
    
    // --- WebRTC Call Handlers ---
    const handleInitiateCall = async (user: User, type: 'video' | 'audio') => {
        if (activeCall || incomingCall) {
            showToast("You are already in a call.", 'error');
            return;
        }
        setActiveCall({ user, status: 'calling', type });
        await webRTCManager.startCall(user.id, type === 'video');
    };

    const handleAcceptCall = async () => {
        if (!incomingCall) return;
        setActiveCall({ user: incomingCall.from, status: 'connected', type: incomingCall.type });
        await webRTCManager.answerCall(incomingCall.offer, incomingCall.from.id, incomingCall.type === 'video');
        setIncomingCall(null);
    };

    const handleDeclineCall = () => {
        if (incomingCall) {
            webRTCManager.hangUp(incomingCall.from.id);
        }
        setIncomingCall(null);
    };

    const handleHangUp = () => {
        webRTCManager.hangUp(activeCall?.user.id);
        setActiveCall(null);
        setRemoteStream(null);
    };


    const renderView = () => {
        const profileUser = viewingUser || currentUser;
        switch (currentView) {
            case 'home':
                return <HomeView posts={posts} stories={stories} currentUser={currentUser!} onViewStory={(story, index) => { setModalContent({ stories, index }); setActiveModal('storyViewer'); }} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => { setModalContent(post); setActiveModal('share'); }} onViewLikes={(users) => { setModalContent(users); setActiveModal('viewLikes'); }} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} onOptions={(post) => { setModalContent(post); setActiveModal('postOptions'); }} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => { setModalContent(post); setActiveModal('tip'); }} onVote={(optionId) => console.log('voted', optionId)} />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); }} />;
            case 'reels':
                return <ReelsView reels={reels} currentUser={currentUser!} onLikeReel={(id) => api.toggleReelLike(id)} onCommentOnReel={(reel) => { setModalContent(reel); setActiveModal('reelComments'); }} onShareReel={(reel) => { setModalContent(reel); setActiveModal('share'); }} />;
            case 'messages':
                return <MessagesView currentUser={currentUser!} onNavigate={(view, user) => handleNavigate(view, user)} onInitiateCall={handleInitiateCall} onViewMedia={(media) => { setModalContent(media); setActiveModal('mediaViewer'); }} />;
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
        return <div className="bg-black h-screen flex items-center justify-center text-white"><div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div></div>;
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
                <main className="flex-1 md:ml-20 xl:ml-64">
                    <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setActiveModal('accountSwitcher')} onCreatePost={() => setActiveModal('createChoice')} onShowNotifications={() => setNotificationsPanelOpen(p => !p)} onLogout={handleLogout} />
                    {renderView()}
                </main>
            </div>
            <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreate={() => setActiveModal('createChoice')} currentUser={currentUser} />
            
            {/* Modals & Panels */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {isNotificationsPanelOpen && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsPanelOpen(false)} currentUser={currentUser} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {isSearchOpen && <SearchView onClose={() => setSearchOpen(false)} onViewProfile={(user) => { handleNavigate('profile', user); setSearchOpen(false); }} onViewPost={(post) => { setModalContent(post); setActiveModal('post'); setSearchOpen(false); }} />}
            
            {activeModal === 'post' && modalContent && <PostModal post={modalContent} currentUser={currentUser} onClose={() => setActiveModal(null)} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={() => {}} onViewLikes={() => {}} onViewProfile={(user) => handleNavigate('profile', user)} onOptions={() => {}} />}
            {activeModal === 'storyViewer' && modalContent && <StoryViewer stories={modalContent.stories} initialStoryIndex={modalContent.index} onClose={() => setActiveModal(null)} onNextUser={() => {}} onPrevUser={() => {}} />}
            {activeModal === 'createChoice' && <CreateChoiceModal onClose={() => setActiveModal(null)} onChoice={(type) => { setActiveModal(type === 'post' ? 'createPost' : type === 'reel' ? 'createReel' : type === 'story' ? 'createStory' : 'goLive'); }} />}
            {activeModal === 'createPost' && <CreatePostModal onClose={() => setActiveModal(null)} onCreatePost={handleCreatePost} allUsers={allUsers} currentUser={currentUser} />}
            {activeModal === 'createReel' && <CreateReelModal onClose={() => setActiveModal(null)} onCreateReel={handleCreateReel} />}
            {activeModal === 'createStory' && <CreateStoryModal onClose={() => setActiveModal(null)} onCreateStory={handleCreateStory} />}
            {activeModal === 'accountSwitcher' && <AccountSwitcherModal accounts={[currentUser]} currentUser={currentUser} onClose={() => setActiveModal(null)} onSwitchAccount={() => {}} onAddAccount={() => {}} />}
            {activeModal === 'share' && modalContent && <ShareModal content={modalContent} currentUser={currentUser} conversations={conversations} onClose={() => setActiveModal(null)} onShareSuccess={() => showToast("Shared successfully!", 'success')} />}
            {activeModal === 'viewLikes' && modalContent && <ViewLikesModal users={modalContent} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={user => { setActiveModal(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModal === 'followList' && modalContent && <FollowListModal title={modalContent.title} users={modalContent.users} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={user => { setActiveModal(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModal === 'editProfile' && <EditProfileModal user={currentUser} onClose={() => setActiveModal(null)} onSave={async (data) => { const updatedUser = await api.updateProfile(data); setCurrentUser(updatedUser); setActiveModal(null); }} />}
            {activeModal === 'postOptions' && modalContent && <PostWithOptionsModal post={modalContent} currentUser={currentUser} onClose={() => setActiveModal(null)} onFollow={handleFollow} onUnfollow={handleUnfollow} onEdit={(post) => { setModalContent(post); setActiveModal('editPost');}} onDelete={(post) => api.deletePost(post.id).then(fetchData)} onArchive={(post) => api.archivePost(post.id).then(fetchData)} onReport={() => {}} onShare={() => {}} onCopyLink={() => {}} onViewProfile={() => {}} onGoToPost={() => {}} />}
            {activeModal === 'tip' && modalContent && <TipModal post={modalContent} onClose={() => setActiveModal(null)} onSendTip={handleSendTip} />}
            {activeModal === 'mediaViewer' && modalContent && <MediaViewerModal mediaUrl={modalContent.url} mediaType={modalContent.type} onClose={() => setActiveModal(null)} />}
            {activeModal === 'reelViewer' && modalContent && <ReelViewerModal reel={modalContent} currentUser={currentUser} onClose={() => setActiveModal(null)} onLikeReel={(id) => api.toggleReelLike(id)} onCommentOnReel={(reel) => { setModalContent(reel); setActiveModal('reelComments'); }} onShareReel={(reel) => { setModalContent(reel); setActiveModal('share'); }} />}
            {activeModal === 'reelComments' && modalContent && <ReelCommentsModal reel={modalContent} currentUser={currentUser} onClose={() => setActiveModal(null)} onComment={async (reelId, text) => { await api.addReelComment(reelId, text); fetchData(); }} />}
            {activeModal === 'goLive' && <GoLiveModal onClose={() => setActiveModal(null)} onStartStream={async (title) => { const stream = await api.startLiveStream(title); setActiveModal(null); setActiveLiveStream(stream); }} />}
            {activeModal === 'welcomeOnboarding' && <WelcomeOnboardingModal currentUser={currentUser} suggestedUsers={allUsers.filter(u => u.id !== currentUser.id).slice(0, 10)} onClose={() => setActiveModal(null)} onFollow={handleFollow} onUnfollow={handleUnfollow} />}


            {/* Call Modals */}
            {incomingCall && !activeCall && <IncomingCallModal caller={incomingCall.from} onAccept={handleAcceptCall} onDecline={handleDeclineCall} />}
            {activeCall && <CallModal user={activeCall.user} status={activeCall.status} type={activeCall.type} onHangUp={handleHangUp} remoteStream={remoteStream} />}
        </div>
    );
};

export default App;