import React, { useState, useEffect, useCallback } from 'react';
import type { User, Post, Story, View, Reel, Notification, TrendingTopic, FeedActivity, SponsoredContent, LiveStream } from './types.ts';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import { webRTCManager } from './services/WebRTCManager.ts';

import AuthView from './components/AuthView.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
// FIX: Corrected import path for MessagesView to point to the root directory.
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import Sidebar from './components/Sidebar.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreateChoiceModal from './components/CreateChoiceModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import CreateReelModal from './components/CreateReelModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import BottomNav from './components/BottomNav.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import AdminView from './components/AdminView.tsx';
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import CallModal from './components/CallModal.tsx';
import IncomingCallModal from './components/IncomingCallModal.tsx';
import MediaViewerModal from './components/MediaViewerModal.tsx';
import TipModal from './components/TipModal.tsx';
import GoLiveModal from './components/GoLiveModal.tsx';
import LiveStreamsView from './components/LiveStreamsView.tsx';
import LiveStreamView from './components/LiveStreamView.tsx';


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [isLoading, setIsLoading] = useState(true);
    
    // Data state
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    
    // Sidebar Data (can still be static or fetched)
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    
    // UI State
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [createModalType, setCreateModalType] = useState<'post' | 'reel' | 'story' | 'live' | null>(null);
    const [viewingStory, setViewingStory] = useState<{ story: Story, index: number } | null>(null);
    const [viewingPost, setViewingPost] = useState<Post | null>(null);
    const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
    const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
    const [sharingContent, setSharingContent] = useState<Post | Reel | null>(null);
    const [viewingLikes, setViewingLikes] = useState<User[] | null>(null);
    const [postWithOptions, setPostWithOptions] = useState<Post | null>(null);

    // New Features State
    const [incomingCall, setIncomingCall] = useState<{ caller: User, type: 'video' | 'audio' } | null>(null);
    const [activeCall, setActiveCall] = useState<{ user: User, type: 'video' | 'audio', status: 'calling' | 'connected' } | null>(null);
    const [viewingMedia, setViewingMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
    const [tippingPost, setTippingPost] = useState<Post | null>(null);
    const [viewingStream, setViewingStream] = useState<LiveStream | null>(null);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        try {
            const [postsData, storiesData, reelsData, allUsersData, streamsData] = await Promise.all([
                api.getPosts(),
                api.getStories(),
                api.getReels(),
                api.getAllUsers(),
                api.getLiveStreams()
            ]);
            setPosts(postsData);
            setStories(storiesData);
            setReels(reelsData);
            setAllUsers(allUsersData);
            setLiveStreams(streamsData);
        } catch (error) {
            console.error("Failed to fetch app data:", error);
        }
    }, [currentUser]);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { user } = await api.checkSession();
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
        };
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, fetchData]);
    
    // --- ACTION HANDLERS ---
    const handleToggleLike = async (postId: string) => {
        if (!currentUser) return;
        // Optimistic update
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likedBy.some(u => u.id === currentUser.id);
                const newLikes = isLiked ? p.likes - 1 : p.likes + 1;
                const newLikedBy = isLiked 
                    ? p.likedBy.filter(u => u.id !== currentUser.id)
                    : [...p.likedBy, currentUser];
                return { ...p, likes: newLikes, likedBy: newLikedBy };
            }
            return p;
        }));
        try {
            await api.togglePostLike(postId);
        } catch (error) {
            console.error("Failed to toggle like:", error);
            fetchData(); // Revert on error
        }
    };
    
    const handleToggleSave = async (postId: string) => {
        setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
        try {
            await api.togglePostSave(postId);
        } catch (error) {
            console.error("Failed to toggle save:", error);
            fetchData(); // Revert on error
        }
    };

    const handleComment = async (postId: string, text: string) => {
        try {
            await api.addComment(postId, text);
            await fetchData(); // simple refresh
        } catch (error) {
             console.error("Failed to comment:", error);
        }
    };

    const handleFollow = async (userToFollow: User) => {
        if(!currentUser) return;
        // Optimistic update
        setCurrentUser(prev => ({...prev!, following: [...(prev?.following || []), userToFollow] }));
        try {
            await api.followUser(userToFollow.id);
        } catch (error) {
            console.error("Follow failed:", error);
            // Revert
            setCurrentUser(prev => ({...prev!, following: prev!.following!.filter(u => u.id !== userToFollow.id)}));
        }
    };
    
    const handleUnfollow = async (userToUnfollow: User) => {
         if(!currentUser) return;
        // Optimistic update
        setCurrentUser(prev => ({...prev!, following: prev!.following!.filter(u => u.id !== userToUnfollow.id)}));
        try {
            await api.followUser(userToUnfollow.id); // Same endpoint for toggle
        } catch (error) {
            console.error("Unfollow failed:", error);
            // Revert
             setCurrentUser(prev => ({...prev!, following: [...(prev?.following || []), userToUnfollow] }));
        }
    };
    
    const handleCreate = async (formData: FormData) => {
        if (!createModalType) return;
        try {
            switch(createModalType) {
                case 'post': await api.createPost(formData); break;
                case 'reel': await api.createReel(formData); break;
                case 'story': await api.createStory(formData); break;
            }
            await fetchData();
            closeCreateModals();
        } catch(error) {
            console.error(`Failed to create ${createModalType}:`, error);
        }
    }
    
    const handleStartStream = async (title: string) => {
        try {
            const newStream = await api.startStream(title);
            setLiveStreams(prev => [newStream, ...prev]);
            setViewingStream(newStream);
            closeCreateModals();
        } catch(error) {
            console.error("Failed to start stream:", error);
        }
    };

    const handleSendTip = async (amount: number) => {
        if (!tippingPost || !currentUser) return;
        try {
            await api.sendTip(tippingPost.id, amount);
            // Optimistic update of wallet balance
            setCurrentUser(prev => ({...prev!, wallet_balance: (prev!.wallet_balance || 0) - amount}));
        } catch(error) {
            console.error("Failed to send tip:", error);
            throw error;
        }
    };
    
    // --- CALL HANDLERS ---
    // In a real app this would come from a socket event
    const simulateIncomingCall = (caller: User, type: 'video' | 'audio') => {
        // Don't show incoming call if already in one
        if (!activeCall) {
            setIncomingCall({ caller, type });
        }
    };
    
    const handleInitiateCall = (user: User, type: 'video' | 'audio') => {
        if (!currentUser || activeCall) return;
        setActiveCall({ user, type, status: 'calling' });
        // Simulate the other user receiving the call after a short delay
        setTimeout(() => simulateIncomingCall(currentUser, type), 1500);
    };

    const handleAcceptCall = () => {
        if (!incomingCall) return;
        setActiveCall({ user: incomingCall.caller, type: incomingCall.type, status: 'connected' });
        setIncomingCall(null);
    };

    const handleDeclineCall = () => {
        setIncomingCall(null);
        // In a real app, a 'decline' signal would be sent.
        // For simulation, we just end the call for the caller too.
        if (activeCall?.status === 'calling') {
            setActiveCall(null);
        }
    };

    const handleHangUp = () => {
        if (activeCall) {
            webRTCManager.hangUp();
            setActiveCall(null);
            setIncomingCall(null); // Also clear any lingering incoming call state
        }
    };

    // --- NAVIGATION & VIEWS ---
    const handleLoginSuccess = (data: { user: User }) => {
        setCurrentUser(data.user);
        socketService.connect('/');
    };

    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        socketService.disconnect();
    };

    const handleNavigate = (view: View) => {
        setCurrentView(view);
        setNotificationsPanelOpen(false);
    };

    const openCreateModal = (type: 'post' | 'reel' | 'story' | 'live' | null = null) => {
        if (type) {
             if (type === 'live') {
                setCreateModalType('live');
             } else {
                setCreateModalType(type);
             }
        }
        setCreateModalOpen(true);
    };
    
    const closeCreateModals = () => {
        setCreateModalOpen(false);
        setCreateModalType(null);
    }
    
    const renderView = () => {
        if (!currentUser) return null;
        switch (currentView) {
            case 'home':
                return <HomeView posts={posts} stories={stories} currentUser={currentUser} onViewStory={(story, index) => setViewingStory({ story, index })} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={setSharingContent} onViewLikes={setViewingLikes} onViewProfile={() => {}} onViewPost={setViewingPost} onOptions={setPostWithOptions} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={setTippingPost} onVote={() => {}} />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={setViewingPost} />;
            case 'reels':
                return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={() => {}} onCommentOnReel={() => {}} onShareReel={() => {}} />;
            case 'live':
                return <LiveStreamsView streams={liveStreams} onJoinStream={setViewingStream} />;
            case 'messages':
                return <MessagesView currentUser={currentUser} onNavigate={() => {}} onInitiateCall={handleInitiateCall} onViewMedia={setViewingMedia} />;
            case 'profile':
                return <ProfileView user={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)} reels={reels.filter(r => r.user.id === currentUser.id)} isCurrentUser={true} currentUser={currentUser} onEditProfile={() => {}} onViewArchive={() => {}} onFollow={handleFollow} onUnfollow={handleUnfollow} onShowFollowers={() => {}} onShowFollowing={() => {}} onEditPost={() => {}} onViewPost={setViewingPost} onViewReel={() => {}} onOpenCreateHighlightModal={() => {}} onMessage={() => {}} />;
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
    
    if (isLoading) {
        return <div className="bg-black text-white min-h-screen flex items-center justify-center"><div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div></div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="bg-black text-white min-h-screen">
            {currentView !== 'admin' && <LeftSidebar currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openCreateModal()} onShowNotifications={() => setNotificationsPanelOpen(true)} />}
            
            <div className={`transition-transform duration-300 ${isNotificationsPanelOpen ? '-translate-x-[397px]' : 'translate-x-0'} md:ml-[72px] lg:ml-64`}>
                {currentView !== 'admin' && <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setAccountSwitcherOpen(true)} onCreatePost={() => openCreateModal()} onShowNotifications={() => setNotificationsPanelOpen(p => !p)} onLogout={handleLogout} />}
                
                <main className="flex">
                    <div className="flex-1">
                        {renderView()}
                    </div>
                    {currentView === 'home' && <Sidebar trendingTopics={trendingTopics} suggestedUsers={allUsers.filter(u => u.id !== currentUser.id).slice(0,5)} feedActivities={[]} sponsoredContent={sponsoredContent} currentUser={currentUser} onFollow={handleFollow} onUnfollow={handleUnfollow} onViewProfile={() => {}} />}
                </main>

                {currentView !== 'admin' && <BottomNav currentView={currentView} onNavigate={handleNavigate} onCreate={() => openCreateModal()} currentUser={currentUser} />}
            </div>
            
            {/* Modals & Overlays */}
            {viewingStory && <StoryViewer stories={stories} initialStoryIndex={viewingStory.index} onClose={() => setViewingStory(null)} onNextUser={() => {}} onPrevUser={() => {}} />}
            {viewingPost && <PostModal post={viewingPost} currentUser={currentUser} onClose={() => setViewingPost(null)} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={setSharingContent} onViewProfile={() => {}} onOptions={setPostWithOptions} />}
            {isCreateModalOpen && !createModalType && <CreateChoiceModal onClose={closeCreateModals} onChoice={(type) => openCreateModal(type)} />}
            {createModalType === 'post' && <CreatePostModal onClose={closeCreateModals} onCreatePost={handleCreate} allUsers={allUsers} currentUser={currentUser} />}
            {createModalType === 'reel' && <CreateReelModal onClose={closeCreateModals} onCreateReel={handleCreate} />}
            {createModalType === 'story' && <CreateStoryModal onClose={closeCreateModals} onCreateStory={handleCreate} />}
            {createModalType === 'live' && <GoLiveModal onClose={closeCreateModals} onStartStream={handleStartStream} />}
            {isAccountSwitcherOpen && <AccountSwitcherModal accounts={allUsers} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchAccount={() => {}} onAddAccount={() => {}} />}
            {isNotificationsPanelOpen && <NotificationsPanel notifications={[]} onClose={() => setNotificationsPanelOpen(false)} onViewProfile={() => {}} onMarkAsRead={() => {}} onCollaborationResponse={() => {}} />}
            {sharingContent && <ShareModal content={sharingContent} currentUser={currentUser} conversations={[]} onClose={() => setSharingContent(null)} onShareSuccess={() => {}} />}
            {viewingLikes && <ViewLikesModal users={viewingLikes} currentUser={currentUser} onClose={() => setViewingLikes(null)} onViewProfile={() => {}} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {postWithOptions && <PostWithOptionsModal post={postWithOptions} currentUser={currentUser} onClose={() => setPostWithOptions(null)} onUnfollow={handleUnfollow} onFollow={handleFollow} onEdit={()=>{}} onDelete={()=>{}} onArchive={()=>{}} onReport={()=>{}} onShare={setSharingContent} onCopyLink={()=>{}} onViewProfile={()=>{}} onGoToPost={setViewingPost} />}
            {activeCall && <CallModal user={activeCall.user} status={activeCall.status} type={activeCall.type} onHangUp={handleHangUp} />}
            {incomingCall && !activeCall && <IncomingCallModal caller={incomingCall.caller} onAccept={handleAcceptCall} onDecline={handleDeclineCall} />}
            {viewingMedia && <MediaViewerModal mediaUrl={viewingMedia.url} mediaType={viewingMedia.type} onClose={() => setViewingMedia(null)} />}
            {tippingPost && <TipModal post={tippingPost} onClose={() => setTippingPost(null)} onSendTip={handleSendTip} />}
            {viewingStream && <LiveStreamView stream={viewingStream} currentUser={currentUser} onClose={() => setViewingStream(null)} />}
        </div>
    );
};

export default App;