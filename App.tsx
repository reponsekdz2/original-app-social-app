// Fix: Create the main App component.
import React, { useState, useEffect } from 'react';

// Types
import type { View, User, Post as PostType, Story, Reel as ReelType, FeedActivity, SponsoredContent, Conversation, Message, Activity, SupportTicket, StoryItem, Post, StoryHighlight, NotificationSettings, Comment, Testimonial, HelpArticle, Notification } from './types.ts';

// API Service
import * as api from './services/apiService.ts';

// Components
import LeftSidebar from './components/LeftSidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import ReelsView from './components/ReelsView';
import ProfileView from './components/ProfileView';
import SavedView from './components/SavedView';
import SettingsView from './components/SettingsView';
import ActivityView from './components/ActivityView';
import PremiumView from './components/PremiumView';
import PremiumWelcomeView from './components/PremiumWelcomeView';
import HelpCenterView from './components/HelpCenterView';
import SupportInboxView from './components/SupportInboxView';
import MessagesView from './MessagesView';
import ArchiveView from './components/ArchiveView';
import AuthView from './components/AuthView.tsx';
import CallModal from './components/CallModal.tsx';

// Modals & Panels
import PostModal from './components/PostModal';
import StoryViewer from './components/StoryViewer';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import CreatePostModal from './components/CreatePostModal';
import EditPostModal from './components/EditPostModal';
import PostWithOptionsModal from './components/PostWithOptionsModal';
import ViewLikesModal from './components/ViewLikesModal';
import FollowListModal from './components/FollowListModal';
import UnfollowModal from './components/UnfollowModal';
import ShareModal from './components/ShareModal';
import ReelCommentsModal from './components/ReelCommentsModal';
import GetVerifiedModal from './components/GetVerifiedModal';
import EditProfileModal from './components/EditProfileModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import PaymentModal from './components/PaymentModal';
import NewSupportRequestModal from './components/NewSupportRequestModal';
import CreateStoryModal from './components/CreateStoryModal';
import CreateHighlightModal from './components/CreateHighlightModal';
import SuggestionsModal from './components/SuggestionsModal';
import TrendsModal from './components/TrendsModal';

// Side Panels
import SearchView from './components/SearchView';
import NotificationsPanel from './components/NotificationsPanel';

const App: React.FC = () => {
    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<ReelType[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // Data previously from constants, now from backend
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);


    // UI State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewedProfile, setViewedProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [viewedPost, setViewedPost] = useState<PostType | null>(null);
    const [viewedStory, setViewedStory] = useState<{story: Story, index: number} | null>(null);
    const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
    const [isCreatePostOpen, setCreatePostOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostType | null>(null);
    const [postWithOptions, setPostWithOptions] = useState<PostType | null>(null);
    const [usersForLikesModal, setUsersForLikesModal] = useState<User[] | null>(null);
    const [followList, setFollowList] = useState<{ title: 'Followers' | 'Following'; users: User[] } | null>(null);
    const [userToUnfollow, setUserToUnfollow] = useState<User | null>(null);
    const [postToShare, setPostToShare] = useState<PostType | null>(null);
    const [reelForComments, setReelForComments] = useState<ReelType | null>(null);
    const [isGetVerifiedOpen, setGetVerifiedOpen] = useState(false);
    const [isEditProfileOpen, setEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isNewSupportRequestOpen, setNewSupportRequestOpen] = useState(false);
    const [isCreateStoryOpen, setCreateStoryOpen] = useState(false);
    const [isCreateHighlightOpen, setCreateHighlightOpen] = useState(false);
    const [isSuggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
    const [isTrendsModalOpen, setTrendsModalOpen] = useState(false);
    const [callState, setCallState] = useState<{ user: User, type: 'audio' | 'video' } | null>(null);

    
    // Panel State
    const [isSearchPanelOpen, setSearchPanelOpen] = useState(false);
    const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

    const fetchAllData = async (userId: string) => {
        try {
            const [
                postsData, usersData, storiesData, reelsData,
                conversationsData, activitiesData, supportTicketsData,
                feedActivitiesData, trendingTopicsData, suggestedUsersData,
                sponsoredContentData, testimonialsData, helpArticlesData, notificationsData
            ] = await Promise.all([
                api.getPosts(), api.getUsers(), api.getStories(), api.getReels(),
                api.getConversations(), api.getActivities(), api.getSupportTickets(),
                api.getFeedActivities(), api.getTrendingTopics(), api.getSuggestedUsers(userId),
                api.getSponsoredContent(), api.getPremiumTestimonials(), api.getHelpArticles(),
                api.getNotifications(userId),
            ]);

            setPosts(postsData);
            setUsers(usersData);
            setStories(storiesData);
            setReels(reelsData);
            setConversations(conversationsData);
            setActivities(activitiesData);
            setSupportTickets(supportTicketsData);
            setFeedActivities(feedActivitiesData);
            setTrendingTopics(trendingTopicsData);
            setSuggestedUsers(suggestedUsersData);
            setSponsoredContent(sponsoredContentData);
            setTestimonials(testimonialsData);
            setHelpArticles(helpArticlesData);
            setNotifications(notificationsData);

        } catch (error) {
            console.error("Failed to fetch app data", error);
        }
    };
    
    const handleLoginSuccess = (user: User) => {
        localStorage.setItem('currentUserId', user.id);
        setCurrentUser(user);
        setIsLoading(true);
        fetchAllData(user.id).finally(() => setIsLoading(false));
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUserId');
        setCurrentUser(null);
        // Reset all state
        setPosts([]);
        setUsers([]);
        setStories([]);
        setReels([]);
        setConversations([]);
    };

    useEffect(() => {
        const checkSession = async () => {
            const userId = localStorage.getItem('currentUserId');
            if (userId) {
                try {
                    const user = await api.getMe(userId);
                    setCurrentUser(user);
                    await fetchAllData(userId);
                } catch (error) {
                    console.error("Session check failed", error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    useEffect(() => {
        if (viewedProfile && currentUser && viewedProfile.id === currentUser.id) {
            setViewedProfile(currentUser);
        }
    }, [currentUser, viewedProfile]);

    const handleNavigate = (view: View, user?: User) => {
        if (view === 'profile') {
            setViewedProfile(user || currentUser);
        } else {
            setViewedProfile(null);
        }
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    const updateConversation = (updatedConvo: Conversation) => {
        setConversations(prev => {
            const exists = prev.some(c => c.id === updatedConvo.id);
            if (exists) {
                return prev.map(c => c.id === updatedConvo.id ? updatedConvo : c);
            }
            return [updatedConvo, ...prev];
        });
    };
    
    // Data mutation handlers
    const handleToggleLike = async (postId: string) => {
        if (!currentUser) return;
        const originalPosts = [...posts];
        // Optimistic update
        const updatedPosts = posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p);
        setPosts(updatedPosts);
        try {
            const updatedPost = await api.togglePostLike(postId, currentUser.id);
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
             if (viewedPost?.id === postId) setViewedPost(updatedPost);
        } catch (error) {
            setPosts(originalPosts); // Revert on error
        }
    };
    
    const handleToggleSave = async (postId: string) => {
        if (!currentUser) return;
        const updatedPost = await api.togglePostSave(postId, currentUser.id);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    };

    const handleComment = async (postId: string, text: string) => {
        if (!currentUser) return;
        const updatedPost = await api.addComment(postId, currentUser.id, text);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        if (viewedPost?.id === postId) {
            setViewedPost(updatedPost);
        }
    };

    const handleFollow = async (userToFollow: User) => {
      if (!currentUser) return;
      const { currentUser: updatedCurrentUser } = await api.followUser(currentUser.id, userToFollow.id);
      setCurrentUser(updatedCurrentUser);
      // Refresh all user data to get updated follower counts and suggestions
      const [updatedUsers, updatedSuggestions] = await Promise.all([api.getUsers(), api.getSuggestedUsers(currentUser.id)]);
      setUsers(updatedUsers);
      setSuggestedUsers(updatedSuggestions);
    };

    const handleUnfollow = async (userToUnfollow: User) => {
        if (!currentUser) return;
        const { currentUser: updatedCurrentUser } = await api.unfollowUser(currentUser.id, userToUnfollow.id);
        setCurrentUser(updatedCurrentUser);
        const [updatedUsers, updatedSuggestions] = await Promise.all([api.getUsers(), api.getSuggestedUsers(currentUser.id)]);
        setUsers(updatedUsers);
        setSuggestedUsers(updatedSuggestions);
        setUserToUnfollow(null);
    };
    
    const handleEditProfileSave = async (updatedUserData: User) => {
        const updatedUser = await api.updateUserProfile(updatedUserData.id, updatedUserData);
        const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(newUsers);
        setCurrentUser(updatedUser);
        setEditProfileOpen(false);
    };

    const handleCreatePost = async (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'timestamp' | 'isSaved' | 'isLiked' | 'commentsDisabled'>) => {
        const newPost = await api.createPost(postData);
        setPosts([newPost, ...posts]);
        setCreatePostOpen(false);
    }
    
    const handleDeletePost = async (postId: string) => {
        await api.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
    };
    
    const handleEditPostSave = async (postId: string, newCaption: string) => {
        const updatedPost = await api.updatePost(postId, newCaption);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        setEditingPost(null);
    };
    
    const handleToggleArchive = async (post: PostType) => {
        const updatedPost = await api.toggleArchivePost(post.id);
        setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    }

    const handleSendDirectMessage = async (messageData: any) => {
        if (!currentUser) return;
        const updatedConvo = await api.sendDirectMessage({ senderId: currentUser.id, ...messageData });
        updateConversation(updatedConvo);
    };

    const handleSharePost = (recipient: User, post: PostType) => {
        if (!currentUser) return;
        handleSendDirectMessage({
            recipientId: recipient.id,
            content: `Check out this post!`,
            type: 'share',
            sharedPostId: post.id,
        });
        setPostToShare(null);
    };

    const handleReplyToStory = (storyUser: User, content: string) => {
        if (!currentUser) return;
        handleSendDirectMessage({
            recipientId: storyUser.id,
            content,
            type: 'text',
        });
    };
    
    const handleInitiateCall = async (receiver: User, type: 'audio' | 'video') => {
        if (!currentUser) return;
        try {
            await api.initiateCall(currentUser.id, receiver.id, type);
            setCallState({ user: receiver, type });
        } catch (error) {
            alert(`Could not initiate call with ${receiver.username}.`);
        }
    };
    
    const handleUpdateUserRelationship = async (targetUser: User, action: 'mute' | 'unmute' | 'block' | 'unblock' | 'restrict' | 'unrestrict') => {
        if (!currentUser) return;
        try {
            const updatedCurrentUser = await api.updateUserRelationship(currentUser.id, targetUser.id, action);
            setCurrentUser(updatedCurrentUser);
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
        }
    };

    const handleLikeReel = async (reelId: string) => {
        if (!currentUser) return;
        const updatedReel = await api.toggleReelLike(reelId, currentUser.id);
        setReels(reels.map(r => r.id === reelId ? updatedReel : r));
    };

    const handleCommentOnReel = async (reelId: string, text: string) => {
        if (!currentUser) return;
        const updatedReel = await api.addReelComment(reelId, currentUser.id, text);
        setReels(reels.map(r => r.id === reelId ? updatedReel : r));
        setReelForComments(updatedReel);
    };

    const handleCreateStory = async (storyItem: Omit<StoryItem, 'id'>) => {
        if (!currentUser) return;
        const updatedStories = await api.createStory(currentUser.id, storyItem);
        setStories(updatedStories);
        setCreateStoryOpen(false);
    };

    const handleCreateHighlight = async (title: string, storyIds: string[]) => {
        if (!currentUser) return;
        const updatedUser = await api.createHighlight(currentUser.id, title, storyIds);
        setCurrentUser(updatedUser);
        setCreateHighlightOpen(false);
    };
    
    const handleUpdatePostSettings = async (postId: string, settings: { commentsDisabled: boolean }) => {
        const updatedPost = await api.updatePostSettings(postId, settings);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        setPostWithOptions(null);
    };

    const handleCreateSupportTicket = async (subject: string, description: string) => {
        const newTicket = await api.createSupportTicket(subject, description);
        setSupportTickets([newTicket, ...supportTickets]);
        setNewSupportRequestOpen(false);
    };

    const handleChangePassword = async (passwords: any) => {
        if (!currentUser) return;
        await api.changePassword(currentUser.id, passwords);
        setChangePasswordOpen(false);
    };
    
    const handleUpdateUserSettings = async (settings: any) => {
        if (!currentUser) return;
        const updatedUser = await api.updateUserSettings(currentUser.id, settings);
        setCurrentUser(updatedUser);
    };

    const handleShowNotifications = async () => {
        if (!currentUser) return;
        setNotificationsPanelOpen(true);
        const updatedNotifications = notifications.map(n => ({...n, read: true}));
        setNotifications(updatedNotifications);
        await api.markNotificationsAsRead(currentUser.id);
    };

    const handleActivatePremium = async () => {
        if (!currentUser) return;
        const updatedUser = await api.activatePremium(currentUser.id);
        setCurrentUser(updatedUser);
        setPaymentModalOpen(false); 
        handleNavigate('premium-welcome');
    };

    const handleSubmitVerification = async () => {
        if (!currentUser) return;
        await api.submitVerificationRequest(currentUser.id);
        setGetVerifiedOpen(false);
        // Add user feedback e.g., a toast notification
    };
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white text-xl">Loading talka...</div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} />;
    }

    const renderView = () => {
        const profileUser = viewedProfile || currentUser;
        
        switch (currentView) {
            case 'home':
                return <HomeView 
                    posts={posts.filter(p => !p.isArchived)}
                    stories={stories}
                    currentUser={currentUser}
                    suggestedUsers={suggestedUsers}
                    trendingTopics={trendingTopics}
                    feedActivities={feedActivities}
                    sponsoredContent={sponsoredContent}
                    conversations={conversations}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave}
                    onComment={handleComment}
                    onShare={setPostToShare}
                    onViewStory={(story) => setViewedStory({story, index: stories.findIndex(s => s.id === story.id)})}
                    onViewLikes={setUsersForLikesModal}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onViewPost={setViewedPost}
                    onOptions={setPostWithOptions}
                    onShowSuggestions={() => setSuggestionsModalOpen(true)}
                    onShowTrends={() => setTrendsModalOpen(true)}
                    onCreateStory={() => setCreateStoryOpen(true)}
                    onShowSearch={() => setSearchPanelOpen(true)}
                    onNavigate={handleNavigate}
                    onFollow={handleFollow}
                    onUnfollow={(user) => setUserToUnfollow(user)}
                />;
            case 'explore':
                return <ExploreView posts={posts} onViewPost={setViewedPost} />;
            case 'reels':
                return <ReelsView 
                    reels={reels} 
                    currentUser={currentUser}
                    onLikeReel={handleLikeReel}
                    onCommentOnReel={setReelForComments}
                    onShareReel={() => {}}
                />;
            case 'profile':
                return <ProfileView
                    user={profileUser}
                    posts={posts.filter(p => p.user.id === profileUser.id && !p.isArchived)}
                    isCurrentUser={profileUser.id === currentUser.id}
                    currentUser={currentUser}
                    onEditProfile={() => setEditProfileOpen(true)}
                    onViewArchive={() => handleNavigate('archive')}
                    onFollow={handleFollow}
                    onUnfollow={(user) => setUserToUnfollow(user)}
                    onShowFollowers={(users) => setFollowList({title: 'Followers', users})}
                    onShowFollowing={(users) => setFollowList({title: 'Following', users})}
                    onEditPost={setEditingPost}
                    onViewPost={setViewedPost}
                    onOpenCreateHighlightModal={() => setCreateHighlightOpen(true)}
                />;
            case 'messages':
                return <MessagesView 
                    conversations={conversations} 
                    setConversations={setConversations}
                    currentUser={currentUser}
                    onSendMessage={handleSendDirectMessage}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onInitiateCall={handleInitiateCall}
                    onUpdateUserRelationship={handleUpdateUserRelationship}
                />;
            case 'saved':
                return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={setViewedPost} />;
            case 'settings':
                return <SettingsView 
                    currentUser={currentUser}
                    onGetVerified={() => setGetVerifiedOpen(true)}
                    onEditProfile={() => setEditProfileOpen(true)}
                    onChangePassword={() => setChangePasswordOpen(true)}
                    isPrivateAccount={currentUser.isPrivate}
                    onTogglePrivateAccount={(val) => handleUpdateUserSettings({ isPrivate: val })}
                    isTwoFactorEnabled={false}
                    onToggleTwoFactor={() => {}}
                    onUpdateNotificationSettings={(key, value) => handleUpdateUserSettings({ notificationSettings: { ...currentUser.notificationSettings, [key]: value } })}
                    onNavigate={handleNavigate}
                />;
            case 'activity':
                return <ActivityView activities={activities} />;
             case 'premium':
                return <PremiumView 
                    onShowPaymentModal={() => setPaymentModalOpen(true)}
                    isCurrentUserPremium={!!currentUser.isPremium}
                    testimonials={testimonials}
                />;
            case 'premium-welcome':
                return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help-center':
                 return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support-inbox':
                return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setNewSupportRequestOpen(true)} />;
            case 'archive':
                return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={setViewedPost} />;
            default:
                return <div>Not Found</div>;
        }
    };
    
    return (
      <div className="bg-black text-white min-h-screen font-sans">
        <div className="flex">
          <LeftSidebar
            currentUser={currentUser}
            currentView={currentView}
            onNavigate={handleNavigate}
            onShowSearch={() => setSearchPanelOpen(true)}
            onShowNotifications={handleShowNotifications}
            onCreatePost={() => setCreatePostOpen(true)}
            onSwitchAccount={() => setAccountSwitcherOpen(true)}
            onLogout={handleLogout}
          />
          <div className="flex-1 md:ml-[72px] lg:ml-64">
              <Header 
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onSwitchAccount={() => setAccountSwitcherOpen(true)}
                onCreatePost={() => setCreatePostOpen(true)}
                onShowNotifications={handleShowNotifications}
                onLogout={handleLogout}
              />
              <main className={currentView === 'home' ? '' : 'container mx-auto'}>
                {renderView()}
              </main>
          </div>
        </div>
        
        <BottomNav 
            currentView={currentView}
            onNavigate={handleNavigate}
            onCreatePost={() => setCreatePostOpen(true)}
            currentUser={currentUser}
        />

        {/* Modals */}
        {viewedPost && <PostModal post={viewedPost} currentUser={currentUser} onClose={() => setViewedPost(null)} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={setPostToShare} onViewLikes={setUsersForLikesModal} onViewProfile={(user) => { setViewedPost(null); handleNavigate('profile', user); }} onOptions={setPostWithOptions} />}
        {viewedStory && <StoryViewer stories={stories} startIndex={viewedStory.index} onClose={() => setViewedStory(null)} onViewProfile={(user) => { setViewedStory(null); handleNavigate('profile', user); }} onReply={handleReplyToStory} onShare={() => {}} />}
        {isAccountSwitcherOpen && <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => {setCurrentUser(user); setAccountSwitcherOpen(false); handleNavigate('home');}} />}
        {isCreatePostOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostOpen(false)} onCreatePost={handleCreatePost} />}
        {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleEditPostSave} />}
        {postWithOptions && <PostWithOptionsModal post={postWithOptions} currentUser={currentUser} onClose={() => setPostWithOptions(null)} onUnfollow={(user) => setUserToUnfollow(user)} onDelete={handleDeletePost} onEdit={setEditingPost} onToggleArchive={handleToggleArchive} onToggleComments={(settings) => handleUpdatePostSettings(postWithOptions.id, settings)} onCopyLink={() => {}} />}
        {usersForLikesModal && <ViewLikesModal users={usersForLikesModal} currentUser={currentUser} onClose={() => setUsersForLikesModal(null)} onViewProfile={(user) => { setUsersForLikesModal(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setUserToUnfollow(user)} />}
        {followList && <FollowListModal title={followList.title} users={followList.users} currentUser={currentUser} onClose={() => setFollowList(null)} onViewProfile={(user) => { setFollowList(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setUserToUnfollow(user)} />}
        {userToUnfollow && <UnfollowModal user={userToUnfollow} onCancel={() => setUserToUnfollow(null)} onConfirm={() => handleUnfollow(userToUnfollow)} />}
        {postToShare && <ShareModal post={postToShare} users={users.filter(u => u.id !== currentUser.id)} onClose={() => setPostToShare(null)} onSendShare={(recipient) => handleSharePost(recipient, postToShare)} />}
        {reelForComments && <ReelCommentsModal reel={reelForComments} currentUser={currentUser} onClose={() => setReelForComments(null)} onComment={handleCommentOnReel} onViewProfile={(user) => { setReelForComments(null); handleNavigate('profile', user); }} />}
        {isGetVerifiedOpen && <GetVerifiedModal onClose={() => setGetVerifiedOpen(false)} onSubmit={handleSubmitVerification} />}
        {isEditProfileOpen && <EditProfileModal user={currentUser} onClose={() => setEditProfileOpen(false)} onSave={handleEditProfileSave} />}
        {isChangePasswordOpen && <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} onSave={handleChangePassword} />}
        {isPaymentModalOpen && <PaymentModal onClose={() => setPaymentModalOpen(false)} onConfirmPayment={handleActivatePremium} />}
        {isNewSupportRequestOpen && <NewSupportRequestModal onClose={() => setNewSupportRequestOpen(false)} onSubmit={handleCreateSupportTicket} />}
        {isCreateStoryOpen && <CreateStoryModal onClose={() => setCreateStoryOpen(false)} onCreateStory={handleCreateStory} />}
        {isCreateHighlightOpen && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={() => setCreateHighlightOpen(false)} onCreate={handleCreateHighlight} />}
        {isSuggestionsModalOpen && <SuggestionsModal users={suggestedUsers} currentUser={currentUser} onClose={() => setSuggestionsModalOpen(false)} onViewProfile={(user) => { setSuggestionsModalOpen(false); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setUserToUnfollow(user)} />}
        {isTrendsModalOpen && <TrendsModal topics={trendingTopics} onClose={() => setTrendsModalOpen(false)} />}
        {callState && <CallModal user={callState.user} type={callState.type} onClose={() => setCallState(null)} />}

        {/* Side Panels */}
        {isSearchPanelOpen && <SearchView users={users} onClose={() => setSearchPanelOpen(false)} onViewProfile={(user) => { setSearchPanelOpen(false); handleNavigate('profile', user); }} />}
        {isNotificationsPanelOpen && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsPanelOpen(false)} />}
      </div>
    );
};

export default App;