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
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SearchView from './components/SearchView.tsx';
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';

// Other Components
import Toast from './components/Toast.tsx';

const App: React.FC = () => {
    // Global State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    
    // Sidebar State
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    
    // UI State
    const [currentView, setCurrentView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Modal State
    const [activeModals, setActiveModals] = useState<Record<string, any>>({});
    
    // Static data (fetched once)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);


    // Mock accounts for switcher
    const [accounts] = useState<User[]>([]);
    
    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    }, []);
    
    // Data Fetching
    const fetchData = useCallback(async () => {
        try {
            const [feedData, reelsData, sidebarData, users, convos, notifs, staticData] = await Promise.all([
                api.getFeed(),
                api.getReels(),
                api.getSidebarData(),
                api.getAllUsers(),
                api.getConversations(),
                api.getNotifications(),
                Promise.all([api.getTestimonials(), api.getHelpArticles(), api.getSupportTickets()])
            ]);
            setPosts(feedData.posts);
            setStories(feedData.stories);
            setReels(reelsData);
            setTrendingTopics(sidebarData.trendingTopics);
            setFeedActivities(sidebarData.feedActivities);
            setSponsoredContent(sidebarData.sponsoredContent);
            setConversations(sidebarData.conversations.length > 0 ? sidebarData.conversations : convos);
            setAllUsers(users);
            setNotifications(notifs);
            setTestimonials(staticData[0]);
            setHelpArticles(staticData[1]);
            setSupportTickets(staticData[2]);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            showToast("Failed to load data. Please refresh.");
        }
    }, [showToast]);
    
    useEffect(() => {
        if(currentUser) {
            fetchData();
            socketService.connect(currentUser.id);

            // --- Real-time Event Listeners ---
            socketService.on('post_updated', (updatedPost: Post) => {
                setPosts(current => current.map(p => p.id === updatedPost.id ? updatedPost : p));
            });
            socketService.on('post_deleted', ({ postId }: { postId: string }) => {
                setPosts(current => current.filter(p => p.id !== postId));
            });
            socketService.on('reel_updated', (updatedReel: Reel) => {
                setReels(current => current.map(r => r.id === updatedReel.id ? updatedReel : r));
            });
            socketService.on('user_updated', (updatedUser: User) => {
                if(currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
                if(profileUser?.id === updatedUser.id) setProfileUser(updatedUser);
                setAllUsers(current => current.map(u => u.id === updatedUser.id ? updatedUser : u));
            });

            return () => {
                socketService.disconnect();
                socketService.off('post_updated');
                socketService.off('post_deleted');
                socketService.off('reel_updated');
                socketService.off('user_updated');
            };
        }
    }, [currentUser, profileUser?.id, fetchData]);

    const handleLoginSuccess = async (user: User) => {
        try {
            const fullUser = await api.getCurrentUser(user.id);
            setCurrentUser(fullUser);
            setCurrentView('home');
        } catch (error) {
            console.error("Failed to fetch full user profile", error);
            showToast("Failed to complete login.");
        }
    };
    
    const handleLogout = () => setCurrentUser(null);
    
    // Navigation
    const handleNavigate = (view: View, user?: User) => {
        if (view === 'profile' && user) {
            setProfileUser(user);
        } else if (view === 'profile' && currentUser) {
            setProfileUser(currentUser);
        }
        setCurrentView(view);
        setActiveModals(m => ({...m, notifications: null, search: null}));
    };

    // Modal Management
    const openModal = (modalName: string, data: any = true) => setActiveModals(prev => ({...prev, [modalName]: data}));
    const closeModal = (modalName: string) => setActiveModals(prev => ({...prev, [modalName]: null}));

    // --- API-driven Actions ---
    const createOptimisticHandler = <T, U>(
        stateUpdater: React.Dispatch<React.SetStateAction<T[]>>,
        optimisticUpdate: (item: T, ...args: any[]) => T,
        apiCall: (...args: any[]) => Promise<U>,
        successMessage: string,
        errorMessage: string
    ) => async (itemId: string, ...args: any[]) => {
        if (!currentUser) return;
        const originalState: T[] = [];
        stateUpdater(current => {
            originalState.push(...current);
            return current.map(item => (item as any).id === itemId ? optimisticUpdate(item, ...args) : item);
        });
        try {
            await apiCall(itemId, currentUser.id, ...args);
            if(successMessage) showToast(successMessage);
        } catch (error) {
            console.error(errorMessage, error);
            showToast("Action failed. Please try again.");
            stateUpdater(originalState);
        }
    };
    
    const handleToggleLike = createOptimisticHandler<Post, Post>(
        setPosts,
        (post) => {
            const isLiked = post.likedBy.some(u => u.id === currentUser!.id);
            return {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                likedBy: isLiked ? post.likedBy.filter(u => u.id !== currentUser!.id) : [...post.likedBy, currentUser!]
            };
        },
        api.togglePostLike,
        '', 'Failed to toggle like'
    );
    
    const handleToggleSave = createOptimisticHandler<Post, Post>(
        setPosts,
        (post) => {
            const isSaved = post.savedBy.some(u => u.id === currentUser!.id);
            return {
                ...post,
                savedBy: isSaved ? post.savedBy.filter(u => u.id !== currentUser!.id) : [...post.savedBy, currentUser!]
            };
        },
        api.togglePostSave,
        'Post saved!', 'Failed to toggle save'
    );
    
    const handleComment = async (postId: string, text: string) => {
        try {
            await api.addComment(postId, currentUser!.id, text);
        } catch (error) {
            console.error("Failed to add comment", error);
            showToast("Could not post comment.");
        }
    };

    const handlePostReelComment = async (reelId: string, text: string) => {
        try {
            await api.postReelComment(reelId, currentUser!.id, text);
        } catch (error) {
            console.error("Failed to comment on reel", error);
            showToast("Could not post comment.");
        }
    };
    
    const handleLikeComment = async (commentId: string) => {
        try {
            await api.toggleCommentLike(commentId, currentUser!.id);
        } catch (error) {
            console.error("Failed to like comment", error);
            showToast("Action failed.");
        }
    };

    const handleFollow = async (userToFollow: User) => {
        if (!currentUser) return;
        try {
            await api.toggleFollow(userToFollow.id, currentUser.id);
            showToast(`Followed ${userToFollow.username}`);
            closeModal('unfollow');
        } catch (error) {
            console.error("Failed to follow", error);
            showToast(`Could not follow ${userToFollow.username}`);
        }
    };

    const handleCreatePost = async (media: Omit<PostMedia, 'id'>[], caption: string, location: string) => {
        if (!currentUser) return;
        try {
            await api.createPost({ userId: currentUser.id, media, caption, location });
            closeModal('createPost');
            showToast('Post created!');
            fetchData(); // Refresh feed
        } catch (error) {
            console.error("Failed to create post", error);
            showToast("Could not create post.");
        }
    };

    const handleCreateStory = async (storyItem: Omit<StoryItem, 'id'>) => {
        try {
            await api.createStory(storyItem);
            closeModal('createStory');
            showToast('Story posted!');
            fetchData(); // Refresh stories
        } catch(error) {
            console.error("Failed to create story", error);
            showToast("Could not post story.");
        }
    };

    const handleLikeReel = createOptimisticHandler<Reel, Reel>(
        setReels,
        (reel) => {
            const isLiked = reel.likedBy.some(u => u.id === currentUser!.id);
            return {
                ...reel,
                likes: isLiked ? reel.likes - 1 : reel.likes + 1,
                likedBy: isLiked ? reel.likedBy.filter(u => u.id !== currentUser!.id) : [...reel.likedBy, currentUser!]
            };
        },
        api.toggleReelLike,
        '', 'Failed to like reel'
    );

    const handleUpdateProfile = async (updatedData: Partial<User>) => {
        if (!currentUser) return;
        try {
            await api.updateUser(currentUser.id, updatedData);
            closeModal('editProfile');
            showToast("Profile updated!");
        } catch (error) {
            console.error("Failed to update profile", error);
            showToast("Could not update profile.");
        }
    };

    const handleChangePassword = async (passwords: { current: string, new: string }) => {
        if (!currentUser) return;
        try {
            await api.updatePassword(currentUser.id, passwords);
            closeModal('changePassword');
            showToast("Password changed successfully!");
        } catch (error: any) {
            console.error("Failed to change password", error);
            showToast(error.message || "Could not change password.");
            throw error; // Re-throw to keep modal open on failure
        }
    };

    const handleUpdateSettings = async (settings: Partial<User['notificationSettings'] & { isPrivate: boolean }>) => {
        if (!currentUser) return;
        try {
            await api.updateUserSettings(currentUser.id, settings);
            showToast('Settings updated');
        } catch (error) {
            console.error('Failed to update settings', error);
            showToast('Could not update settings.');
        }
    };
    
    const handleDeletePost = async (post: Post) => {
        try {
            await api.deletePost(post.id);
            showToast('Post deleted');
        } catch (error) {
            console.error('Failed to delete post', error);
            showToast('Could not delete post.');
        }
    };
    
    const handleEditPost = async (post: Post) => {
        try {
            await api.editPost(post.id, { caption: post.caption, location: post.location || '' });
            closeModal('editPost');
            showToast('Post updated!');
        } catch (error) {
            console.error('Failed to edit post', error);
            showToast('Could not update post.');
        }
    };

    const handleToggleArchive = async (post: Post) => {
        try {
            await api.toggleArchivePost(post.id);
            showToast(post.isArchived ? 'Post unarchived' : 'Post archived');
        } catch (error) {
            console.error('Failed to toggle archive', error);
            showToast('Action failed.');
        }
    };

    const handleCreateHighlight = async (title: string, storyIds: string[]) => {
        if (!currentUser) return;
        try {
            await api.createHighlight(currentUser.id, title, storyIds);
            closeModal('createHighlight');
            showToast(`Created highlight "${title}"`);
        } catch (error) {
            console.error("Failed to create highlight", error);
            showToast("Could not create highlight.");
        }
    };

    const handleSubmitSupportTicket = async (subject: string, description: string) => {
        if (!currentUser) return;
        try {
            await api.createSupportTicket(currentUser.id, subject, description);
            closeModal('newSupportRequest');
            showToast('Support ticket submitted!');
        } catch (error) {
            console.error("Failed to submit ticket", error);
            showToast("Could not submit ticket.");
        }
    };

    const handleReport = async (reason: string, content: Post | Reel | User) => {
        if (!currentUser) return;
        try {
            const response = await api.submitReport(currentUser.id, content.id, reason);
            closeModal('report');
            showToast(response.message);
        } catch (error) {
            console.error("Failed to submit report", error);
            showToast("Could not submit report.");
        }
    };

    const handleShareAsMessage = async (recipient: User, content: Post | Reel | Story) => {
        if (!currentUser) return;
        try {
            await api.shareAsMessage(currentUser.id, recipient.id, content);
            showToast(`Shared with ${recipient.username}`);
        } catch(error) {
            console.error("Failed to share content", error);
            showToast(`Could not share with ${recipient.username}`);
        }
    };

    const handleStoryReply = (storyUser: User, replyText: string) => {
        if (!currentUser) return;
        
        const existingConvo = conversations.find(c => c.participants.some(p => p.id === storyUser.id));
        const conversationId = existingConvo ? existingConvo.id : `convo-${Date.now()}`;
        
// Fix: Explicitly type newMessage as Message to ensure type compatibility.
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            content: replyText,
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true,
        };

        // Emit via socket for real-time delivery
        socketService.emit('send_message', { conversationId, message: newMessage, recipientId: storyUser.id, sender: currentUser });
        
        if (!existingConvo) {
             // Optimistically create the conversation on the client side
             const newConvo: Conversation = {
                id: conversationId,
                participants: [currentUser, storyUser],
                messages: [newMessage],
            };
            setConversations([newConvo, ...conversations]);
        }
       
        showToast(`Replied to ${storyUser.username}`);
    };

    const renderView = () => {
        if (!currentUser) return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
        
        const suggestedUsers = allUsers.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id));

        switch(currentView) {
            case 'home': return <HomeView posts={posts} stories={stories} currentUser={currentUser} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onViewStory={(story) => openModal('story', {stories: stories.filter(s => s.stories.length > 0), startIndex: stories.filter(s => s.stories.length > 0).findIndex(s => s.id === story.id)})} onViewPost={(post) => openModal('post', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => handleNavigate('profile', user)} onOptions={(post) => openModal('postOptions', post)} onShare={(post) => openModal('share', post)} suggestedUsers={suggestedUsers} trendingTopics={trendingTopics} feedActivities={feedActivities} sponsoredContent={sponsoredContent} conversations={conversations} onShowSuggestions={() => openModal('suggestions')} onShowTrends={() => openModal('trends')} onCreateStory={() => openModal('createStory')} onShowSearch={() => openModal('search', true)} onNavigate={handleNavigate} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} />;
            case 'explore': return <ExploreView posts={posts.slice().reverse()} onViewPost={(post) => openModal('post', post)} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={handleLikeReel} onCommentOnReel={(reel) => openModal('reelComments', reel)} onShareReel={(reel) => openModal('share', reel)} />;
            case 'messages': return <MessagesView conversations={conversations} currentUser={currentUser} onNavigate={handleNavigate} allUsers={allUsers.filter(u => u.id !== currentUser.id)} />;
            case 'profile': return <ProfileView user={profileUser!} posts={posts.filter(p => p.user.id === profileUser!.id && !p.isArchived)} reels={reels.filter(r => r.user.id === profileUser!.id)} isCurrentUser={profileUser!.id === currentUser.id} currentUser={currentUser} onEditProfile={() => openModal('editProfile')} onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} onShowFollowers={(users) => openModal('followList', {title: 'Followers', users})} onShowFollowing={(users) => openModal('followList', {title: 'Following', users})} onEditPost={(post) => openModal('editPost', post)} onViewPost={(post) => openModal('post', post)} onViewReel={(reel) => showToast(`Viewing reel ${reel.id}`)} onOpenCreateHighlightModal={() => openModal('createHighlight')} onMessage={(user) => showToast(`Messaging ${user.username}`)} />;
            case 'settings': return <SettingsView currentUser={currentUser} onNavigate={handleNavigate} onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')} onChangePassword={() => openModal('changePassword')} onManageAccount={() => openModal('editProfile')} onToggleTwoFactor={() => openModal('2fa')} onGetVerified={() => openModal('getVerified')} onUpdateSettings={handleUpdateSettings} />;
            case 'saved': return <SavedView posts={posts.filter(p => p.savedBy.some(u => u.id === currentUser.id))} onViewPost={(post) => openModal('post', post)} />;
            case 'premium': return <PremiumView onShowPaymentModal={() => openModal('payment')} isCurrentUserPremium={currentUser.isPremium} testimonials={testimonials} />;
            case 'archive': return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={(post) => openModal('post', post)} onUnarchivePost={handleToggleArchive} />;
            case 'activity': return <ActivityView activities={notifications} />;
            case 'premium-welcome': return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help': return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support': return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => openModal('newSupportRequest')} />;
            default: return <div/>;
        }
    };

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => openModal('forgotPassword')} />;
    }
    
    const suggestedUsers = allUsers.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id));

    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <div className="md:pl-[72px] lg:pl-64">
                <LeftSidebar currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onShowSearch={() => openModal('search')} onShowNotifications={() => openModal('notifications')} onCreatePost={() => openModal('createPost')} onSwitchAccount={() => openModal('accountSwitcher')} onLogout={handleLogout} />
                <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => openModal('accountSwitcher')} onCreatePost={() => openModal('createPost')} onShowNotifications={() => openModal('notifications')} onLogout={handleLogout} />
                <main className="container mx-auto">
                    {renderView()}
                </main>
                <BottomNav currentUser={currentUser} currentView={currentView} onNavigate={handleNavigate} onCreatePost={() => openModal('createPost')} />
            </div>

            {/* Modals */}
            {activeModals.createPost && <CreatePostModal onClose={() => closeModal('createPost')} onCreatePost={handleCreatePost} />}
            {activeModals.post && <PostModal post={activeModals.post} currentUser={currentUser} onClose={() => closeModal('post')} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => openModal('share', post)} onViewLikes={(users) => openModal('viewLikes', users)} onViewProfile={(user) => {closeModal('post'); handleNavigate('profile', user);}} onOptions={(post) => openModal('postOptions', post)} />}
            {activeModals.story && <StoryViewer stories={activeModals.story.stories} startIndex={activeModals.story.startIndex} onClose={() => closeModal('story')} onViewProfile={(user) => {closeModal('story'); handleNavigate('profile', user);}} onReply={handleStoryReply} onShare={(story) => {closeModal('story'); openModal('share', story)}} />}
            {activeModals.accountSwitcher && <AccountSwitcherModal accounts={[currentUser, ...accounts]} currentUser={currentUser} onClose={() => closeModal('accountSwitcher')} onSwitchAccount={(id) => showToast(`Switched to account ${id}`)} onAddAccount={() => showToast('Add account clicked')} />}
            {activeModals.notifications && <NotificationsPanel notifications={notifications} onClose={() => closeModal('notifications')} />}
            {activeModals.search && <SearchView users={allUsers} onClose={() => closeModal('search')} onViewProfile={(user) => {closeModal('search'); handleNavigate('profile', user);}} />}
            {activeModals.share && <ShareModal content={activeModals.share} users={allUsers.filter(u => u.id !== currentUser.id)} onClose={() => closeModal('share')} onShareAsMessage={handleShareAsMessage} onCopyLink={() => {showToast('Link copied!');}} />}
            {activeModals.viewLikes && <ViewLikesModal users={activeModals.viewLikes} currentUser={currentUser} onClose={() => closeModal('viewLikes')} onViewProfile={(user) => {closeModal('viewLikes'); handleNavigate('profile', user);}} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} />}
            {activeModals.followList && <FollowListModal {...activeModals.followList} currentUser={currentUser} onClose={() => closeModal('followList')} onViewProfile={(user) => {closeModal('followList'); handleNavigate('profile', user);}} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)} />}
            {activeModals.editProfile && <EditProfileModal user={currentUser} onClose={() => closeModal('editProfile')} onSave={handleUpdateProfile} />}
            {activeModals.unfollow && <UnfollowModal user={activeModals.unfollow} onCancel={() => closeModal('unfollow')} onConfirm={() => handleFollow(activeModals.unfollow)} />}
            {activeModals.postOptions && <PostWithOptionsModal post={activeModals.postOptions} currentUser={currentUser} onClose={() => closeModal('postOptions')} onUnfollow={handleFollow} onFollow={handleFollow} onEdit={(post) => openModal('editPost', post)} onDelete={handleDeletePost} onArchive={handleToggleArchive} onReport={(content) => openModal('report', content)} onShare={(post) => openModal('share', post)} onCopyLink={() => showToast('Link copied')} onViewProfile={(user) => handleNavigate('profile', user)} onGoToPost={(post) => openModal('post', post)} />}
            {activeModals.reelComments && <ReelCommentsModal reel={activeModals.reelComments} currentUser={currentUser} onClose={() => closeModal('reelComments')} onPostComment={handlePostReelComment} onLikeComment={handleLikeComment} onViewProfile={(user) => handleNavigate('profile', user)} />}
            {activeModals.createStory && <CreateStoryModal onClose={() => closeModal('createStory')} onCreateStory={handleCreateStory} />}
            {activeModals.createHighlight && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={() => closeModal('createHighlight')} onCreate={handleCreateHighlight} />}
            {activeModals.trends && <TrendsModal topics={trendingTopics} onClose={() => closeModal('trends')} />}
            {activeModals.suggestions && <SuggestionsModal users={suggestedUsers} currentUser={currentUser} onClose={() => closeModal('suggestions')} onViewProfile={(user) => handleNavigate('profile', user)} onFollow={handleFollow} onUnfollow={(user) => openModal('unfollow', user)}/>}
            {activeModals.payment && <PaymentModal onClose={() => closeModal('payment')} onConfirmPayment={() => {setCurrentUser({...currentUser, isPremium: true}); closeModal('payment'); handleNavigate('premium-welcome');}} />}
            {activeModals.getVerified && <GetVerifiedModal onClose={() => closeModal('getVerified')} onSubmit={() => {showToast('Verification application submitted!'); closeModal('getVerified');}} />}
            {activeModals.changePassword && <ChangePasswordModal onClose={() => closeModal('changePassword')} onSave={handleChangePassword} />}
            {activeModals.twoFA && <TwoFactorAuthModal onClose={() => closeModal('2fa')} onEnable={() => {showToast('Two-factor authentication enabled!'); closeModal('2fa');}} />}
            {activeModals.newSupportRequest && <NewSupportRequestModal onClose={() => closeModal('newSupportRequest')} onSubmit={handleSubmitSupportTicket} />}
            {activeModals.forgotPassword && <ForgotPasswordModal onClose={() => closeModal('forgotPassword')} onSubmit={async (id) => {await api.forgotPassword(id); showToast('Password reset link sent!'); closeModal('forgotPassword');}} />}
            {activeModals.resetPassword && <ResetPasswordModal onClose={() => closeModal('resetPassword')} onSubmit={async (pw) => {showToast('Password has been reset.'); closeModal('resetPassword');}} />}
            {activeModals.report && <ReportModal content={activeModals.report} onClose={() => closeModal('report')} onSubmitReport={handleReport} />}
            {activeModals.editPost && <EditPostModal post={activeModals.editPost} onClose={() => closeModal('editPost')} onSave={handleEditPost} />}
            
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};

export default App;