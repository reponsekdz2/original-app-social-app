// Fix: Create the main App component.
import React, { useState, useEffect } from 'react';

// Types
import type { View, User, Post as PostType, Story, Reel as ReelType, FeedActivity, SponsoredContent, Conversation, Message, Activity, SupportTicket, StoryItem, Post, StoryHighlight, NotificationSettings, Comment, Testimonial, HelpArticle, Notification, TrendingTopic } from './types.ts';

// API Service
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

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
import Toast from './components/Toast.tsx';

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
import NewMessageModal from './components/NewMessageModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';

// Side Panels
import SearchView from './components/SearchView';
import NotificationsPanel from './components/NotificationsPanel';

const App: React.FC = () => {
    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [explorePosts, setExplorePosts] = useState<PostType[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<ReelType[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // Data previously from constants, now from backend
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);


    // UI State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [viewedProfile, setViewedProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [conversationToSelect, setConversationToSelect] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);


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
    const [contentToShare, setContentToShare] = useState<PostType | ReelType | Story | null>(null);
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
    const [isNewMessageModalOpen, setNewMessageModalOpen] = useState(false);
    const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetPasswordIdentifier, setResetPasswordIdentifier] = useState<string | null>(null);

    
    // Panel State
    const [isSearchPanelOpen, setSearchPanelOpen] = useState(false);
    const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

    const fetchAllData = async (userId: string) => {
        try {
            const [
                postsData, usersData, storiesData, reelsData,
                conversationsData, activitiesData, supportTicketsData,
                feedActivitiesData, trendingTopicsData, suggestedUsersData,
                sponsoredContentData, testimonialsData, helpArticlesData, notificationsData,
                explorePostsData
            ] = await Promise.all([
                api.getPosts(), api.getUsers(), api.getStories(), api.getReels(),
                api.getConversations(), api.getActivities(), api.getSupportTickets(),
                api.getFeedActivities(), api.getTrendingTopics(), api.getSuggestedUsers(userId),
                api.getSponsoredContent(), api.getPremiumTestimonials(), api.getHelpArticles(),
                api.getNotifications(userId), api.getExplorePosts()
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
            setExplorePosts(explorePostsData);

        } catch (error) {
            console.error("Failed to fetch app data", error);
        }
    };
    
    const handleLoginSuccess = (user: User) => {
        localStorage.setItem('currentUserId', user.id);
        setCurrentUser(user);
        setIsLoading(true);
        socketService.connect(user.id);
        fetchAllData(user.id).finally(() => setIsLoading(false));
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUserId');
        setCurrentUser(null);
        socketService.disconnect();
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
                    socketService.connect(user.id);
                    await fetchAllData(userId);
                } catch (error) {
                    console.error("Session check failed", error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };

        checkSession();

        return () => {
            socketService.disconnect();
        }
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

    const handleComment = async (postId: string, text: string, replyToId?: string) => {
        if (!currentUser) return;
        const updatedPost = await api.addComment(postId, currentUser.id, text, replyToId);
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
        setToastMessage("Profile updated successfully!");
    };

    const handleCreatePost = async (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'timestamp' | 'isSaved' | 'isLiked' | 'commentsDisabled'>) => {
        const newPost = await api.createPost(postData);
        setPosts([newPost, ...posts]);
        setCreatePostOpen(false);
    }
    
    const handleDeletePost = async (postId: string) => {
        await api.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
        setToastMessage("Post deleted.");
    };
    
    const handleEditPostSave = async (postId: string, newCaption: string) => {
        const updatedPost = await api.updatePost(postId, newCaption);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        setEditingPost(null);
    };
    
    const handleToggleArchive = async (post: PostType) => {
        const updatedPost = await api.toggleArchivePost(post.id);
        setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
        setToastMessage(updatedPost.isArchived ? "Post archived" : "Post unarchived");
    }

    const handleSendDirectMessage = async (messageData: any) => {
        if (!currentUser) return;
        // API call now also emits socket event
        const updatedConvo = await api.sendDirectMessage({ senderId: currentUser.id, ...messageData });
        updateConversation(updatedConvo);
    };

    const handleSendShare = (recipient: User) => {
        if (!currentUser || !contentToShare) return;

        let messageData: any = { recipientId: recipient.id };

        if ('media' in contentToShare && 'caption' in contentToShare) { // Post
            messageData.type = 'share';
            messageData.content = `Check out this post!`;
            messageData.sharedPostId = contentToShare.id;
        } else if ('video' in contentToShare) { // Reel
            messageData.type = 'text';
            messageData.content = `Check out this reel from @${contentToShare.user.username}!`;
        } else if ('stories' in contentToShare) { // Story
            messageData.type = 'text';
            messageData.content = `Check out @${contentToShare.user.username}'s story!`;
        }

        handleSendDirectMessage(messageData);
        setContentToShare(null);
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
            setToastMessage(`Could not initiate call with ${receiver.username}.`);
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
        setToastMessage("Password changed successfully.");
    };

    const handleConfirmPayment = async () => {
        if (!currentUser) return;
        const updatedUser = await api.activatePremium(currentUser.id);
        setCurrentUser(updatedUser);
        setPaymentModalOpen(false);
        handleNavigate('premium-welcome');
    };
    
    const handleVerificationSubmit = async () => {
        if (!currentUser) return;
        await api.submitVerificationRequest(currentUser.id);
        setGetVerifiedOpen(false);
        setToastMessage("Your verification request has been submitted.");
    };

    const handleCopyLink = (content: PostType | ReelType | Story) => {
        let path = '';
        if ('caption' in content && 'media' in content) path = `/post/${content.id}`;
        else if ('video' in content) path = `/reel/${content.id}`;
        else if ('stories' in content) path = `/story/${content.user.id}`;
        
        navigator.clipboard.writeText(`https://talka.app${path}`);
        setToastMessage('Link copied to clipboard!');
        setPostWithOptions(null);
        setContentToShare(null);
    };

    const handleStartConversation = async (user: User) => {
        if (!currentUser) return;
        try {
            const convo = await api.findOrCreateConversation(currentUser.id, user.id);
            updateConversation(convo);
            setNewMessageModalOpen(false);
            setCurrentView('messages');
            setConversationToSelect(convo.id);
        } catch (error) {
            console.error("Failed to start conversation:", error);
            setToastMessage("Could not start a conversation. Please try again.");
        }
    };

    const handleForgotPassword = async (identifier: string) => {
        try {
            await api.forgotPassword(identifier);
            setForgotPasswordOpen(false);
            setResetPasswordIdentifier(identifier);
        } catch (error: any) {
            setToastMessage(error.message || "An error occurred.");
        }
    };

    const handleResetPassword = async (password: string) => {
        if (!resetPasswordIdentifier) return;
        try {
            await api.resetPassword(resetPasswordIdentifier, password);
            setResetPasswordIdentifier(null);
            setToastMessage("Password has been reset successfully. Please log in.");
        } catch (error: any) {
             setToastMessage(error.message || "An error occurred.");
        }
    };

    const handleToggleCommentLike = async (postId: string, commentId: string) => {
        if (!currentUser) return;

        const updateCommentLikeRecursively = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
                if (comment.id === commentId) {
                    const isLiked = comment.likedBy.some(u => u.id === currentUser.id);
                    const updatedLikedBy = isLiked
                        ? comment.likedBy.filter(u => u.id !== currentUser.id)
                        : [...comment.likedBy, currentUser!]; 
                    return { ...comment, likedBy: updatedLikedBy, likes: updatedLikedBy.length };
                }
                if (comment.replies && comment.replies.length > 0) {
                    return { ...comment, replies: updateCommentLikeRecursively(comment.replies) };
                }
                return comment;
            });
        };

        const newPosts = posts.map(p => {
            if (p.id === postId) {
                return { ...p, comments: updateCommentLikeRecursively(p.comments) };
            }
            return p;
        });

        setPosts(newPosts);

        if (viewedPost?.id === postId) {
            setViewedPost(newPosts.find(p => p.id === postId) || null);
        }

        try {
            await api.toggleCommentLike(commentId, currentUser.id);
        } catch (error) {
            console.error("Failed to toggle comment like:", error);
            // In a real app, you might want to revert the state here.
        }
    };


    // Main render logic
    if (isLoading) {
        return <div className="bg-black h-screen flex items-center justify-center text-white"><p>Loading...</p></div>;
    }
    
    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setForgotPasswordOpen(true)} />;
    }
    
    const mainContent = () => {
        // Fix: Changed p.userId to p.user.id to match Post type
        const userPosts = posts.filter(p => p.user.id === (viewedProfile?.id || currentUser.id));
        // Fix: Changed r.userId to r.user.id to match Reel type
        const userReels = reels.filter(r => r.user.id === (viewedProfile?.id || currentUser.id));
        const savedPosts = posts.filter(p => p.isSaved);
        const archivedPosts = posts.filter(p => p.isArchived);
        // Fix: Changed s.userId to s.user.id to match Story type
        const userStories = stories.find(s => s.user.id === currentUser.id)?.stories || [];

        switch (currentView) {
            case 'home': return <HomeView 
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
                onShare={setContentToShare}
                onViewStory={(story) => setViewedStory({story, index: stories.indexOf(story)})}
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
                onUnfollow={setUserToUnfollow}
            />;
            case 'explore': return <ExploreView posts={explorePosts} onViewPost={setViewedPost} />;
            case 'reels': return <ReelsView 
                reels={reels} 
                currentUser={currentUser}
                onLikeReel={handleLikeReel}
                onCommentOnReel={setReelForComments}
                onShareReel={setContentToShare}
            />;
            case 'messages': return <MessagesView 
                conversations={conversations}
                setConversations={setConversations}
                currentUser={currentUser}
                onSendMessage={handleSendDirectMessage}
                onViewProfile={(user) => handleNavigate('profile', user)}
                onInitiateCall={handleInitiateCall}
                onUpdateUserRelationship={handleUpdateUserRelationship}
                onNewMessage={() => setNewMessageModalOpen(true)}
                conversationToSelect={conversationToSelect}
                setConversationToSelect={setConversationToSelect}
            />;
            // Fix: Add missing onMessage prop to ProfileView.
            case 'profile': return <ProfileView 
                user={viewedProfile || currentUser} 
                posts={userPosts}
                reels={userReels}
                isCurrentUser={!viewedProfile || viewedProfile.id === currentUser.id}
                currentUser={currentUser}
                onEditProfile={() => setEditProfileOpen(true)}
                onViewArchive={() => handleNavigate('archive')}
                onFollow={handleFollow}
                onUnfollow={setUserToUnfollow}
                onShowFollowers={(users) => setFollowList({ title: 'Followers', users })}
                onShowFollowing={(users) => setFollowList({ title: 'Following', users })}
                onEditPost={setEditingPost}
                onViewPost={setViewedPost}
                onViewReel={(reel) => { handleNavigate('reels'); }} 
                onOpenCreateHighlightModal={() => setCreateHighlightOpen(true)}
                onMessage={handleStartConversation}
            />;
            case 'saved': return <SavedView posts={savedPosts} onViewPost={setViewedPost} />;
            case 'settings': return <SettingsView 
                currentUser={currentUser}
                onGetVerified={() => setGetVerifiedOpen(true)}
                onEditProfile={() => setEditProfileOpen(true)}
                onChangePassword={() => setChangePasswordOpen(true)}
                isPrivateAccount={currentUser.isPrivate}
                onTogglePrivateAccount={(val) => api.updateUserSettings(currentUser.id, { isPrivate: val }).then(setCurrentUser)}
                isTwoFactorEnabled={false} // Mocked for now
                onToggleTwoFactor={() => {}} // Mocked for now
                onUpdateNotificationSettings={(setting, value) => {
                    api.updateUserSettings(currentUser.id, { notificationSettings: { ...currentUser.notificationSettings, [setting]: value } }).then(setCurrentUser);
                }}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />;
            case 'activity': return <ActivityView activities={activities} />;
            case 'archive': return <ArchiveView posts={archivedPosts} onViewPost={setViewedPost} />;
            case 'premium': return <PremiumView onShowPaymentModal={() => setPaymentModalOpen(true)} isCurrentUserPremium={!!currentUser.isPremium} testimonials={testimonials} />;
            case 'premium-welcome': return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help-center': return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support-inbox': return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setNewSupportRequestOpen(true)} />;

            default: return <div className="text-center p-8">Coming soon: {currentView}</div>;
        }
    }
    
    return (
        <div className="bg-black text-white min-h-screen flex">
             {toastMessage && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100]">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
            <LeftSidebar 
                currentUser={currentUser}
                currentView={currentView}
                onNavigate={handleNavigate}
                onShowSearch={() => setSearchPanelOpen(true)}
                onShowNotifications={() => setNotificationsPanelOpen(true)}
                onCreatePost={() => setCreatePostOpen(true)}
                onSwitchAccount={() => setAccountSwitcherOpen(true)}
                onLogout={handleLogout}
            />
            <div className="flex-1 md:ml-[72px] lg:ml-64">
                { currentView !== 'messages' && (
                    <Header 
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onCreatePost={() => setCreatePostOpen(true)}
                        onShowNotifications={() => setNotificationsPanelOpen(true)}
                        onSwitchAccount={() => setAccountSwitcherOpen(true)}
                        onLogout={handleLogout}
                    />
                )}
                <main className={currentView !== 'messages' ? 'pt-16 md:pt-0' : ''}>
                    {mainContent()}
                </main>
            </div>
            <BottomNav 
                currentUser={currentUser}
                currentView={currentView}
                onNavigate={handleNavigate}
                onCreatePost={() => setCreatePostOpen(true)}
            />
            
            {/* Panels */}
            {isSearchPanelOpen && <SearchView users={users} onClose={() => setSearchPanelOpen(false)} onViewProfile={(user) => { setSearchPanelOpen(false); handleNavigate('profile', user); }} />}
            {isNotificationsPanelOpen && <NotificationsPanel notifications={notifications} onClose={() => setNotificationsPanelOpen(false)} />}
            
            {/* Modals */}
            {isForgotPasswordOpen && <ForgotPasswordModal onClose={() => setForgotPasswordOpen(false)} onSubmit={handleForgotPassword} />}
            {resetPasswordIdentifier && <ResetPasswordModal onClose={() => setResetPasswordIdentifier(null)} onSubmit={handleResetPassword} />}
            {viewedPost && <PostModal post={viewedPost} currentUser={currentUser} onClose={() => setViewedPost(null)} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onToggleCommentLike={handleToggleCommentLike} onShare={setContentToShare} onViewLikes={setUsersForLikesModal} onViewProfile={(user) => { setViewedPost(null); handleNavigate('profile', user); }} onOptions={setPostWithOptions} />}
            {viewedStory && <StoryViewer stories={stories} startIndex={viewedStory.index} onClose={() => setViewedStory(null)} onViewProfile={(user) => { setViewedStory(null); handleNavigate('profile', user); }} onReply={handleReplyToStory} onShare={setContentToShare} />}
            {isAccountSwitcherOpen && <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={() => {}} />}
            {isCreatePostOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostOpen(false)} onCreatePost={handleCreatePost} />}
            {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleEditPostSave} />}
            {postWithOptions && <PostWithOptionsModal post={postWithOptions} currentUser={currentUser} onClose={() => setPostWithOptions(null)} onUnfollow={setUserToUnfollow} onDelete={handleDeletePost} onEdit={setEditingPost} onToggleArchive={handleToggleArchive} onToggleComments={(settings) => handleUpdatePostSettings(postWithOptions.id, settings)} onCopyLink={() => handleCopyLink(postWithOptions)} />}
            {usersForLikesModal && <ViewLikesModal users={usersForLikesModal} currentUser={currentUser} onClose={() => setUsersForLikesModal(null)} onViewProfile={(user) => { setUsersForLikesModal(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={setUserToUnfollow} />}
            {followList && <FollowListModal title={followList.title} users={followList.users} currentUser={currentUser} onClose={() => setFollowList(null)} onViewProfile={(user) => { setFollowList(null); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={setUserToUnfollow} />}
            {userToUnfollow && <UnfollowModal user={userToUnfollow} onCancel={() => setUserToUnfollow(null)} onConfirm={() => handleUnfollow(userToUnfollow)} />}
            {contentToShare && <ShareModal content={contentToShare} users={users.filter(u => u.id !== currentUser.id)} onClose={() => setContentToShare(null)} onSendShare={handleSendShare} onCopyLink={() => handleCopyLink(contentToShare)} />}
            {reelForComments && <ReelCommentsModal reel={reelForComments} currentUser={currentUser} onClose={() => setReelForComments(null)} onComment={handleCommentOnReel} onViewProfile={(user) => { setReelForComments(null); handleNavigate('profile', user); }} />}
            {isGetVerifiedOpen && <GetVerifiedModal onClose={() => setGetVerifiedOpen(false)} onSubmit={handleVerificationSubmit} />}
            {isEditProfileOpen && <EditProfileModal user={currentUser} onClose={() => setEditProfileOpen(false)} onSave={handleEditProfileSave} />}
            {isChangePasswordOpen && <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} onSave={handleChangePassword} />}
            {isPaymentModalOpen && <PaymentModal onClose={() => setPaymentModalOpen(false)} onConfirmPayment={handleConfirmPayment} />}
            {isNewSupportRequestOpen && <NewSupportRequestModal onClose={() => setNewSupportRequestOpen(false)} onSubmit={handleCreateSupportTicket} />}
            {isCreateStoryOpen && <CreateStoryModal onClose={() => setCreateStoryOpen(false)} onCreateStory={handleCreateStory} />}
            {isCreateHighlightOpen && <CreateHighlightModal userStories={stories.find(s => s.user.id === currentUser.id)?.stories || []} onClose={() => setCreateHighlightOpen(false)} onCreate={handleCreateHighlight} />}
            {isSuggestionsModalOpen && <SuggestionsModal users={suggestedUsers} currentUser={currentUser} onClose={() => setSuggestionsModalOpen(false)} onViewProfile={(user) => { setSuggestionsModalOpen(false); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={setUserToUnfollow} />}
            {isTrendsModalOpen && <TrendsModal topics={trendingTopics} onClose={() => setTrendsModalOpen(false)} />}
            {callState && <CallModal user={callState.user} type={callState.type} onClose={() => setCallState(null)} />}
            {isNewMessageModalOpen && <NewMessageModal users={users.filter(u => u.id !== currentUser.id)} onClose={() => setNewMessageModalOpen(false)} onSelectUser={handleStartConversation} />}
        </div>
    );
};

export default App;