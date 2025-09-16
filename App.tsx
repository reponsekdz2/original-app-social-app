// Fix: Create the main App component.
import React, { useState, useEffect } from 'react';

// Types
import type { View, User, Post as PostType, Story, Reel as ReelType, FeedActivity, SponsoredContent, Conversation, Message, Activity, SupportTicket, StoryItem, Post, StoryHighlight, NotificationSettings, Comment } from './types.ts';

// Data
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES, MOCK_REELS, MOCK_FEED_ACTIVITIES, MOCK_ADS, MOCK_CONVERSATIONS, MOCK_ACTIVITIES, MOCK_TRENDING_TOPICS, MOCK_TESTIMONIALS, MOCK_HELP_ARTICLES, MOCK_SUPPORT_TICKETS } from './constants.ts';

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
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [posts, setPosts] = useState<PostType[]>(MOCK_POSTS);
    const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
    const [reels, setReels] = useState<ReelType[]>(MOCK_REELS);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ likes: true, comments: true, follows: true });


    // UI State
    const [currentUser, setCurrentUser] = useState<User>(users[0]);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewedProfile, setViewedProfile] = useState<User | null>(null);

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
    
    // Panel State
    const [isSearchPanelOpen, setSearchPanelOpen] = useState(false);
    const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

    useEffect(() => {
        // If the viewed profile is the current user, update it in state when it changes
        if (viewedProfile && viewedProfile.id === currentUser.id) {
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
    const handleToggleLike = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
        if (viewedPost?.id === postId) {
            setViewedPost(p => p ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : null);
        }
    };
    
    const handleToggleSave = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
    };

    const handleComment = (postId: string, text: string) => {
        const newComment: Comment = {
            id: `c${Date.now()}`,
            user: currentUser,
            text,
            timestamp: '1m',
            likes: 0,
            likedByUser: false
        };

        const updatePostState = (prevState: PostType[]) => 
            prevState.map(p => 
                p.id === postId 
                ? { ...p, comments: [...p.comments, newComment] } 
                : p
            );

        setPosts(updatePostState);

        if (viewedPost?.id === postId) {
            setViewedPost(p => p ? { ...p, comments: [...p.comments, newComment] } : null);
        }
    };

    const handleFollow = (userToFollow: User) => {
      // Don't process if already following
      if (currentUser.following.some(u => u.id === userToFollow.id)) return;
    
      // Add userToFollow to currentUser's following list
      const updatedCurrentUser = {
        ...currentUser,
        following: [...currentUser.following, userToFollow],
      };
    
      // Add currentUser to userToFollow's followers list
      const updatedUsers = users.map(u => {
        if (u.id === userToFollow.id) {
          return {
            ...u,
            followers: [...u.followers, currentUser],
          };
        }
        if (u.id === currentUser.id) {
            return updatedCurrentUser;
        }
        return u;
      });
      
      setUsers(updatedUsers);
      setCurrentUser(updatedCurrentUser);
    };

    const handleUnfollow = (userToUnfollow: User) => {
        // Remove userToUnfollow from currentUser's following list
        const updatedCurrentUser = {
            ...currentUser,
            following: currentUser.following.filter(u => u.id !== userToUnfollow.id),
        };
        
        // Remove currentUser from userToUnfollow's followers list
        const updatedUsers = users.map(u => {
            if (u.id === userToUnfollow.id) {
                return {
                    ...u,
                    followers: u.followers.filter(follower => follower.id !== currentUser.id)
                }
            }
            if (u.id === currentUser.id) {
                return updatedCurrentUser;
            }
            return u;
        });

        setUsers(updatedUsers);
        setCurrentUser(updatedCurrentUser);
        setUserToUnfollow(null); // Close modal
    };
    
    const handleEditProfileSave = (updatedUser: User) => {
        const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(newUsers);
        setCurrentUser(updatedUser);
        setEditProfileOpen(false);
    };

    const handleCreatePost = (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'timestamp' | 'isSaved' | 'isLiked'>) => {
        const newPost: PostType = {
            ...postData,
            id: `p${Date.now()}`,
            likes: 0,
            likedBy: [],
            comments: [],
            timestamp: '1m',
            isSaved: false,
            isLiked: false,
        };
        setPosts([newPost, ...posts]);
        setCreatePostOpen(false);
    }
    
    const handleDeletePost = (postId: string) => {
        setPosts(posts.filter(p => p.id !== postId));
    };
    
    const handleEditPostSave = (postId: string, newCaption: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, caption: newCaption } : p));
        setEditingPost(null);
    };
    
    const handleToggleArchive = (post: PostType) => {
        setPosts(posts.map(p => p.id === post.id ? {...p, isArchived: !p.isArchived} : p));
    }

    const handleSendMessage = (conversationId: string, messageContent: Omit<Message, 'id' | 'senderId' | 'timestamp'>) => {
        setConversations(prevConvos => {
            return prevConvos.map(convo => {
                if (convo.id === conversationId) {
                    const newMessage: Message = {
                        ...messageContent,
                        id: `m${Date.now()}`,
                        senderId: currentUser.id,
                        timestamp: 'Just now',
                    };
                    return {
                        ...convo,
                        messages: [...convo.messages, newMessage],
                    };
                }
                return convo;
            });
        });
    };

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
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    onViewProfile={(user) => handleNavigate('profile', user)}
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
              <main className="container mx-auto">
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
        
        {/* Side Panels */}
        {isSearchPanelOpen && <SearchView users={users} onClose={() => setSearchPanelOpen(false)} onViewProfile={(user) => {setSearchPanelOpen(false); handleNavigate('profile', user);}} />}
        {isNotificationsPanelOpen && <NotificationsPanel activities={activities} onClose={() => setNotificationsPanelOpen(false)} />}
      </div>
    );
}

export default App;