// Fix: Create the main App.tsx component to structure the application.
import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import type { View, User, Post, Story, Reel, Notification, Conversation, FeedActivity, SponsoredContent, TrendingTopic, Testimonial, HelpArticle, SupportTicket } from './types.ts';

// Component Imports
import AuthView from './components/AuthView.tsx';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import MessagesView from './MessagesView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import PremiumView from './components/PremiumView.tsx';
import PremiumWelcomeView from './components/PremiumWelcomeView.tsx';
import HelpCenterView from './components/HelpCenterView.tsx';
import SupportInboxView from './components/SupportInboxView.tsx';
import ActivityView from './components/ActivityView.tsx';
import ArchiveView from './components/ArchiveView.tsx';

import LeftSidebar from './components/LeftSidebar.tsx';
import Header from './components/Header.tsx';
import BottomNav from './components/BottomNav.tsx';

// Modal Imports
import CreatePostModal from './components/CreatePostModal.tsx';
import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import EditPostModal from './components/EditPostModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import UnfollowModal from './components/UnfollowModal.tsx';
import PostWithOptionsModal from './components/PostWithOptionsModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import ReelCommentsModal from './components/ReelCommentsModal.tsx';
import CreateHighlightModal from './components/CreateHighlightModal.tsx';
import GetVerifiedModal from './components/GetVerifiedModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';
import TwoFactorAuthModal from './components/TwoFactorAuthModal.tsx';
import NewSupportRequestModal from './components/NewSupportRequestModal.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import ResetPasswordModal from './components/ResetPasswordModal.tsx';
import ReportModal from './components/ReportModal.tsx';

// Panel Imports
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SearchView from './components/SearchView.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';

// Util Imports
import Toast from './components/Toast.tsx';


type ModalState =
  | { type: 'none' }
  | { type: 'create-post' }
  | { type: 'view-post', post: Post }
  | { type: 'edit-post', post: Post }
  | { type: 'post-options', post: Post }
  | { type: 'share-post', post: Post }
  | { type: 'view-likes', users: User[] }
  | { type: 'view-followers', users: User[] }
  | { type: 'view-following', users: User[] }
  | { type: 'create-story' }
  | { type: 'story-viewer', initialIndex: number }
  | { type: 'account-switcher' }
  | { type: 'unfollow', user: User }
  | { type: 'edit-profile' }
  | { type: 'reel-comments', reel: Reel }
  | { type: 'create-highlight' }
  | { type: 'get-verified' }
  | { type: 'payment' }
  | { type: 'change-password' }
  | { type: '2fa' }
  | { type: 'new-support-request' }
  | { type: 'forgot-password' }
  | { type: 'reset-password' }
  | { type: 'report', content: Post | User }
  | { type: 'trends' }
  | { type: 'suggestions' };

type PanelState = 'none' | 'notifications' | 'search';

const App: React.FC = () => {
    // Auth & User State
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // This would be a list of logged-in accounts for the switcher
    const [accounts, setAccounts] = useState<User[]>([]);

    // UI State
    const [view, setView] = useState<View>('home');
    const [modal, setModal] = useState<ModalState>({ type: 'none' });
    const [panel, setPanel] = useState<PanelState>('none');
    const [toast, setToast] = useState<string | null>(null);

    // Data State
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [explorePosts, setExplorePosts] = useState<Post[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
    const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);


    const showToast = (message: string) => {
        setToast(message);
    };

    const fetchData = useCallback(async () => {
        if (!api.getAuthToken()) {
            setIsLoading(false);
            return;
        };
        try {
            // Using Promise.all for concurrent fetching
            const [
                feedData,
                storiesData,
                reelsData,
                exploreData,
                usersData,
                suggestionsData,
                conversationsData,
                miscData,
                premiumData,
                helpData,
                supportData
            ] = await Promise.all([
                api.getFeed(),
                api.getStories(),
                api.getReels(),
                api.getExplorePosts(),
                api.getAllUsers(),
                api.getSuggestedUsers(),
                api.getConversations(),
                api.getMiscFeedData(),
                api.getPremiumData(),
                api.getHelpArticles(),
                api.getSupportTickets()
            ]);
            
            setPosts(feedData.posts);
            setStories(storiesData.stories);
            setReels(reelsData.reels);
            setExplorePosts(exploreData.posts);
            setAllUsers(usersData.users);
            setSuggestedUsers(suggestionsData.users);
            setConversations(conversationsData.conversations);
            setFeedActivities(miscData.feedActivities);
            setTrendingTopics(miscData.trendingTopics);
            setSponsoredContent(miscData.sponsoredContent);
            setTestimonials(premiumData.testimonials);
            setHelpArticles(helpData.articles);
            setSupportTickets(supportData.tickets);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            // On auth error, log out user
            if (error instanceof Error && (error.message.includes("401") || error.message.includes("token"))) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load: check for token and fetch data
    useEffect(() => {
        const token = api.getAuthToken();
        if (token) {
            setIsLoading(true);
            // In a real app, a /me endpoint is better
            // This is a placeholder for demo purposes.
            api.getAllUsers().then(data => {
                if (data.users.length > 0) {
                    const user = data.users[0]; // Assume first user is logged in
                    setCurrentUser(user);
                    setAccounts(data.users.slice(0,2)); // Mock other accounts for switcher
                    socketService.connect(user.id);
                    fetchData();
                } else {
                     setIsLoading(false);
                }
            }).catch(() => {
                handleLogout();
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
        
        return () => {
            socketService.disconnect();
        };

    }, [fetchData]);

    const handleLoginSuccess = ({ user, token }: { user: User, token: string }) => {
        api.setAuthToken(token);
        setCurrentUser(user);
        setAccounts([user]); // Set the current user as the only account for now
        socketService.connect(user.id);
        fetchData();
    };

    const handleLogout = () => {
        api.setAuthToken(null);
        setCurrentUser(null);
        setAccounts([]);
        socketService.disconnect();
        setView('home');
    };

    const handleNavigate = (newView: View, data?: any) => {
        setPanel('none');
        if (newView === 'profile' && data) {
            // Placeholder for viewing other profiles
        }
        setView(newView);
        window.scrollTo(0, 0);
    };

    // --- Action Handlers ---
    const handleToggleLike = async (postId: string) => {
        if (!currentUser) return;
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likedBy.some(u => u.id === currentUser!.id);
                return {
                    ...p,
                    likes: isLiked ? p.likes - 1 : p.likes + 1,
                    likedBy: isLiked ? p.likedBy.filter(u => u.id !== currentUser!.id) : [...p.likedBy, currentUser!]
                };
            }
            return p;
        }));
        await api.togglePostLike(postId).catch(fetchData);
    };

    const handleToggleSave = async (postId: string) => {
        if (!currentUser) return;
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const isSaved = p.savedBy.some(u => u.id === currentUser!.id);
                return {
                    ...p,
                    savedBy: isSaved ? p.savedBy.filter(u => u.id !== currentUser!.id) : [...p.savedBy, currentUser!]
                };
            }
            return p;
        }));
         await api.togglePostSave(postId).catch(fetchData);
    };
    
    const handleComment = async (postId: string, text: string) => {
        const newComment = await api.addComment(postId, text);
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        if (modal.type === 'view-post' && modal.post.id === postId) {
            const currentPost = posts.find(p => p.id === postId)!;
            setModal({ ...modal, post: { ...currentPost, comments: [...currentPost.comments, newComment] } });
        }
    };

    const handleFollow = async (userToFollow: User) => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, following: [...currentUser.following, userToFollow] });
        await api.followUser(userToFollow.id);
        showToast(`Followed ${userToFollow.username}`);
    };

    const handleUnfollow = async (userToUnfollow: User) => {
         if (!currentUser) return;
        setCurrentUser({ ...currentUser, following: currentUser.following.filter(u => u.id !== userToUnfollow.id) });
        setModal({ type: 'none' }); // close unfollow confirm modal
        await api.unfollowUser(userToUnfollow.id);
        showToast(`Unfollowed ${userToUnfollow.username}`);
    };
    
    const handleCreatePost = async (formData: FormData) => {
        const newPost = await api.createPost(formData);
        setPosts([newPost, ...posts]);
        setModal({type: 'none'});
        showToast("Post created successfully!");
    };
    
    const handleCreateStory = async (formData: FormData) => {
        await api.createStory(formData);
        fetchData(); // refetch to get new story
        setModal({type: 'none'});
        showToast("Story added!");
    };

    const handleUpdateProfile = async (formData: FormData) => {
        const updatedUser = await api.updateProfile(formData);
        setCurrentUser(updatedUser);
        setModal({ type: 'none' });
        showToast("Profile updated!");
    };
    
    const handleUpdateSettings = (settings: Partial<User['notificationSettings'] & { isPrivate: boolean }>) => {
        if (!currentUser) return;
        setCurrentUser({
            ...currentUser,
            isPrivate: settings.isPrivate ?? currentUser.isPrivate,
            notificationSettings: {
                ...currentUser.notificationSettings,
                likes: settings.likes ?? currentUser.notificationSettings.likes,
                comments: settings.comments ?? currentUser.notificationSettings.comments,
                follows: settings.follows ?? currentUser.notificationSettings.follows,
            }
        });
        // API call to persist settings would go here
        showToast("Settings updated.");
    };
    
     const handleConfirmPayment = () => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, isPremium: true });
        setModal({ type: 'none' });
        setView('premium-welcome');
     };


    if (isLoading) {
        return <div className="bg-black w-screen h-screen flex items-center justify-center text-white"><p>Loading App...</p></div>;
    }

    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setModal({ type: 'forgot-password' })} />;
    }

    const renderView = () => {
        switch (view) {
            case 'home':
                return <HomeView
                    posts={posts} stories={stories} currentUser={currentUser}
                    suggestedUsers={suggestedUsers} trendingTopics={trendingTopics}
                    feedActivities={feedActivities} sponsoredContent={sponsoredContent}
                    conversations={conversations} onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave} onComment={handleComment}
                    onShare={(post) => setModal({ type: 'share-post', post })}
                    onViewStory={(story) => setModal({ type: 'story-viewer', initialIndex: stories.findIndex(s => s.id === story.id) })}
                    onViewLikes={(users) => setModal({ type: 'view-likes', users })}
                    onViewProfile={(user) => handleNavigate('profile', user)}
                    onViewPost={(post) => setModal({ type: 'view-post', post })}
                    onOptions={(post) => setModal({ type: 'post-options', post })}
                    onShowSuggestions={() => setModal({ type: 'suggestions' })}
                    onShowTrends={() => setModal({ type: 'trends' })}
                    onCreateStory={() => setModal({ type: 'create-story' })}
                    onShowSearch={() => setPanel('search')} onNavigate={handleNavigate}
                    onFollow={handleFollow} onUnfollow={(user) => setModal({ type: 'unfollow', user })}
                />;
            case 'explore':
                return <ExploreView posts={explorePosts} onViewPost={(post) => setModal({ type: 'view-post', post })} />;
            case 'reels':
                return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={() => {}} onCommentOnReel={(reel) => setModal({ type: 'reel-comments', reel })} onShareReel={() => {}} />;
            case 'messages':
                return <MessagesView conversations={conversations} currentUser={currentUser} allUsers={allUsers} onNavigate={(view, user) => handleNavigate(view, user)} />;
            case 'profile':
                return <ProfileView 
                            user={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)}
                            reels={reels.filter(r => r.user.id === currentUser.id)} isCurrentUser={true}
                            currentUser={currentUser} onEditProfile={() => setModal({ type: 'edit-profile' })}
                            onViewArchive={() => handleNavigate('archive')} onFollow={handleFollow}
                            onUnfollow={(user) => setModal({ type: 'unfollow', user })}
                            onShowFollowers={(users) => setModal({ type: 'view-followers', users })}
                            onShowFollowing={(users) => setModal({ type: 'view-following', users })}
                            onEditPost={(post) => setModal({ type: 'edit-post', post })}
                            onViewPost={(post) => setModal({ type: 'view-post', post })} onViewReel={() => {}}
                            onOpenCreateHighlightModal={() => setModal({type: 'create-highlight'})} onMessage={() => {}}
                        />;
            case 'saved':
                return <SavedView posts={posts.filter(p => p.savedBy.some(u => u.id === currentUser.id))} onViewPost={(post) => setModal({ type: 'view-post', post })} />;
            case 'settings':
                return <SettingsView currentUser={currentUser} onNavigate={handleNavigate} 
                            onShowHelp={() => handleNavigate('help')} onShowSupport={() => handleNavigate('support')}
                            onChangePassword={() => setModal({ type: 'change-password' })}
                            onManageAccount={() => setModal({ type: 'edit-profile' })}
                            onToggleTwoFactor={() => setModal({type: '2fa'})} onGetVerified={() => setModal({type: 'get-verified'})}
                            onUpdateSettings={handleUpdateSettings} />;
            case 'premium':
                return <PremiumView onShowPaymentModal={() => setModal({type: 'payment'})} isCurrentUserPremium={currentUser.isPremium} testimonials={testimonials} />;
            case 'premium-welcome':
                return <PremiumWelcomeView onNavigate={handleNavigate} />;
            case 'help':
                return <HelpCenterView articles={helpArticles} onBack={() => handleNavigate('settings')} />;
            case 'support':
                return <SupportInboxView tickets={supportTickets} onBack={() => handleNavigate('settings')} onNewRequest={() => setModal({type: 'new-support-request'})} />;
            case 'activity':
                return <ActivityView activities={notifications} />;
             case 'archive':
                return <ArchiveView posts={posts.filter(p => p.isArchived)} onViewPost={(post) => setModal({ type: 'view-post', post })} onUnarchivePost={() => {}} />;
            default:
                return <div>Not Found</div>;
        }
    };
    
    const renderModal = () => {
        switch (modal.type) {
            case 'create-post':
                return <CreatePostModal onClose={() => setModal({ type: 'none' })} onCreatePost={handleCreatePost} />;
            case 'view-post':
                return <PostModal post={modal.post} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} onComment={handleComment} onShare={(post) => setModal({type: 'share-post', post})} onViewLikes={(users) => setModal({type: 'view-likes', users})} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} onOptions={(post) => setModal({type: 'post-options', post})} />;
             case 'edit-profile':
                return <EditProfileModal user={currentUser} onClose={() => setModal({ type: 'none' })} onSave={handleUpdateProfile} />;
             case 'create-story':
                return <CreateStoryModal onClose={() => setModal({ type: 'none' })} onCreateStory={handleCreateStory} />;
             case 'story-viewer':
                 return <StoryViewer stories={stories} initialStoryIndex={modal.initialIndex} onClose={() => setModal({type: 'none'})} onNextUser={() => {}} onPrevUser={() => {}} />
            case 'view-likes':
                return <ViewLikesModal users={modal.users} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setModal({type: 'unfollow', user})}/>;
            case 'view-followers':
                return <FollowListModal title="Followers" users={modal.users} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setModal({type: 'unfollow', user})}/>;
            case 'view-following':
                return <FollowListModal title="Following" users={modal.users} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setModal({type: 'unfollow', user})}/>;
            case 'unfollow':
                return <UnfollowModal user={modal.user} onCancel={() => setModal({ type: 'none' })} onConfirm={() => handleUnfollow(modal.user)} />;
            case 'post-options':
                return <PostWithOptionsModal post={modal.post} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onUnfollow={(user) => setModal({type: 'unfollow', user})} onFollow={handleFollow} onEdit={(post) => setModal({type: 'edit-post', post})} onDelete={() => {}} onArchive={() => {}} onReport={(content) => setModal({ type: 'report', content })} onShare={(post) => setModal({ type: 'share-post', post })} onCopyLink={() => showToast('Link copied!')} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} onGoToPost={(post) => setModal({type: 'view-post', post})} />;
            case 'edit-post':
                return <EditPostModal post={modal.post} onClose={() => setModal({ type: 'none' })} onSave={() => {}} />;
            case 'share-post':
                 return <ShareModal post={modal.post} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onShareToUser={(user) => showToast(`Post shared with ${user.username}`)} />;
            case 'reel-comments':
                return <ReelCommentsModal reel={modal.reel} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onPostComment={() => {}} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} />;
            case 'create-highlight':
                const userStories = stories.find(s => s.user.id === currentUser.id)?.stories || [];
                return <CreateHighlightModal userStories={userStories} onClose={() => setModal({ type: 'none' })} onCreate={() => showToast('Highlight created!')} />;
            case 'payment':
                return <PaymentModal onClose={() => setModal({ type: 'none' })} onConfirmPayment={handleConfirmPayment} />;
            case 'get-verified':
                return <GetVerifiedModal onClose={() => setModal({ type: 'none' })} onSubmit={() => showToast('Application submitted!')} />;
            case 'change-password':
                return <ChangePasswordModal onClose={() => setModal({ type: 'none' })} onSubmit={async () => showToast('Password changed!')} />;
             case '2fa':
                return <TwoFactorAuthModal onClose={() => setModal({ type: 'none' })} onEnable={() => showToast('2FA Enabled!')} />;
            case 'new-support-request':
                return <NewSupportRequestModal onClose={() => setModal({ type: 'none' })} onSubmit={async () => showToast('Support ticket created!')} />;
            case 'forgot-password':
                return <ForgotPasswordModal onClose={() => setModal({ type: 'none' })} onSubmit={async () => showToast('Password reset link sent!')} />;
             case 'report':
                return <ReportModal content={modal.content} onClose={() => setModal({ type: 'none' })} onSubmitReport={() => {}} />;
             case 'suggestions':
                return <SuggestionsModal users={suggestedUsers} currentUser={currentUser} onClose={() => setModal({ type: 'none' })} onViewProfile={(user) => { setModal({type: 'none'}); handleNavigate('profile', user); }} onFollow={handleFollow} onUnfollow={(user) => setModal({type: 'unfollow', user})}/>
             case 'trends':
                 return <TrendsModal topics={trendingTopics} onClose={() => setModal({type: 'none'})} />;
            case 'account-switcher':
                return <AccountSwitcherModal accounts={accounts} currentUser={currentUser} onClose={() => setModal({type: 'none'})} onSwitchAccount={() => {}} onAddAccount={() => {}} />;
            default:
                return null;
        }
    };
    
    const renderPanel = () => {
        switch (panel) {
            case 'notifications':
                return <NotificationsPanel notifications={notifications} onClose={() => setPanel('none')} />;
            case 'search':
                return <SearchView users={allUsers} onClose={() => setPanel('none')} onViewProfile={(user) => { setPanel('none'); handleNavigate('profile', user); }} />;
            default:
                return null;
        }
    }


    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <div className="flex">
                <LeftSidebar currentUser={currentUser} currentView={view} onNavigate={handleNavigate} onShowSearch={() => setPanel('search')} onShowNotifications={() => setPanel(panel === 'notifications' ? 'none' : 'notifications')} onCreatePost={() => setModal({ type: 'create-post' })} onSwitchAccount={() => setModal({type: 'account-switcher'})} onLogout={handleLogout} />
                <div className="flex-1 md:ml-[72px] lg:ml-64">
                    <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setModal({type: 'account-switcher'})} onCreatePost={() => setModal({ type: 'create-post' })} onShowNotifications={() => setPanel(panel === 'notifications' ? 'none' : 'notifications')} onLogout={handleLogout} />
                    <main className="md:pt-16">
                        {renderView()}
                    </main>
                </div>
            </div>
            
            <BottomNav currentView={view} onNavigate={handleNavigate} onCreatePost={() => setModal({ type: 'create-post' })} currentUser={currentUser} />

            {renderModal()}
            {renderPanel()}
            
             {toast && (
                <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toast} onDismiss={() => setToast(null)} />
                </div>
            )}
        </div>
    );
};

export default App;
