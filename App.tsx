import React, { useState, useEffect, useCallback } from 'react';
import type { View, User, Post, Reel, Story, Conversation, Message, Notification, FeedActivity, SponsoredContent, TrendingTopic, Testimonial, HelpArticle, SupportTicket, LiveStream, StoryItem, StoryHighlight, Report, AdminStats, AnalyticsData, Announcement } from './types';
import AuthView from './components/AuthView.tsx';
import HomeView from './components/HomeView.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './SettingsView.tsx';
import SavedView from './components/SavedView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import AdminView from './components/AdminView.tsx';
import PremiumView from './components/PremiumView.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './SupportInboxView.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import Toast from './components/Toast.tsx';
import LiveStreamsView from './components/LiveStreamsView.tsx';
import GoLiveModal from './components/GoLiveModal.tsx';
import LiveStreamView from './components/LiveStreamView.tsx';
import TipModal from './components/TipModal.tsx';
import CallModal from './components/CallModal.tsx';
import IncomingCallModal from './components/IncomingCallModal.tsx';
import AnnouncementBanner from './components/AnnouncementBanner.tsx';

import * as api from './services/apiService';
import { socketService } from './services/socketService.ts';
import { webRTCManager } from './services/WebRTCManager.ts';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import ActivityView from './components/ActivityView.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';


export const App: React.FC = () => {
    // --- Authentication State ---
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- Main UI State ---
    const [currentView, setCurrentView] = useState<View>('home');
    const [previousView, setPreviousView] = useState<View>('home');

    // --- Data State ---
    const [feedPosts, setFeedPosts] = useState<Post[]>([]);
    const [explorePosts, setExplorePosts] = useState<Post[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [sidebarData, setSidebarData] = useState({
        trending: [] as TrendingTopic[],
        suggestions: [] as User[],
        activity: [] as FeedActivity[],
        sponsored: [] as SponsoredContent[],
    });
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

    // --- Modal & Panel State ---
    const [activeModals, setActiveModals] = useState<Record<string, any>>({});
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    // --- Profile & Content Viewing ---
    const [viewedUser, setViewedUser] = useState<User | null>(null);
    const [viewedPost, setViewedPost] = useState<Post | null>(null);
    const [viewedStory, setViewedStory] = useState<Story | null>(null);
    const [viewedLiveStream, setViewedLiveStream] = useState<LiveStream | null>(null);
    
    // --- WebRTC & Calling State ---
    const [callState, setCallState] = useState<{ user: User, status: 'outgoing' | 'incoming' | 'active' | 'connecting', callType: 'video' | 'audio' } | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);


    const showToast = (message: string) => {
        setToastMessage(message);
    };

    const openModal = (name: string, props: any = {}) => setActiveModals(prev => ({ ...prev, [name]: props }));
    const closeModal = (name: string) => setActiveModals(prev => {
        const newModals = { ...prev };
        delete newModals[name];
        return newModals;
    });

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        try {
            const [
                feedData,
                exploreData,
                reelsData,
                storiesData,
                conversationsData,
                notificationsData,
                trendingData,
                suggestionsData,
                activityData,
                sponsoredData,
                allUsersData,
                liveStreamsData,
                announcementData,
            ] = await Promise.all([
                api.getFeedPosts(),
                api.getExplorePosts(),
                api.getReels(),
                api.getStories(),
                api.getConversations(),
                api.getNotifications(),
                api.getTrendingTopics(),
                api.getSuggestedUsers(),
                api.getFeedActivity(),
                api.getSponsoredContent(),
                api.getAllUsers(),
                api.getLiveStreams(),
                api.getActiveAnnouncement(),
            ]);

            setFeedPosts(feedData.posts);
            setExplorePosts(exploreData.posts);
            setReels(reelsData);
            setStories(storiesData.stories);
            setConversations(conversationsData);
            setNotifications(notificationsData);
            setSidebarData({
                trending: trendingData,
                suggestions: suggestionsData,
                activity: activityData,
                sponsored: sponsoredData,
            });
            setAllUsers(allUsersData);
            setLiveStreams(liveStreamsData);
            setActiveAnnouncement(announcementData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            if (error instanceof Error && error.message.includes('401')) handleLogout(); // Log out on auth error
            if (error instanceof Error && error.message.includes('account has been')) {
                showToast(error.message);
                setTimeout(handleLogout, 3000);
            }
        }
    }, [currentUser]);
    
    // --- Authentication ---
    const handleLoginSuccess = async (data: { user: User, token: string }) => {
        localStorage.setItem('token', data.token);
        api.setAuthToken(data.token);
        const { user: refreshedUser } = await api.getMe();
        setCurrentUser(refreshedUser);
        socketService.connect(refreshedUser.id);
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        api.setAuthToken(null);
        setCurrentUser(null);
        socketService.disconnect();
        // Reset all state
        setCurrentView('home');
        setFeedPosts([]);
        setExplorePosts([]);
        // ... reset all other state variables
    };

    // --- Navigation ---
    const handleNavigate = (view: View, data?: any) => {
        setPreviousView(currentView);
        if (view === 'profile' && data) setViewedUser(data);
        else setViewedUser(null);
        if (view === 'post' && data) setViewedPost(data);
        else setViewedPost(null);
        setCurrentView(view);
        setSearchVisible(false);
        setNotificationsVisible(false);
    };

    // --- Content Interaction Handlers ---
    const handleToggleLike = async (postId: string) => {
        const originalPosts = [...feedPosts];
        const updatedPosts = feedPosts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likedBy.some(u => u.id === currentUser!.id);
                const newLikedBy = isLiked ? p.likedBy.filter(u => u.id !== currentUser!.id) : [...p.likedBy, currentUser!];
                return { ...p, likedBy: newLikedBy, likes: newLikedBy.length };
            }
            return p;
        });
        setFeedPosts(updatedPosts);
        try {
            await api.toggleLike(postId);
        } catch (error) {
            setFeedPosts(originalPosts);
        }
    };
    
    const handleToggleSave = async (postId: string) => {
        setFeedPosts(posts => posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
        try {
            await api.toggleSave(postId);
        } catch (error) {
             console.error("Failed to toggle save:", error);
             setFeedPosts(posts => posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
        }
    };

    const handleComment = async (postId: string, text: string) => {
        try {
            await api.addComment(postId, text);
            await fetchData(); // Refresh data to show new comment
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    const handleVote = async (optionId: number) => {
        try {
            await api.voteOnPoll(optionId);
            await fetchData(); // Refresh data to show vote results
        } catch (error) {
            console.error("Failed to vote:", error);
            showToast("You have already voted on this poll.");
        }
    };
    
    const handleCreatePost = async (formData: FormData) => {
        try {
            await api.createPost(formData);
            closeModal('createPost');
            await fetchData();
            handleNavigate('home');
            showToast("Post created successfully!");
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const handleEditPost = (post: Post) => openModal('editPost', { post });
    const handleUpdatePost = async (updatedPost: Post) => {
        try {
            await api.editPost(updatedPost.id, updatedPost.caption, updatedPost.location || '');
            closeModal('editPost');
            await fetchData();
        } catch (error) {
            console.error("Failed to update post:", error);
        }
    };
    
    const handleDeletePost = async (post: Post) => {
        try {
            await api.deletePost(post.id);
            await fetchData();
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const handleArchivePost = async (post: Post) => {
        try {
            await api.archivePost(post.id);
            await fetchData();
        } catch (error) {
            console.error("Failed to archive post:", error);
        }
    };
    
     const handleUnarchivePost = async (post: Post) => {
        try {
            await api.unarchivePost(post.id);
            await fetchData();
        } catch (error) {
            console.error("Failed to unarchive post:", error);
        }
    };


    // --- User Interaction Handlers ---
    const handleFollow = async (userToFollow: User) => {
        if (!currentUser) return;
        setCurrentUser(prev => prev ? { ...prev, following: [...prev.following, userToFollow] } : null);
        try {
            await api.followUser(userToFollow.id);
        } catch (error) {
            console.error("Follow failed", error);
            setCurrentUser(prev => prev ? { ...prev, following: prev.following.filter(u => u.id !== userToFollow.id) } : null);
        }
    };
    
    const handleUnfollow = (userToUnfollow: User) => openModal('unfollow', { user: userToUnfollow });
    const handleConfirmUnfollow = async (userToUnfollow: User) => {
        if (!currentUser) return;
        setCurrentUser(prev => prev ? { ...prev, following: prev.following.filter(u => u.id !== userToUnfollow.id) } : null);
        try {
            await api.unfollowUser(userToUnfollow.id);
            closeModal('unfollow');
        } catch (error) {
            console.error("Unfollow failed", error);
            setCurrentUser(prev => prev ? { ...prev, following: [...prev.following, userToUnfollow] } : null);
        }
    };
    
    const handleUpdateSettings = async (settings: Partial<User['notificationSettings'] & { isPrivate: boolean }>) => {
        if (!currentUser) return;
        const optimisticUser = {
            ...currentUser,
            isPrivate: settings.isPrivate ?? currentUser.isPrivate,
            notificationSettings: {
                ...currentUser.notificationSettings,
                ...settings,
            }
        };
        setCurrentUser(optimisticUser);
        try {
            await api.updateUserSettings(settings);
            showToast("Settings updated!");
        } catch (error) {
            console.error("Failed to update settings", error);
            setCurrentUser(currentUser); // Revert on failure
            showToast("Failed to update settings.");
        }
    };


    // --- Story & Highlight Handlers ---
    const handleCreateStory = async (formData: FormData) => {
        try {
            await api.createStory(formData);
            closeModal('createStory');
            await fetchData();
            showToast("Story posted!");
        } catch (error) {
            console.error("Failed to create story", error);
        }
    };

    const handleCreateHighlight = async (title: string, storyIds: string[]) => {
        try {
            await api.createHighlight(title, storyIds);
            closeModal('createHighlight');
            const { user } = await api.getMe(); // Refresh user data to get new highlights
            setCurrentUser(user);
        } catch (error) {
             console.error("Failed to create highlight", error);
        }
    };

    // --- Conversation ---
    const handleUpdateConversation = (updatedConvo: Conversation) => {
        setConversations(prevConvos =>
            prevConvos.map(c => (c.id === updatedConvo.id ? updatedConvo : c))
        );
    };

    // --- Premium & Verification ---
    const handleSubscribeToPremium = async () => {
        try {
            await api.subscribeToPremium();
            closeModal('payment');
            const { user } = await api.getMe();
            setCurrentUser(user);
            handleNavigate('premium-welcome');
        } catch(error) {
            console.error("Failed to subscribe", error);
        }
    };

    const handleApplyForVerification = async (data: any) => {
        try {
            await api.applyForVerification(data);
            showToast("Application submitted!");
        } catch (error) {
            console.error("Verification application failed", error);
        }
    };
    
    // --- Support ---
    const handleNewSupportRequest = async (subject: string, description: string) => {
        try {
            await api.createSupportTicket(subject, description);
            closeModal('newSupportRequest');
            showToast("Support ticket created.");
        } catch (error) {
            console.error("Failed to create support ticket", error);
        }
    };

    // --- Password Management ---
    const handleChangePassword = async (oldPass: string, newPass: string) => {
        await api.changePassword(oldPass, newPass);
        showToast("Password changed successfully.");
    };
    
    const handleForgotPassword = async (email: string) => {
        await api.forgotPassword(email);
    };
    
    const handleResetPassword = async (password: string) => {
        const token = new URLSearchParams(window.location.search).get('resetToken');
        if (!token) {
             showToast("Invalid or missing reset token.");
             return;
        }
        await api.resetPassword(token, password);
        closeModal('resetPassword');
        showToast("Password reset successfully. Please log in.");
        // Clean URL
        window.history.pushState({}, '', window.location.pathname);
    };

    // --- Live Streaming ---
    const handleStartStream = async (title: string) => {
        try {
            const newStream = await api.startLiveStream(title);
            closeModal('goLive');
            setViewedLiveStream(newStream);
        } catch (error) {
            console.error("Failed to start stream", error);
        }
    };
    
    // --- Tipping ---
    const handleSendTip = async (postId: string, amount: number) => {
        try {
            await api.sendTip(postId, amount);
            const { user } = await api.getMe(); // Refresh user balance
            setCurrentUser(user);
            showToast(`Sent a $${amount} tip!`);
        } catch(error) {
            console.error("Tip failed:", error);
            showToast("Tip failed. Check your balance.");
        }
    };
    
    // --- Calling and WebRTC ---
    const handleInitiateCall = async (user: User, callType: 'video' | 'audio') => {
        setCallState({ user, status: 'outgoing', callType });
        const stream = await webRTCManager.getLocalStream();
        setLocalStream(stream);
        socketService.emit('outgoing_call', { fromUser: currentUser, toUserId: user.id, callType });
    };

    const handleEndCall = () => {
        if (callState) {
            socketService.emit('end_call', { toUserId: callState.user.id });
        }
        webRTCManager.hangup();
        setCallState(null);
        setLocalStream(null);
        setRemoteStream(null);
    };
    
    // --- Report ---
    const handleReport = (content: Post | User) => openModal('report', { content });
    const handleSubmitReport = async (reason: string, details: string) => {
        // Here you would call api.submitReport(content.id, contentType, reason, details);
        showToast("Report submitted. Thank you.");
        closeModal('report');
    };
    

    // --- Effect for Initial Load & Auth Check ---
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.setAuthToken(token);
                try {
                    const { user } = await api.getMe();
                    setCurrentUser(user);
                    socketService.connect(user.id);
                } catch (error) {
                    console.error("Session expired:", error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };
        checkAuth();
        
        // Check for password reset token in URL
        const resetToken = new URLSearchParams(window.location.search).get('resetToken');
        if (resetToken) {
            openModal('resetPassword', {});
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, fetchData]);
    
    // --- Effect for Socket.IO Listeners ---
    useEffect(() => {
        if (!currentUser) return;
        
        const handleNewNotification = (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            showToast(`New notification from ${notification.user.username}`);
        };

        const handleIncomingCall = ({ fromUser, callType }: { fromUser: User, callType: 'video' | 'audio' }) => {
            setCallState({ user: fromUser, status: 'incoming', callType });
        };

        socketService.on('new_notification', handleNewNotification);
        socketService.on('incoming_call', handleIncomingCall);
        // ... add other listeners for messages, etc.

        return () => {
            socketService.off('new_notification', handleNewNotification);
            socketService.off('incoming_call', handleIncomingCall);
        };
    }, [currentUser]);

    // --- Render Logic ---
    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
    }

    const mainContent = () => {
        switch (currentView) {
            case 'home': return <HomeView posts={feedPosts} stories={stories} currentUser={currentUser} suggestedUsers={sidebarData.suggestions} trendingTopics={sidebarData.trending} feedActivities={sidebarData.activity} sponsoredContent={sidebarData.sponsored} conversations={conversations} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', { content: post })} onViewStory={(story) => setViewedStory(story)} onViewLikes={(users) => openModal('viewLikes', { users })} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', { post })} onOptions={(post) => openModal('options', { post })} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => setSearchVisible(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => openModal('tip', {post})} onVote={handleVote} />;
            case 'explore': return <ExploreView posts={explorePosts} onViewPost={(post) => openModal('post', { post })} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={async (id) => {await api.toggleReelLike(id); await fetchData();}} onCommentOnReel={(reel) => openModal('reelComments', { reel })} onShareReel={(reel) => openModal('share', { content: reel })} />;
            case 'messages': return <MessagesView conversations={conversations} currentUser={currentUser} allUsers={allUsers} onNavigate={(view, user) => handleNavigate('profile', user)} onInitiateCall={handleInitiateCall} onUpdateConversation={handleUpdateConversation} />;
            case 'profile': return <ProfileView user={viewedUser || currentUser} posts={feedPosts.filter(p => p.user.id === (viewedUser?.id || currentUser.id))} reels={reels.filter(r => r.user.id === (viewedUser?.id || currentUser.id))} isCurrentUser={!viewedUser || viewedUser.id === currentUser.id} currentUser={currentUser} onEditProfile={() => openModal('editProfile')} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={handleUnfollow} onShowFollowers={(users) => openModal('followList', { title: 'Followers', users })} onShowFollowing={(users) => openModal('followList', { title: 'Following', users })} onEditPost={handleEditPost} onViewPost={(post) => openModal('post', { post })} onViewReel={(reel) => {}} onOpenCreateHighlightModal={() => openModal('createHighlight')} onMessage={(user) => {}} />;
            case 'settings': return <SettingsView currentUser={currentUser} onNavigate={handleNavigate} onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')} onChangePassword={() => openModal('changePassword')} onManageAccount={() => openModal('editProfile')} onToggleTwoFactor={() => openModal('twoFactor')} onGetVerified={() => openModal('getVerified')} onUpdateSettings={handleUpdateSettings}/>;
            case 'saved': return <SavedView posts={feedPosts.filter(p => p.isSaved)} onViewPost={(post) => openModal('post', { post })} />;
            case 'archive': return <ArchiveView posts={feedPosts.filter(p => p.isArchived)} onViewPost={(post) => openModal('post', { post })} onUnarchivePost={handleUnarchivePost}/>;
            case 'admin': return <AdminView />;
            case 'premium': return <PremiumView onSubscribe={() => openModal('payment')} testimonials={[]}/>;
            case 'premium-welcome': return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'activity': return <ActivityView activities={notifications}/>;
            case 'help': return <HelpCenterView articles={[]} onBack={() => handleNavigate(previousView)}/>;
            case 'support': return <SupportInboxView tickets={[]} onBack={() => handleNavigate(previousView)} onNewRequest={() => openModal('newSupportRequest')} />;
            case 'live': return <LiveStreamsView streams={liveStreams} onJoinStream={setViewedLiveStream}/>
            default: return <HomeView posts={feedPosts} stories={stories} currentUser={currentUser} suggestedUsers={sidebarData.suggestions} trendingTopics={sidebarData.trending} feedActivities={sidebarData.activity} sponsoredContent={sidebarData.sponsored} conversations={conversations} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', { content: post })} onViewStory={(story) => setViewedStory(story)} onViewLikes={(users) => openModal('viewLikes', { users })} onViewProfile={(user) => handleNavigate('profile', user)} onViewPost={(post) => openModal('post', { post })} onOptions={(post) => openModal('options', { post })} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => setSearchVisible(true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => openModal('tip', {post})} onVote={handleVote} />;
        }
    };
    
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="flex">
                <LeftSidebar 
                    currentUser={currentUser} 
                    currentView={currentView} 
                    onNavigate={handleNavigate} 
                    onShowSearch={() => setSearchVisible(true)}
                    onShowNotifications={() => setNotificationsVisible(true)}
                    onCreatePost={() => openModal('createPost')}
                    onSwitchAccount={() => openModal('accountSwitcher')}
                    onLogout={handleLogout}
                    onGoLive={() => openModal('goLive')}
                />
                <div className="flex-1 md:ml-[72px] lg:ml-64 flex flex-col">
                    <Header 
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onSwitchAccount={() => openModal('accountSwitcher')}
                        onCreatePost={() => openModal('createPost')}
                        onShowNotifications={() => setNotificationsVisible(true)}
                        onLogout={handleLogout}
                    />
                    {activeAnnouncement && <AnnouncementBanner announcement={activeAnnouncement} />}
                    <main className="flex-1">{mainContent()}</main>
                </div>
            </div>
            <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} />
            
            {/* --- Global Modals & Panels --- */}
            {viewedStory && <StoryViewer stories={stories} initialStoryIndex={stories.findIndex(s => s.id === viewedStory.id)} onClose={() => setViewedStory(null)} onNextUser={() => {}} onPrevUser={() => {}}/>}
            {viewedLiveStream && <LiveStreamView stream={viewedLiveStream} currentUser={currentUser} onClose={() => setViewedLiveStream(null)}/>}
            
            {activeModals.post && <PostModal post={activeModals.post.post} currentUser={currentUser} onClose={() => closeModal('post')} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', { content: post })} onViewLikes={(users) => openModal('viewLikes', { users })} onViewProfile={(user) => handleNavigate('profile', user)} onOptions={(post) => openModal('options', { post })} onFollow={handleFollow} onUnfollow={handleUnfollow} onTip={(post) => openModal('tip', {post})}/>}
            {activeModals.createPost && <CreatePostModal onClose={() => closeModal('createPost')} onCreatePost={handleCreatePost} allUsers={allUsers} currentUser={currentUser} />}
            {activeModals.createStory && <CreateStoryModal onClose={() => closeModal('createStory')} onCreateStory={handleCreateStory} />}
            {activeModals.accountSwitcher && <AccountSwitcherModal accounts={[currentUser]} currentUser={currentUser} onClose={() => closeModal('accountSwitcher')} onSwitchAccount={() => {}} onAddAccount={() => {}} />}
            {activeModals.share && <ShareModal content={activeModals.share.content} currentUser={currentUser} conversations={conversations} onClose={() => closeModal('share')} onShareSuccess={() => showToast("Shared successfully!")} />}
            {activeModals.viewLikes && <ViewLikesModal users={activeModals.viewLikes.users} currentUser={currentUser} onClose={() => closeModal('viewLikes')} onViewProfile={(user) => handleNavigate('profile', user)} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModals.followList && <FollowListModal title={activeModals.followList.title} users={activeModals.followList.users} currentUser={currentUser} onClose={() => closeModal('followList')} onViewProfile={(user) => handleNavigate('profile', user)} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModals.options && <PostWithOptionsModal post={activeModals.options.post} currentUser={currentUser} onClose={() => closeModal('options')} onUnfollow={(user) => handleUnfollow(user)} onFollow={handleFollow} onEdit={handleEditPost} onDelete={handleDeletePost} onArchive={handleArchivePost} onUnarchive={handleUnarchivePost} onReport={handleReport} onShare={(post) => openModal('share', { content: post })} onCopyLink={() => { navigator.clipboard.writeText(`${window.location.origin}/p/${activeModals.options.post.id}`); showToast("Link copied!"); }} onGoToPost={() => {}} onViewProfile={(user) => handleNavigate('profile', user)} />}
            {activeModals.unfollow && <UnfollowModal user={activeModals.unfollow.user} onCancel={() => closeModal('unfollow')} onConfirm={() => handleConfirmUnfollow(activeModals.unfollow.user)} />}
            {activeModals.editPost && <EditPostModal post={activeModals.editPost.post} onClose={() => closeModal('editPost')} onSave={handleUpdatePost} />}
            {activeModals.reelComments && <ReelCommentsModal reel={activeModals.reelComments.reel} currentUser={currentUser} onClose={() => closeModal('reelComments')} onPostComment={async (id, text) => {await api.addReelComment(id, text); await fetchData();}} onViewProfile={(user) => handleNavigate('profile', user)} />}
            {activeModals.createHighlight && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={() => closeModal('createHighlight')} onCreate={handleCreateHighlight} />}
            {activeModals.trends && <TrendsModal topics={sidebarData.trending} onClose={() => closeModal('trends')} />}
            {activeModals.suggestions && <SuggestionsModal users={sidebarData.suggestions} currentUser={currentUser} onClose={() => closeModal('suggestions')} onViewProfile={(user) => handleNavigate('profile', user)} onFollow={handleFollow} onUnfollow={handleUnfollow} />}
            {activeModals.editProfile && <EditProfileModal user={currentUser} onClose={() => closeModal('editProfile')} onSave={async (data) => {await api.updateProfile(data); const { user } = await api.getMe(); setCurrentUser(user); closeModal('editProfile');}} />}
            {activeModals.payment && <PaymentModal onClose={() => closeModal('payment')} onConfirmPayment={handleSubscribeToPremium} />}
            {activeModals.getVerified && <GetVerifiedModal onClose={() => closeModal('getVerified')} onSubmit={handleApplyForVerification} />}
            {activeModals.newSupportRequest && <NewSupportRequestModal onClose={() => closeModal('newSupportRequest')} onSubmit={handleNewSupportRequest} />}
            {activeModals.changePassword && <ChangePasswordModal onClose={() => closeModal('changePassword')} onSubmit={handleChangePassword} />}
            {activeModals.twoFactor && <TwoFactorAuthModal onClose={() => closeModal('twoFactor')} onEnable={async () => await api.enableTwoFactor()} />}
            {activeModals.report && <ReportModal content={activeModals.report.content} onClose={() => closeModal('report')} onSubmitReport={handleSubmitReport} />}
            {activeModals.forgotPassword && <ForgotPasswordModal onClose={() => closeModal('forgotPassword')} onSubmit={handleForgotPassword} />}
            {activeModals.resetPassword && <ResetPasswordModal onClose={() => closeModal('resetPassword')} onSubmit={handleResetPassword} />}
            {activeModals.tip && <TipModal post={activeModals.tip.post} onClose={() => closeModal('tip')} onSendTip={async (amount) => await handleSendTip(activeModals.tip.post.id, amount)} />}
            {activeModals.goLive && <GoLiveModal onClose={() => closeModal('goLive')} onStartStream={handleStartStream}/>}
            
            {isSearchVisible && <SearchView users={allUsers} onClose={() => setSearchVisible(false)} onViewProfile={(user) => handleNavigate('profile', user)} />}
            {isNotificationsVisible && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsVisible(false)} onViewProfile={(user) => handleNavigate('profile', user)} onMarkAsRead={() => {}} />}

            {callState && callState.status !== 'incoming' && (
                <CallModal 
                    user={callState.user} 
                    status={callState.status} 
                    callType={callState.callType}
                    onEndCall={handleEndCall}
                    localStream={localStream}
                    remoteStream={remoteStream}
                    isMuted={isMuted}
                    isCameraOff={isCameraOff}
                    onToggleMute={() => setIsMuted(prev => !prev)}
                    onToggleCamera={() => setIsCameraOff(prev => !prev)}
                />
            )}
            {callState && callState.status === 'incoming' && (
                <IncomingCallModal 
                    user={callState.user}
                    callType={callState.callType}
                    onAccept={() => {}} // This needs WebRTCManager integration
                    onDecline={handleEndCall}
                />
            )}
            
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                     <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};