import React, { useState, useEffect, useCallback } from 'react';

// API & Services
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

// Types
// Fix: Add `Message` to the import list to resolve type errors.
import type { View, User, Post, Story, Reel, Conversation, Notification, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, StoryItem, Comment, Message } from './types.ts';

// Views
import AuthView from './components/AuthView.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './components/MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import PremiumView from './components/PremiumView.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import ActivityView from './components/ActivityView.tsx';
import SearchView from './components/SearchView.tsx';

// Components
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import Toast from './components/Toast.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';

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
import IncomingCallModal from './components/IncomingCallModal.tsx';
import CallModal from './components/CallModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';


type CallState = {
    status: 'idle' | 'outgoing' | 'incoming' | 'active';
    fromUser?: User;
    toUser?: User;
    withUser?: User;
}

const App: React.FC = () => {
    // Authentication & User State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]); // For search, messages, etc.
    const [isLoading, setIsLoading] = useState(true);
    
    // Navigation State
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
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
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);


    // Modal & Panel State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null); // Flexible data for modals
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [callState, setCallState] = useState<CallState>({ status: 'idle' });

    const showToast = (message: string) => {
        setToastMessage(message);
    };
    
    const fetchInitialData = useCallback(async () => {
        if (!localStorage.getItem('authToken')) {
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        try {
            const [
                feedRes, storiesRes, trendingRes, suggestionsRes, activitiesRes, sponsoredRes, conversationsRes, allUsersRes, reelsRes, notificationsRes
            ] = await Promise.all([
                api.getFeed(),
                api.getStories(),
                api.getTrending(),
                api.getSuggestions(),
                api.getFeedActivities(),
                api.getSponsoredContent(),
                api.getConversations(),
                api.getAllUsers(),
                api.getReels(),
                api.getNotifications(),
            ]);

            setPosts(feedRes.posts);
            setStories(storiesRes.stories);
            setTrendingTopics(trendingRes);
            setSuggestedUsers(suggestionsRes);
            setFeedActivities(activitiesRes);
            setSponsoredContent(sponsoredRes);
            setConversations(conversationsRes);
            setAllUsers(allUsersRes);
            setReels(reelsRes);
            setNotifications(notificationsRes);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLoginSuccess = useCallback((data: { user: User, token: string }) => {
        localStorage.setItem('authToken', data.token);
        setCurrentUser(data.user);
        fetchInitialData();
    }, [fetchInitialData]);

    // Socket.IO setup
    useEffect(() => {
        if (currentUser && !socketService.socket) {
            socketService.connect(currentUser.id);

            const onNewNotification = (notification: Notification) => {
                setNotifications(prev => [notification, ...prev]);
                showToast(`New notification from ${notification.user.username}`);
            };
            const onNewMessage = ({ conversationId, message }: { conversationId: string, message: Message }) => {
                setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c));
            };
            const onMessageConfirmed = ({ conversationId, message }: { conversationId: string, message: Message }) => {
                setConversations(prev => prev.map(c => {
                    if (c.id === conversationId) {
                        return { ...c, messages: c.messages.map(m => m.id === `temp-${message.id}` ? message : m) };
                    }
                    return c;
                }));
            };

            const handleIncomingCall = ({ fromUser }: { fromUser: User }) => {
                if (callState.status === 'idle') setCallState({ status: 'incoming', fromUser });
            };
            const handleCallAccepted = ({ withUser }: { withUser: User }) => {
                if (callState.status === 'outgoing') setCallState({ status: 'active', withUser: callState.toUser });
            };
            const handleCallDeclined = () => {
                showToast('Call declined.');
                setCallState({ status: 'idle' });
            };
            const handleCallEnded = () => {
                showToast('Call ended.');
                setCallState({ status: 'idle' });
            };
             const handleCallError = ({ message }: { message: string }) => {
                showToast(message);
                setCallState({ status: 'idle' });
            };

            socketService.on('new_notification', onNewNotification);
            socketService.on('receive_message', onNewMessage);
            socketService.on('message_sent_confirmation', onMessageConfirmed);
            socketService.on('incoming_call', handleIncomingCall);
            socketService.on('call_accepted', handleCallAccepted);
            socketService.on('call_declined', handleCallDeclined);
            socketService.on('call_ended', handleCallEnded);
            socketService.on('call_error', handleCallError);
            
            return () => {
                socketService.off('new_notification', onNewNotification);
                socketService.off('receive_message', onNewMessage);
                socketService.off('message_sent_confirmation', onMessageConfirmed);
                socketService.off('incoming_call');
                socketService.off('call_accepted');
                socketService.off('call_declined');
                socketService.off('call_ended');
                socketService.off('call_error');
            }
        }
    }, [currentUser, callState.status, callState.toUser]);

    // Initial Load Effect to check for existing token
    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const { user } = await api.checkAuth();
                    setCurrentUser(user);
                    await fetchInitialData();
                } catch (error) {
                    console.error("Session check failed:", error);
                    handleLogout(); 
                }
            } else {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, [fetchInitialData]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setPosts([]);
        setStories([]);
        socketService.disconnect();
        setCurrentView('home');
    };
    
    const handleNavigate = async (view: View, data?: any) => {
        setPreviousView(currentView);
        if (view === 'profile' && data) {
            setProfileUser(data as User);
        } else if (view !== 'profile') {
            setProfileUser(null);
        }

        if (view === 'saved') {
            const posts = await api.getSavedPosts();
            setSavedPosts(posts);
        } else if (view === 'archive') {
            const posts = await api.getArchivedPosts();
            setArchivedPosts(posts);
        } else if (view === 'premium') {
            const testimonials = await api.getTestimonials();
            setTestimonials(testimonials);
        } else if (view === 'help') {
             const articles = await api.getHelpArticles();
             setHelpArticles(articles);
        } else if (view === 'support') {
            const tickets = await api.getSupportTickets();
            setSupportTickets(tickets);
        }

        setCurrentView(view);
    };
    
    const openModal = (modalName: string, data: any = null) => {
        setActiveModal(modalName);
        setModalData(data);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    const handleToggleLike = async (postId: string) => {
        if(!currentUser) return;
        const originalPosts = [...posts];
        setPosts(currentPosts => currentPosts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likedBy.some(u => u.id === currentUser!.id);
                return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1, likedBy: isLiked ? p.likedBy.filter(u => u.id !== currentUser!.id) : [...p.likedBy, currentUser!] };
            }
            return p;
        }));
        try { await api.toggleLike(postId); } catch (error) { setPosts(originalPosts); showToast('Failed to update like.'); }
    };
    
    // Fix: Correctly implement optimistic update for saving posts by manipulating the `savedBy` array.
    // This resolves the TypeScript error about `isSaved` not existing on type `Post` and fixes the underlying logic bug.
    const handleToggleSave = async (postId: string) => {
        if (!currentUser) return;

        const originalPosts = [...posts];
        const postToUpdate = originalPosts.find(p => p.id === postId);

        if (!postToUpdate) return;
        
        const isSaved = postToUpdate.savedBy.some(u => u.id === currentUser.id);

        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    savedBy: isSaved
                        ? p.savedBy.filter(u => u.id !== currentUser.id)
                        : [...p.savedBy, currentUser],
                };
            }
            return p;
        }));
        
        try {
            await api.toggleSave(postId);
            showToast(isSaved ? "Post unsaved" : "Post saved to your collection.");
        } catch (error) {
            showToast("Failed to update save status.");
            setPosts(originalPosts);
        }
    };
    
    const handleComment = async (postId: string, text: string) => {
        if (!currentUser) return;
        try {
            const newComment = await api.addComment(postId, text);
            setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
            showToast("Comment posted.");
        } catch (error) {
            showToast("Failed to post comment.");
        }
    };
    
    const handleFollow = async (userToFollow: User) => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, following: [...currentUser.following, userToFollow] });
        showToast(`You are now following ${userToFollow.username}`);
        try { await api.followUser(userToFollow.id); } catch (error) { showToast('Failed to follow user.'); fetchInitialData(); }
    };

    const handleUnfollow = (userToUnfollow: User) => { openModal('unfollow', userToUnfollow); };
    
    const confirmUnfollow = async (userToUnfollow: User) => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, following: currentUser.following.filter(u => u.id !== userToUnfollow.id) });
        closeModal();
        showToast(`You have unfollowed ${userToUnfollow.username}`);
        try { await api.unfollowUser(userToUnfollow.id); } catch (error) { showToast('Failed to unfollow user.'); fetchInitialData(); }
    };

    const handleCreatePost = async (formData: FormData) => {
        closeModal();
        showToast("Creating post...");
        try {
            await api.createPost(formData);
            showToast("Post created successfully!");
            await fetchInitialData(); // refetch to see new post
        } catch (error) {
            showToast("Failed to create post.");
        }
    };

    const handleCreateStory = async (formData: FormData) => {
        closeModal();
        showToast("Adding to your story...");
        try {
            await api.createStory(formData);
            showToast("Story added successfully!");
            await fetchInitialData();
        } catch(error) {
            showToast("Failed to add story.");
        }
    };

    // --- Call Handlers ---
    const handleInitiateCall = (userToCall: User) => {
        if (!currentUser) return;
        setCallState({ status: 'outgoing', toUser: userToCall });
        socketService.emit('outgoing_call', { fromUser: currentUser, toUserId: userToCall.id });
    };
    const handleAcceptCall = () => {
        if (callState.status === 'incoming' && callState.fromUser && currentUser) {
            socketService.emit('accept_call', { toUser: currentUser, fromUserId: callState.fromUser.id });
            setCallState({ status: 'active', withUser: callState.fromUser });
        }
    };
    const handleDeclineCall = () => {
        if (callState.status === 'incoming' && callState.fromUser) {
            socketService.emit('decline_call', { fromUserId: callState.fromUser.id });
        }
        setCallState({ status: 'idle' });
    };
    const handleEndCall = () => {
        const otherUserId = callState.toUser?.id || callState.withUser?.id || callState.fromUser?.id;
        if (otherUserId) {
            socketService.emit('end_call', { toUserId: otherUserId });
        }
        setCallState({ status: 'idle' });
    };

    const renderView = () => {
        switch (currentView) {
            case 'home': return <HomeView posts={posts} stories={stories} currentUser={currentUser!} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewStory={(story) => openModal('story', story)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', post)} onOptions={(post) => openModal('postOptions', post)} onShowSuggestions={() => openModal('suggestions', suggestedUsers)} onShowTrends={() => openModal('trends', trendingTopics)} onCreateStory={() => openModal('createStory')} onShowSearch={() => setSearchVisible(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={handleUnfollow} />;
            case 'explore': return <ExploreView posts={posts} onViewPost={(post) => openModal('post', post)} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser!} onLikeReel={() => {}} onCommentOnReel={(reel) => openModal('reelComments', reel)} onShareReel={(reel) => openModal('share', reel)} />;
            case 'messages': return <MessagesView conversations={conversations} currentUser={currentUser!} allUsers={allUsers} onNavigate={(view, user) => handleNavigate(view, user)} onInitiateCall={handleInitiateCall}/>;
            case 'profile': return <ProfileView user={profileUser || currentUser!} posts={posts.filter(p => p.user.id === (profileUser || currentUser!).id)} reels={reels.filter(r => r.user.id === (profileUser || currentUser!).id)} isCurrentUser={!profileUser || profileUser.id === currentUser!.id} currentUser={currentUser!} onEditProfile={() => openModal('editProfile', currentUser)} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={handleUnfollow} onShowFollowers={(users) => openModal('followList', { title: 'Followers', users })} onShowFollowing={(users) => openModal('followList', { title: 'Following', users })} onEditPost={(post) => openModal('editPost', post)} onViewPost={(post) => openModal('post', post)} onViewReel={() => {}} onOpenCreateHighlightModal={() => openModal('createHighlight')} onMessage={(user) => handleNavigate('messages', user)} />;
            case 'saved': return <SavedView posts={savedPosts} onViewPost={(post) => openModal('post', post)} />;
            case 'archive': return <ArchiveView posts={archivedPosts} onViewPost={(post) => openModal('post', post)} onUnarchivePost={() => {}}/>;
            case 'premium': return <PremiumView testimonials={testimonials} onSubscribe={() => openModal('payment')} />;
            case 'premium-welcome': return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'settings': return <SettingsView currentUser={currentUser!} onNavigate={handleNavigate} onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')} onChangePassword={() => openModal('changePassword')} onManageAccount={() => openModal('editProfile')} onToggleTwoFactor={() => openModal('2fa')} onGetVerified={() => openModal('getVerified')} onUpdateSettings={async (settings) => { await api.updateSettings(settings); showToast("Settings updated"); fetchInitialData();}} />;
            case 'help': return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support': return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => openModal('newSupport')} />;
            case 'activity': return <ActivityView activities={notifications} />;
            default: return <HomeView posts={posts} stories={stories} currentUser={currentUser!} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onToggleLike={handleToggleLike} onToggleSave={() => {}} onComment={() => {}} onShare={(post) => openModal('share', post)} onViewStory={(story) => openModal('story', story)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', post)} onOptions={(post) => openModal('postOptions', post)} onShowSuggestions={() => openModal('suggestions', suggestedUsers)} onShowTrends={() => openModal('trends', trendingTopics)} onCreateStory={() => openModal('createStory')} onShowSearch={() => setSearchVisible(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={handleUnfollow} />;
        }
    };
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-black"><p className="text-white">Loading...</p></div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
    }

    return (
        <div className="bg-black text-white min-h-screen font-sans flex">
            <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => setSearchVisible(true)} onShowNotifications={() => setNotificationsVisible(true)} onCreatePost={() => openModal('createPost')} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} />
            <div className="flex-1 md:ml-[72px] lg:ml-64">
                <Header currentUser={currentUser} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} onShowNotifications={() => setNotificationsVisible(true)} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} />
                <main className="md:pt-4">
                    {renderView()}
                </main>
            </div>
            <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} />
            
            {isSearchVisible && <SearchView users={allUsers} onClose={() => setSearchVisible(false)} onViewProfile={(user) => { handleNavigate('profile', user); setSearchVisible(false); }} />}
            {isNotificationsVisible && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsVisible(false)} onViewProfile={(user) => { handleNavigate('profile', user); setNotificationsVisible(false); }} onMarkAsRead={async () => { await api.markNotificationsRead(); setNotifications(notifications.map(n => ({...n, read: true}))); }}/>}

            {activeModal === 'post' && <PostModal post={modalData} currentUser={currentUser} onClose={closeModal} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onOptions={(post) => openModal('postOptions', post)} />}
            {activeModal === 'createPost' && <CreatePostModal onClose={closeModal} onCreatePost={handleCreatePost} />}
            {activeModal === 'createStory' && <CreateStoryModal onClose={closeModal} onCreateStory={handleCreateStory} />}
            {activeModal === 'unfollow' && <UnfollowModal user={modalData} onCancel={closeModal} onConfirm={() => confirmUnfollow(modalData)}/>}
            {activeModal === 'followList' && <FollowListModal title={modalData.title} users={modalData.users} currentUser={currentUser} onClose={closeModal} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModal === 'viewLikes' && <ViewLikesModal users={modalData} currentUser={currentUser} onClose={closeModal} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} onFollow={handleFollow} onUnfollow={handleUnfollow}/>}
            {activeModal === 'share' && <ShareModal content={modalData} currentUser={currentUser} onClose={closeModal} conversations={conversations} onShareSuccess={(user) => { showToast(`Shared to ${user.username}`); }} />}
            {activeModal === 'forgotPassword' && <ForgotPasswordModal onClose={closeModal} onSubmit={async (email) => { await api.forgotPassword(email); }} />}
            {activeModal === 'editProfile' && <EditProfileModal user={currentUser} onClose={closeModal} onSave={async (formData) => { await api.updateProfile(formData); closeModal(); showToast("Profile updated!"); await fetchInitialData(); }} />}
            {activeModal === 'changePassword' && <ChangePasswordModal onClose={closeModal} onSubmit={async (old, newP) => { await api.changePassword(old, newP); showToast("Password updated!"); }} />}
            {activeModal === 'payment' && <PaymentModal onClose={closeModal} onConfirmPayment={async () => { await api.subscribePremium(); handleNavigate('premium-welcome'); }} />}
            {activeModal === 'getVerified' && <GetVerifiedModal onClose={closeModal} onSubmit={async (data) => { await api.applyForVerification(data); showToast("Application submitted!"); }}/>}
            {activeModal === 'newSupport' && <NewSupportRequestModal onClose={closeModal} onSubmit={async (sub, desc) => { await api.createSupportTicket(sub, desc); showToast("Support ticket created."); handleNavigate('support'); }} />}
            {activeModal === 'suggestions' && <SuggestionsModal users={suggestedUsers} currentUser={currentUser} onClose={closeModal} onFollow={handleFollow} onUnfollow={handleUnfollow} onViewProfile={(user) => {closeModal(); handleNavigate('profile', user)}} />}
            {activeModal === 'trends' && <TrendsModal topics={trendingTopics} onClose={closeModal} />}


            {/* Call Modals */}
            {callState?.status === 'incoming' && callState.fromUser && <IncomingCallModal user={callState.fromUser} onAccept={handleAcceptCall} onDecline={handleDeclineCall} />}
            {(callState?.status === 'outgoing' || callState?.status === 'active') && (callState.toUser || callState.withUser) && <CallModal user={(callState.toUser || callState.withUser)!} status={callState.status} onEndCall={handleEndCall} />}
            
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
}

export default App;