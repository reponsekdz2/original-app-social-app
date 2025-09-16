// Fix: Create the main App component.
import React, { useState, useEffect } from 'react';

// Types
import type { View, User, Post as PostType, Story, Reel as ReelType, FeedActivity, SponsoredContent, Conversation, Message, Activity, SupportTicket, StoryItem, Post, StoryHighlight, NotificationSettings, Comment } from './types.ts';

// API Service
import * as api from './services/apiService.ts';

// Data
import { MOCK_ADS, MOCK_FEED_ACTIVITIES, MOCK_HELP_ARTICLES, MOCK_TESTIMONIALS, MOCK_TRENDING_TOPICS } from './constants.ts';

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
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ likes: true, comments: true, follows: true });


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

    const fetchAllData = async () => {
        try {
            const [
                postsData,
                usersData,
                storiesData,
                reelsData,
                conversationsData,
                activitiesData,
                supportTicketsData
            ] = await Promise.all([
                api.getPosts(),
                api.getUsers(),
                api.getStories(),
                api.getReels(),
                api.getConversations(),
                api.getActivities(),
                api.getSupportTickets(),
            ]);

            setPosts(postsData);
            setUsers(usersData);
            setStories(storiesData);
            setReels(reelsData);
            setConversations(conversationsData);
            setActivities(activitiesData);
            setSupportTickets(supportTicketsData);

        } catch (error) {
            console.error("Failed to fetch app data", error);
        }
    };
    
    const handleLoginSuccess = (user: User) => {
        localStorage.setItem('currentUserId', user.id);
        setCurrentUser(user);
        setIsLoading(true);
        fetchAllData().finally(() => setIsLoading(false));
    };

    useEffect(() => {
        const checkSession = async () => {
            const userId = localStorage.getItem('currentUserId');
            if (userId) {
                try {
                    const user = await api.getMe(userId);
                    setCurrentUser(user);
                    await fetchAllData();
                } catch (error) {
                    console.error("Session check failed", error);
                    localStorage.removeItem('currentUserId');
                    setCurrentUser(null);
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
        const updatedPost = await api.togglePostSave(postId);
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
      // Refresh all user data to get updated follower counts
      const updatedUsers = await api.getUsers();
      setUsers(updatedUsers);
    };

    const handleUnfollow = async (userToUnfollow: User) => {
        if (!currentUser) return;
        const { currentUser: updatedCurrentUser } = await api.unfollowUser(currentUser.id, userToUnfollow.id);
        setCurrentUser(updatedCurrentUser);
        const updatedUsers = await api.getUsers();
        setUsers(updatedUsers);
        setUserToUnfollow(null);
    };
    
    const handleEditProfileSave = async (updatedUserData: User) => {
        const updatedUser = await api.updateUserProfile(updatedUserData.id, updatedUserData);
        const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(newUsers);
        setCurrentUser(updatedUser);
        setEditProfileOpen(false);
    };

    const handleCreatePost = async (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'timestamp' | 'isSaved' | 'isLiked'>) => {
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

    const handleSendMessage = async (conversationId: string, messageContent: Omit<Message, 'id' | 'senderId' | 'timestamp'>) => {
        if (!currentUser) return;
        
        // Optimistic update
        const newMessage: Message = {
            id: `temp-${Date.now()}`,
            senderId: currentUser.id,
            timestamp: 'Just now',
            ...messageContent,
        };
        const updatedConversations = conversations.map(c => {
            if (c.id === conversationId) {
                return { ...c, messages: [...c.messages, newMessage] };
            }
            return c;
        });
        setConversations(updatedConversations);

        try {
            const updatedConversation = await api.sendMessage(conversationId, {
                ...messageContent,
                senderId: currentUser.id,
            });
            setConversations(convos => convos.map(c => c.id === conversationId ? updatedConversation : c));
        } catch (error) {
            console.error("Failed to send message, reverting");
            // Revert optimistic update on error
             const revertedConversations = conversations.map(c => {
                if (c.id === conversationId) {
                    return { ...c, messages: c.messages.filter(m => m.id !== newMessage.id) };
                }
                return c;
            });
            setConversations(revertedConversations);
        }
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
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white text-xl">Loading Netflixgram...</div>;
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
                    suggestedUsers={users.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id))}
                    trendingTopics={MOCK_TRENDING_TOPICS}
                    feedActivities={MOCK_FEED_ACTIVITIES}
                    sponsoredContent={MOCK_ADS}
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
                    onLikeReel={(reelId) => setReels(reels.map(r => r.id === reelId ? {...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes-1 : r.likes+1 } : r))}
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
                    onSendMessage={handleSendMessage}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onInitiateCall={handleInitiateCall}
                />;
            case 'saved':
                return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={setViewedPost} />;
            case 'settings':
                return <SettingsView 
                    onGetVerified={() => setGetVerifiedOpen(true)}
                    onEditProfile={() => setEditProfileOpen(true)}
                    onChangePassword={() => setChangePasswordOpen(true)}
                    isPrivateAccount={currentUser.isPrivate}
                    onTogglePrivateAccount={(val) => setCurrentUser({...currentUser, isPrivate: val})}
                    isTwoFactorEnabled={false}
                    onToggleTwoFactor={() => {}}
                    notificationSettings={notificationSettings}
                    onUpdateNotificationSettings={(key, value) => setNotificationSettings({...notificationSettings, [key]: value})}
                    onNavigate={handleNavigate}
                />;
            case 'activity':
                return <ActivityView activities={activities} />;
             case 'premium':
                return <PremiumView 
                    onShowPaymentModal={() => setPaymentModalOpen(true)}
                    isCurrentUserPremium={!!currentUser.isPremium}
                    testimonials={MOCK_TESTIMONIALS}
                />;
            case 'premium-welcome':
                return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help-center':
                 return <HelpCenterView articles={MOCK_HELP_ARTICLES} onBack={() => handleNavigate('settings')} />;
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
            onShowNotifications={() => setNotificationsPanelOpen(true)}
            onCreatePost={() => setCreatePostOpen(true)}
            onSwitchAccount={() => setAccountSwitcherOpen(true)}
          />
          <div className="flex-1 md:ml-[72px] lg:ml-64">
              <Header 
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onSwitchAccount={() => setAccountSwitcherOpen(true)}
                onCreatePost={() => setCreatePostOpen(true)}
                onShowNotifications={() => setNotificationsPanelOpen(true)}
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
        {viewedStory && <StoryViewer stories={stories} startIndex={viewedStory.index} onClose={() => setViewedStory(null)} onViewProfile={(user) => { setViewedStory(null); handleNavigate('profile', user); }} onReply={() => {}} onShare={() => {}} />}
        {isAccountSwitcherOpen && <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => {setCurrentUser(user); setAccountSwitcherOpen(false); handleNavigate('home');}} />}
        {isCreatePostOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostOpen(false)} onCreatePost={handleCreatePost} />}
        {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleEditPostSave} />}
        {postWithOptions && <PostWithOptionsModal post={postWithOptions} currentUser={currentUser} onClose={() => setPostWithOptions(null)} onUnfollow={(user) => setUserToUnfollow(user)} onDelete={handleDeletePost} onEdit={setEditingPost} onToggleArchive={handleToggleArchive} onToggleComments={() => {}} onCopyLink={() => {}} />}
        {usersForLikesModal && <ViewLikesModal users={usersForLikesModal} currentUser={currentUser} onClose={() => setUsersForLikesModal(null)} onViewProfile={(user) => { setUsersForLikesModal(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setUserToUnfollow(user)} />}
        {followList && <FollowListModal title={followList.title} users={followList.users} currentUser={currentUser} onClose={() => setFollowList(null)} onViewProfile={(user) => { setFollowList(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setUserToUnfollow(user)} />}
        {userToUnfollow && <UnfollowModal user={userToUnfollow} onCancel={() => setUserToUnfollow(null)} onConfirm={() => handleUnfollow(userToUnfollow)} />}
        {postToShare && <ShareModal post={postToShare} users={users.filter(u => u.id !== currentUser.id)} onClose={() => setPostToShare(null)} onSendShare={() => {}} />}
        {reelForComments && <ReelCommentsModal reel={reelForComments} currentUser={currentUser} onClose={() => setReelForComments(null)} onComment={() => {}} onViewProfile={(user) => { setReelForComments(null); handleNavigate('profile', user); }} />}
        {isGetVerifiedOpen && <GetVerifiedModal onClose={() => setGetVerifiedOpen(false)} />}
        {isEditProfileOpen && <EditProfileModal user={currentUser} onClose={() => setEditProfileOpen(false)} onSave={handleEditProfileSave} />}
        {isChangePasswordOpen && <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} />}
        {isPaymentModalOpen && <PaymentModal onClose={() => setPaymentModalOpen(false)} onSuccess={() => { setCurrentUser({...currentUser, isPremium: true }); setPaymentModalOpen(false); handleNavigate('premium-welcome'); }} />}
        {isNewSupportRequestOpen && <NewSupportRequestModal onClose={() => setNewSupportRequestOpen(false)} onSubmit={(subject, description) => { setSupportTickets([{ id: `st${Date.now()}`, subject, status: 'Open', lastUpdated: '1m ago', messages: [{ sender: 'user', text: description, timestamp: '1m ago' }]}, ...supportTickets]); setNewSupportRequestOpen(false); }} />}
        {isCreateStoryOpen && <CreateStoryModal onClose={() => setCreateStoryOpen(false)} onCreateStory={() => setCreateStoryOpen(false)} />}
        {isCreateHighlightOpen && <CreateHighlightModal userStories={stories.flatMap(s => s.stories)} onClose={() => setCreateHighlightOpen(false)} onCreate={() => setCreateHighlightOpen(false)} />}
        {isSuggestionsModalOpen && <SuggestionsModal users={users.filter(u => u.id !== currentUser.id && !currentUser.following.some(f => f.id === u.id))} currentUser={currentUser} onClose={() => setSuggestionsModalOpen(false)} onViewProfile={(user) => { setSuggestionsModalOpen(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setUserToUnfollow(user)} />}
        {isTrendsModalOpen && <TrendsModal topics={MOCK_TRENDING_TOPICS} onClose={() => setTrendsModalOpen(false)} />}
        {callState && <CallModal user={callState.user} type={callState.type} onClose={() => setCallState(null)} />}
        
        {/* Side Panels */}
        {isSearchPanelOpen && <SearchView users={users} onClose={() => setSearchPanelOpen(false)} onViewProfile={(user) => {setSearchPanelOpen(false); handleNavigate('profile', user);}} />}
        {isNotificationsPanelOpen && <NotificationsPanel activities={activities} onClose={() => setNotificationsPanelOpen(false)} />}
      </div>
    );
}

export default App;