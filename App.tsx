import React, { useState, useEffect, useCallback } from 'react';
import HomeView from './components/HomeView.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import PostModal from './components/PostModal.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import ReportModal from './components/ReportModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import ArchiveView from './components/ArchiveView.tsx';
import PremiumView from './components/PremiumView.tsx';
import ActivityView from './components/ActivityView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import MessagesView from './MessagesView.tsx';
import AuthView from './components/AuthView.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import Toast from './components/Toast.tsx';
import CallModal from './components/CallModal.tsx';
import NewMessageModal from './components/NewMessageModal.tsx';

import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

import type { User, Post, Story, Reel, View, Comment, Post as PostType, Reel as ReelType, StoryItem, SupportTicket, Conversation, Message, Activity, HelpArticle, Testimonial, TrendingTopic, FeedActivity, SponsoredContent, Notification } from './types.ts';

const App: React.FC = () => {
    // --- STATE ---
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewedProfile, setViewedProfile] = useState<User | null>(null);

    // Data states
    const [appData, setAppData] = useState<any>(null); // To hold all static data
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

    // Modal states
    const [modal, setModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [conversationToSelect, setConversationToSelect] = useState<string | null>(null);

    // --- EFFECTS ---
    const fetchAppData = async (userId: string) => {
        setIsLoading(true);
        try {
            const data = await api.getAppData(userId);
            setAppData(data);
            setPosts(data.posts);
            setStories(data.stories);
            setReels(data.reels);
            setAllUsers(data.users);
            setConversations(data.conversations);
            setNotifications(data.notifications);
            setFeedActivities(data.feedActivities);
            setSupportTickets(data.supportTickets);
        } catch (error) {
            console.error("Failed to fetch app data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // This effect runs only when isAuthenticated and currentUser change
        if (isAuthenticated && currentUser) {
            fetchAppData(currentUser.id);
            socketService.connect(currentUser.id);

            socketService.on('receive_message', (data: { conversation: Conversation }) => {
                const { conversation: updatedConvo } = data;
                 setConversations(prev => {
                    const exists = prev.some(c => c.id === updatedConvo.id);
                    if (exists) {
                        return prev.map(c => c.id === updatedConvo.id ? updatedConvo : c);
                    }
                    return [updatedConvo, ...prev];
                });
            });
            
        } else {
            socketService.disconnect();
        }
        
        return () => {
            socketService.off('receive_message');
        }
    }, [isAuthenticated, currentUser?.id]);


    // --- HELPERS ---
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    }
    
    const closeModal = () => {
        setModal(null);
        setModalData(null);
    }

    // --- EVENT HANDLERS ---
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentView('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        socketService.disconnect();
    }
    
    const handleSwitchAccount = (userId: string) => {
        const userToSwitch = allUsers.find(u => u.id === userId);
        if (userToSwitch) {
            handleLoginSuccess(userToSwitch);
            closeModal();
            showToast(`Switched to @${userToSwitch.username}`);
        }
    }

    const handleNavigate = (view: View, data?: any) => {
        if (view === 'profile' && data) {
            setViewedProfile(data);
        } else if (view === 'profile' && !data) {
            setViewedProfile(currentUser);
        } else {
            setViewedProfile(null);
        }
        setCurrentView(view);
        closeModal();
    }
    
    const handleStartConversation = async (user: User) => {
        if (!currentUser) return;
        try {
            const conversation = await api.findOrCreateConversation(currentUser.id, user.id);
            if (!conversations.some(c => c.id === conversation.id)) {
                setConversations(prev => [conversation, ...prev]);
            }
            setConversationToSelect(conversation.id);
            handleNavigate('messages');
        } catch (error) {
            console.error("Failed to start conversation:", error);
            showToast("Could not start conversation.");
        }
        closeModal();
    };

    // --- CRUD Handlers ---

    const handleToggleLike = async (postId: string) => {
        if(!currentUser) return;
        // Optimistic update
        setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
        try {
            const updatedPost = await api.togglePostLike(postId, currentUser.id);
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // Revert optimistic update
            setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes + 1 : p.likes - 1 } : p));
        }
    };
    
    const handleLikeReel = async (reelId: string) => {
        if(!currentUser) return;
        setReels(reels.map(r => r.id === reelId ? {...r, likedBy: [...r.likedBy, currentUser], likes: r.likes + 1} : r)); // Quick optimistic update
        try {
            const updatedReel = await api.toggleReelLike(reelId, currentUser.id);
            setReels(reels.map(r => r.id === reelId ? updatedReel : r));
        } catch (error) {
            console.error("Failed to like reel:", error);
        }
    };
    
    const handleFollow = async (userToFollow: User) => {
        if (!currentUser) return;
        // Optimistic
        const updatedUser = {...currentUser, following: [...currentUser.following, userToFollow]};
        setCurrentUser(updatedUser);
        try {
            await api.followUser(currentUser.id, userToFollow.id);
            showToast(`Followed @${userToFollow.username}`);
        } catch (error) {
            setCurrentUser(currentUser); // Revert
            showToast(`Could not follow @${userToFollow.username}`);
        }
    };

    const handleUnfollow = (userToUnfollow: User) => {
        if (!currentUser) return;
        // Optimistic
        const updatedUser = {...currentUser, following: currentUser.following.filter(u => u.id !== userToUnfollow.id)};
        setCurrentUser(updatedUser);
        try {
            api.unfollowUser(currentUser.id, userToUnfollow.id);
            showToast(`Unfollowed @${userToUnfollow.username}`);
        } catch (error) {
            setCurrentUser(currentUser); // Revert
            showToast(`Could not unfollow @${userToUnfollow.username}`);
        }
        closeModal();
    };

    const handleUpdateSettings = async (settings: Partial<User['notificationSettings'] & { isPrivate: boolean }>) => {
        if(!currentUser) return;
        const updatedUser = { ...currentUser, ...settings, notificationSettings: { ...currentUser.notificationSettings, ...settings } };
        setCurrentUser(updatedUser);
        try {
            await api.updateUserSettings(currentUser.id, settings);
            showToast("Settings updated.");
        } catch (error) {
            setCurrentUser(currentUser); // Revert
            showToast("Failed to update settings.");
        }
    };
    
    const handleUpdateUserRelationship = async (targetUser: User, action: 'mute' | 'unmute' | 'block' | 'unblock') => {
        if (!currentUser) return;
        try {
            const updatedCurrentUser = await api.updateUserRelationship(currentUser.id, targetUser.id, action);
            setCurrentUser(updatedCurrentUser);
            showToast(`User has been ${action}ed.`);
        } catch (error) {
            showToast(`Failed to ${action} user.`);
        }
    };

    const handleEditPost = async (postId: string, newCaption: string) => {
        try {
            const updatedPost = await api.editPost(postId, newCaption);
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
            closeModal();
            showToast("Post updated.");
        } catch (error) {
            showToast("Failed to update post.");
        }
    };
    
    const handleDeletePost = async (post: Post) => {
        setPosts(posts.filter(p => p.id !== post.id));
        closeModal();
        try {
            await api.deletePost(post.id);
            showToast("Post deleted.");
        } catch (error) {
            setPosts(posts); // Revert
            showToast("Failed to delete post.");
        }
    };
    
    const handleArchivePost = async (post: Post, isArchiving: boolean = true) => {
        if(!currentUser) return;
        try {
            const updatedPost = isArchiving ? await api.archivePost(post.id, currentUser.id) : await api.unarchivePost(post.id, currentUser.id);
            setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
            closeModal();
            showToast(isArchiving ? "Post archived." : "Post unarchived.");
        } catch (error) {
             showToast(isArchiving ? "Failed to archive." : "Failed to unarchive.");
        }
    };

    const handleCreatePost = async (postData: any) => {
        if(!currentUser) return;
        try {
            const newPost = await api.createPost({ ...postData, userId: currentUser.id });
            setPosts([newPost, ...posts]);
            closeModal();
            showToast("Post created successfully!");
        } catch(e) {
            showToast("Failed to create post.");
        }
    }
    
    const handleCreateStory = async (storyItem: Omit<StoryItem, 'id'>) => {
        if(!currentUser) return;
        try {
            const updatedStory = await api.createStory(currentUser.id, storyItem);
            setStories(prev => {
                const existing = prev.find(s => s.user.id === currentUser.id);
                if (existing) {
                    return prev.map(s => s.user.id === currentUser.id ? updatedStory : s);
                }
                return [updatedStory, ...prev];
            });
            closeModal();
            showToast("Story shared!");
        } catch (e) {
            showToast("Failed to share story.");
        }
    };

    const handleCreateHighlight = async (title: string, storyIds: string[]) => {
        if(!currentUser) return;
        try {
            const updatedUser = await api.createHighlight(currentUser.id, title, storyIds);
            setCurrentUser(updatedUser);
            closeModal();
            showToast("Highlight created!");
        } catch (e) {
            showToast("Failed to create highlight.");
        }
    };
    
    const handleSubmitSupportTicket = async (subject: string, description: string) => {
        if(!currentUser) return;
        try {
            const newTicket = await api.createSupportTicket(currentUser.id, subject, description);
            setSupportTickets(prev => [newTicket, ...prev]);
            closeModal();
            showToast("Support ticket submitted.");
        } catch (e) {
            showToast("Failed to submit ticket.");
        }
    };
    
// Fix: Use `contentType` from `modalData` instead of deriving it from `type`.
    const handleSubmitReport = async (reason: string) => {
        if(!currentUser || !modalData?.content) return;
        const { content, contentType } = modalData;
        
        try {
            await api.reportContent(currentUser.id, content.id, contentType, reason);
            showToast("Report submitted. Thank you.");
        } catch(e) {
            showToast("Failed to submit report.");
        }
        closeModal();
    };


    // --- RENDER LOGIC ---

    if (!isAuthenticated || !currentUser) {
        return (
            <>
                <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setModal('forgot-password')} />
                {modal === 'forgot-password' && <ForgotPasswordModal 
                    onClose={closeModal} 
                    onSubmit={async (identifier) => {
                        await api.forgotPassword(identifier);
                        showToast("If an account exists, a reset link has been sent.");
                        setModal('reset-password');
                        setModalData({ identifier });
                    }} 
                />}
                {modal === 'reset-password' && <ResetPasswordModal 
                    onClose={closeModal}
                    onSubmit={async (password) => {
                        await api.resetPassword(modalData.identifier, password);
                        showToast("Password reset successfully. Please log in.");
                        closeModal();
                    }}
                />}
            </>
        );
    }
    
    if (isLoading || !appData) {
        return <div className="h-screen w-screen flex items-center justify-center text-white">Loading...</div>;
    }
    
    const renderView = () => {
        const profileUser = viewedProfile || currentUser;
// Fix: Correct shorthand property initialization for `onNavigate` and `onFollow`.
        const viewProps = { currentUser, onNavigate: handleNavigate, onFollow: handleFollow, onUnfollow: (user: User) => setModalData({ type: 'unfollow', content: user }), onViewProfile: (user: User) => handleNavigate('profile', user) };
        switch(currentView) {
            case 'home':
                return <HomeView 
                    {...viewProps}
                    posts={posts.filter(p => !p.isArchived)} 
                    stories={stories} 
                    suggestedUsers={allUsers.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id)).slice(0,5)}
                    trendingTopics={appData.trendingTopics}
                    feedActivities={feedActivities}
                    sponsoredContent={appData.sponsoredContent}
                    conversations={conversations}
                    onToggleLike={handleToggleLike}
                    onToggleSave={()=>{}}
                    onComment={()=>{}}
                    onShare={(content) => setModalData({ type: 'share', content })}
                    onViewStory={(story) => setModalData({ type: 'story-viewer', content: story })}
                    onViewLikes={(users) => setModalData({ type: 'likes', content: users })}
                    onViewPost={(post) => setModalData({ type: 'view-post', content: post })}
                    onOptions={(post) => setModalData({ type: 'post-options', content: post })}
                    onShowSuggestions={() => setModal('suggestions')}
                    onShowTrends={() => setModal('trends')}
                    onCreateStory={() => setModal('create-story')}
                    onShowSearch={() => setModal('search')}
                />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={(post) => setModalData({ type: 'view-post', content: post })} />;
            case 'reels':
                return <ReelsView 
                    reels={reels} 
                    currentUser={currentUser}
                    onLikeReel={handleLikeReel}
                    onCommentOnReel={(reel) => setModalData({ type: 'reel-comments', content: reel })}
                    onShareReel={(reel) => setModalData({ type: 'share', content: reel })}
                />;
            case 'messages':
                return <MessagesView 
                    conversations={conversations}
                    setConversations={setConversations}
                    currentUser={currentUser}
                    onSendMessage={(msg) => {}}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onInitiateCall={(user, type) => setModalData({ type: 'call', content: { user, type } })}
                    onUpdateUserRelationship={handleUpdateUserRelationship}
// Fix: Add `onReportUser` prop to enable reporting from chat.
                    onReportUser={(user) => { setModalData({ content: user, contentType: 'user' }); setModal('report'); }}
                    onNewMessage={() => setModal('new-message')}
                    conversationToSelect={conversationToSelect}
                    setConversationToSelect={setConversationToSelect}
                />
            case 'profile':
                if (!profileUser) return null;
                return <ProfileView 
                    {...viewProps}
                    user={profileUser}
                    posts={posts.filter(p => p.user.id === profileUser.id && !p.isArchived)}
                    reels={reels.filter(r => r.user.id === profileUser.id)}
                    isCurrentUser={profileUser.id === currentUser.id}
                    onEditProfile={() => setModal('edit-profile')}
                    onViewArchive={() => handleNavigate('archive')}
                    onShowFollowers={(users) => setModalData({ type: 'followers', content: users })}
                    onShowFollowing={(users) => setModalData({ type: 'following', content: users })}
                    onEditPost={(post) => setModalData({ type: 'edit-post', content: post })}
                    onViewPost={(post) => setModalData({ type: 'view-post', content: post })}
                    onViewReel={(reel) => {
                        const reelIndex = reels.findIndex(r => r.id === reel.id);
                        handleNavigate('reels', { startIndex: reelIndex });
                    }}
                    onOpenCreateHighlightModal={() => setModal('create-highlight')}
                    onMessage={handleStartConversation}
                />;
             case 'saved':
                return <SavedView posts={currentUser.savedPosts || []} onViewPost={(post) => setModalData({ type: 'view-post', content: post })} />;
            case 'settings':
                return <SettingsView 
                    currentUser={currentUser}
                    onNavigate={handleNavigate}
                    onShowHelp={() => handleNavigate('help')}
                    onShowSupport={() => handleNavigate('support')}
                    onChangePassword={() => setModal('change-password')}
                    onManageAccount={() => setModal('edit-profile')}
                    onGetVerified={() => setModal('get-verified')}
                    onUpdateSettings={handleUpdateSettings}
                    onToggleTwoFactor={() => setModal('2fa')}
                />;
            case 'archive':
                return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={(post) => setModalData({ type: 'view-post', content: post })} onUnarchivePost={(post) => handleArchivePost(post, false)} />;
            case 'premium':
                return <PremiumView 
                    isCurrentUserPremium={currentUser.isPremium} 
                    testimonials={appData.testimonials} 
                    onShowPaymentModal={() => setModal('payment')} 
                />;
            case 'premium-welcome':
                return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'activity':
                return <ActivityView activities={notifications} />;
            case 'help':
                return <HelpCenterView articles={appData.helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support':
                return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setModal('new-support-request')} />;
            default: return <div/>;
        }
    }
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Header 
                currentUser={currentUser} 
                onNavigate={handleNavigate} 
                onSwitchAccount={() => setModal('account-switcher')}
                onCreatePost={() => setModal('create-post')}
                onShowNotifications={() => setModal('notifications')}
                onLogout={handleLogout}
            />
            <LeftSidebar 
                 currentUser={currentUser}
                 currentView={currentView}
                 onNavigate={handleNavigate}
                 onShowSearch={() => setModal('search')}
                 onShowNotifications={() => setModal('notifications')}
                 onCreatePost={() => setModal('create-post')}
                 onSwitchAccount={() => setModal('account-switcher')}
                 onLogout={handleLogout}
            />
            <main className="md:pl-[72px] lg:pl-64">
                {renderView()}
            </main>
            <BottomNav 
                 currentView={currentView}
                 onNavigate={handleNavigate}
                 onCreatePost={() => setModal('create-post')}
                 currentUser={currentUser}
            />
            
            {/* --- Modals & Panels --- */}
            {modal === 'create-post' && <CreatePostModal currentUser={currentUser} onClose={closeModal} onCreatePost={handleCreatePost} />}
            {modalData?.type === 'view-post' && <PostModal post={modalData.content} currentUser={currentUser} onClose={closeModal} onToggleLike={()=>{}} onToggleSave={()=>{}} onComment={()=>{}} onToggleCommentLike={()=>{}} onShare={(c) => setModalData({ type: 'share', content: c })} onViewLikes={(u) => setModalData({ type: 'likes', content: u })} onViewProfile={(u) => handleNavigate('profile', u)} onOptions={(p) => setModalData({ type: 'post-options', content: p })} />}
            {modalData?.type === 'story-viewer' && <StoryViewer stories={stories} startIndex={stories.findIndex(s => s.id === modalData.content.id)} onClose={closeModal} onViewProfile={(u) => handleNavigate('profile', u)} onReply={(u, c) => showToast(`Replied to ${u.username}`)} onShare={(c) => setModalData({ type: 'share', content: c })} />}
// Fix: Added missing props to `PostWithOptionsModal` to enable all actions.
            {modalData?.type === 'post-options' && <PostWithOptionsModal post={modalData.content} currentUser={currentUser} onClose={closeModal} onUnfollow={handleUnfollow} onFollow={handleFollow} onEdit={(p) => setModalData({ type: 'edit-post', content: p })} onDelete={handleDeletePost} onArchive={(p) => handleArchivePost(p, true)} onReport={(post) => { setModalData({ content: post, contentType: 'post' }); setModal('report'); }} onShare={(content) => setModalData({ type: 'share', content })} onCopyLink={() => { navigator.clipboard.writeText(`${window.location.origin}/post/${modalData.content.id}`); showToast("Link copied!"); }} onViewProfile={(u) => handleNavigate('profile', u)} onGoToPost={(p) => setModalData({ type: 'view-post', content: p })} />}
            {modalData?.type === 'unfollow' && <UnfollowModal user={modalData.content} onConfirm={() => handleUnfollow(modalData.content)} onCancel={closeModal}/>}
            {modalData?.type === 'edit-post' && <EditPostModal post={modalData.content} onClose={closeModal} onSave={handleEditPost} />}
            {modal === 'report' && <ReportModal onClose={closeModal} onSubmitReport={handleSubmitReport} />}
            {modalData?.type === 'likes' && <ViewLikesModal users={modalData.content} currentUser={currentUser} onClose={closeModal} onViewProfile={(u) => handleNavigate('profile', u)} onFollow={handleFollow} onUnfollow={(u) => setModalData({ type: 'unfollow', content: u })} />}
            {modalData?.type === 'followers' && <FollowListModal title="Followers" users={modalData.content} currentUser={currentUser} onClose={closeModal} onViewProfile={(u) => handleNavigate('profile', u)} onFollow={handleFollow} onUnfollow={(u) => setModalData({ type: 'unfollow', content: u })} />}
            {modalData?.type === 'following' && <FollowListModal title="Following" users={modalData.content} currentUser={currentUser} onClose={closeModal} onViewProfile={(u) => handleNavigate('profile', u)} onFollow={handleFollow} onUnfollow={(u) => setModalData({ type: 'unfollow', content: u })} />}
            {modalData?.type === 'share' && <ShareModal content={modalData.content} users={currentUser.following} onClose={closeModal} onSendShare={() => {}} onCopyLink={() => {}} />}
            {modalData?.type === 'reel-comments' && <ReelCommentsModal reel={modalData.content} currentUser={currentUser} onClose={closeModal} onPostComment={() => {}} onLikeComment={() => {}} onViewProfile={(u) => handleNavigate('profile', u)} />}
            {modalData?.type === 'call' && <CallModal user={modalData.content.user} type={modalData.content.type} onClose={closeModal} />}

            {modal === 'account-switcher' && <AccountSwitcherModal accounts={allUsers.slice(0,3)} currentUser={currentUser} onClose={closeModal} onSwitchAccount={handleSwitchAccount} onAddAccount={() => handleLogout()} />}
            {modal === 'notifications' && <NotificationsPanel notifications={notifications} onClose={closeModal} />}
            {modal === 'search' && <SearchView users={allUsers} onViewProfile={(user) => handleNavigate('profile', user)} onClose={closeModal} />}
            {modal === 'suggestions' && <SuggestionsModal users={allUsers.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id))} currentUser={currentUser} onClose={closeModal} onViewProfile={(u) => handleNavigate('profile', u)} onFollow={handleFollow} onUnfollow={(u) => setModalData({ type: 'unfollow', content: u })} />}
            {modal === 'trends' && <TrendsModal topics={appData.trendingTopics} onClose={closeModal} />}
            {modal === 'edit-profile' && <EditProfileModal user={currentUser} onClose={closeModal} onSave={() => {}} />}
            {modal === 'change-password' && <ChangePasswordModal onClose={closeModal} onSave={() => {}} />}
            {modal === 'get-verified' && <GetVerifiedModal onClose={closeModal} onSubmit={() => {}} />}
            {modal === '2fa' && <TwoFactorAuthModal onClose={closeModal} onEnable={() => {}} />}
            {modal === 'payment' && <PaymentModal onClose={closeModal} onConfirmPayment={() => {}} />}
            {modal === 'new-support-request' && <NewSupportRequestModal onClose={closeModal} onSubmit={handleSubmitSupportTicket} />}
            {modal === 'create-story' && <CreateStoryModal onClose={closeModal} onCreateStory={handleCreateStory} />}
            {modal === 'create-highlight' && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={closeModal} onCreate={handleCreateHighlight} />}
            {modal === 'new-message' && <NewMessageModal users={allUsers.filter(u => u.id !== currentUser.id)} onClose={closeModal} onSelectUser={handleStartConversation} />}
            
            {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
        </div>
    );
};

export default App;