import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';
import type { View, User, Post, Story, Reel, Notification, Conversation, FeedActivity, SponsoredContent, TrendingTopic, Testimonial, HelpArticle, SupportTicket, Message } from './types.ts';

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
import ReportModal from './components/ReportModal.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SearchView from './components/SearchView.tsx';
import TrendsModal from './components/TrendsModal.tsx';
import SuggestionsModal from './components/SuggestionsModal.tsx';
import Toast from './components/Toast.tsx';

type ModalState =
  | { type: 'none' } | { type: 'create-post' } | { type: 'view-post', post: Post }
  | { type: 'edit-post', post: Post } | { type: 'post-options', post: Post }
  | { type: 'share', content: Post | Reel } | { type: 'view-likes', users: User[] }
  | { type: 'view-followers', users: User[] } | { type: 'view-following', users: User[] }
  | { type: 'create-story' } | { type: 'story-viewer', initialIndex: number }
  | { type: 'account-switcher' } | { type: 'unfollow', user: User }
  | { type: 'edit-profile' } | { type: 'reel-comments', reel: Reel }
  | { type: 'create-highlight' } | { type: 'get-verified' } | { type: 'payment' }
  | { type: 'change-password' } | { type: '2fa' } | { type: 'new-support-request' }
  | { type: 'forgot-password' } | { type: 'report', content: Post | User }
  | { type: 'trends' } | { type: 'suggestions' };

type PanelState = 'none' | 'notifications' | 'search';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [accounts, setAccounts] = useState<User[]>([]);
    const [view, setView] = useState<View>('home');
    const [modal, setModal] = useState<ModalState>({ type: 'none' });
    const [panel, setPanel] = useState<PanelState>('none');
    const [toast, setToast] = useState<string | null>(null);

    // Data States
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
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
    
    const showToast = (message: string) => { setToast(message); };

    const fetchData = useCallback(async () => {
        if (!api.getAuthToken()) { setIsLoading(false); return; }
        try {
            const [
                feedRes, storiesRes, reelsRes, exploreRes, usersRes, notificationsRes,
                miscRes, premiumRes, helpRes, supportRes, savedRes, archivedRes
            ] = await Promise.all([
                api.getFeed(), api.getStories(), api.getReels(), api.getExplorePosts(),
                api.getAllUsers(), api.getNotifications(), api.getMiscFeedData(),
                api.getPremiumData(), api.getHelpArticles(), api.getSupportTickets(),
                api.getSavedPosts(), api.getArchivedPosts()
            ]);
            setPosts(feedRes.posts); setStories(storiesRes.stories); setReels(reelsRes.reels);
            setExplorePosts(exploreRes.posts); setAllUsers(usersRes.users); setNotifications(notificationsRes.notifications);
            setFeedActivities(miscRes.feedActivities); setTrendingTopics(miscRes.trendingTopics);
            setSponsoredContent(miscRes.sponsoredContent); setTestimonials(premiumRes.testimonials);
            setHelpArticles(helpRes.articles); setSupportTickets(supportRes.tickets);
            setSavedPosts(savedRes.posts); setArchivedPosts(archivedRes.posts);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            if (error instanceof Error && (error.message.includes("401") || error.message.includes("token"))) handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = api.getAuthToken();
        if (token) {
            setIsLoading(true);
            // This is a placeholder for getting the current user. A /me endpoint is better.
            // For now, we fetch all and assume the first is the logged in user for demo.
            api.getAllUsers().then(data => {
                const user = data.users.find(u => u.id === 'some-stored-id') || data.users[0];
                if (user) {
                    setCurrentUser(user);
                    socketService.connect(user.id);
                    fetchData();
                } else { setIsLoading(false); }
            }).catch(() => { handleLogout(); setIsLoading(false); });
        } else { setIsLoading(false); }
        return () => socketService.disconnect();
    }, [fetchData]);

    useEffect(() => {
        const handleNewNotification = (newNotification: Notification) => {
            setNotifications(prev => [newNotification, ...prev]);
            showToast(`New notification from ${newNotification.user.username}`);
        };
        const handleNewMessage = (newMessage: { conversationId: string, message: Message }) => {
            setConversations(prev => prev.map(c => c.id === newMessage.conversationId ? { ...c, messages: [...c.messages, newMessage.message] } : c));
        };
        socketService.on('new_notification', handleNewNotification);
        socketService.on('receive_message', handleNewMessage);
        return () => {
            socketService.off('new_notification', handleNewNotification);
            socketService.off('receive_message', handleNewMessage);
        };
    }, []);

    const handleLoginSuccess = ({ user, token }: { user: User, token: string }) => {
        api.setAuthToken(token); setCurrentUser(user);
        socketService.connect(user.id); fetchData();
    };

    const handleLogout = () => {
        api.setAuthToken(null); setCurrentUser(null); socketService.disconnect(); setView('home');
    };
    
    const handleNavigate = (newView: View, data?: any) => { setPanel('none'); setView(newView); window.scrollTo(0, 0); };
    
    // --- MUTATION HANDLERS ---
    const handleToggleLike = async (postId: string) => { await api.togglePostLike(postId).catch(fetchData); };
    const handleToggleSave = async (postId: string) => { await api.togglePostSave(postId).catch(fetchData); };
    const handleComment = async (postId: string, text: string) => { await api.addComment(postId, text); fetchData(); };
    const handleFollow = async (userToFollow: User) => { await api.followUser(userToFollow.id); fetchData(); showToast(`Followed @${userToFollow.username}`); };
    const handleUnfollow = async (userToUnfollow: User) => { await api.unfollowUser(userToUnfollow.id); fetchData(); setModal({ type: 'none' }); showToast(`Unfollowed @${userToUnfollow.username}`); };
    const handleCreatePost = async (formData: FormData) => { await api.createPost(formData); fetchData(); setModal({type: 'none'}); showToast("Post created!"); };
    const handleCreateStory = async (formData: FormData) => { await api.createStory(formData); fetchData(); setModal({type: 'none'}); showToast("Story added!"); };
    const handleUpdateProfile = async (formData: FormData) => { const updatedUser = await api.updateProfile(formData); setCurrentUser(updatedUser); setModal({ type: 'none' }); showToast("Profile updated!"); };
    const handleUpdateSettings = async (settings: object) => { await api.updateSettings(settings); fetchData(); showToast("Settings updated."); };
    const handleConfirmPayment = () => { /* Mock for now */ if(!currentUser) return; setCurrentUser({ ...currentUser, isPremium: true }); setModal({ type: 'none' }); setView('premium-welcome'); };
    const handleArchivePost = async (post: Post) => { await api.archivePost(post.id); fetchData(); showToast('Post archived'); };
    const handleUnarchivePost = async (post: Post) => { await api.unarchivePost(post.id); fetchData(); showToast('Post unarchived'); };
    const handleDeletePost = async (post: Post) => { await api.deletePost(post.id); fetchData(); showToast('Post deleted'); };
    const handleEditPost = async (post: Post) => { await api.editPost(post.id, post.caption, post.location || ''); fetchData(); showToast('Post updated'); };
    const handleCreateHighlight = async (title: string, storyIds: string[]) => { await api.createHighlight(title, storyIds); fetchData(); setModal({type: 'none'}); showToast('Highlight created'); };
    const handleChangePassword = async (oldPass: string, newPass: string) => { await api.changePassword(oldPass, newPass); showToast('Password changed successfully!'); };
    const handleStoryReply = async (story: Story, message: string) => { await api.sendMessage(story.user.id, message, 'text'); showToast(`Replied to ${story.user.username}'s story`); };
    const handleShareAsMessage = async (recipient: User, content: Post | Reel) => { await api.sendMessage(recipient.id, `Check out this ${'caption' in content ? 'post' : 'reel'}!`, 'share_post', content.id); showToast(`Shared to ${recipient.username}`); };
    const handleSubmitReport = async (content: Post | User, reason: string) => { const type = 'username' in content ? 'user' : 'post'; await api.submitReport(content.id, type, reason); setModal({ type: 'none' }); showToast('Report submitted. Thank you.'); };
    const handleSubmitSupportTicket = async (subject: string, description: string) => { await api.submitSupportTicket(subject, description); setSupportTickets(prev => [...prev, { id: Date.now().toString(), subject, status: 'Open', lastUpdated: 'Just now' }]); setModal({ type: 'none' }); showToast('Support ticket created.'); };
    const handleToggleReelLike = async (reelId: string) => { await api.toggleReelLike(reelId); fetchData(); };
    const handlePostReelComment = async (reelId: string, text: string) => { await api.addReelComment(reelId, text); fetchData(); };
    const handleToggleCommentLike = async (commentId: string) => { await api.toggleCommentLike(commentId); fetchData(); };
    
    // --- RENDER LOGIC ---
    if (isLoading) return <div className="bg-black w-screen h-screen flex items-center justify-center text-white">Loading...</div>;
    if (!currentUser) return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setModal({ type: 'forgot-password' })} />;

    const renderView = () => { /* ... switch statement ... */ };
    const renderModal = () => { /* ... switch statement ... */ };
    const renderPanel = () => { /* ... switch statement ... */ };
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <div className="flex">
                <LeftSidebar currentUser={currentUser} currentView={view} onNavigate={handleNavigate} onShowSearch={() => setPanel('search')} onShowNotifications={() => setPanel(panel === 'notifications' ? 'none' : 'notifications')} onCreatePost={() => setModal({ type: 'create-post' })} onSwitchAccount={() => setModal({type: 'account-switcher'})} onLogout={handleLogout} />
                <div className="flex-1 md:ml-[72px] lg:ml-64">
                    <Header currentUser={currentUser} onNavigate={handleNavigate} onSwitchAccount={() => setModal({type: 'account-switcher'})} onCreatePost={() => setModal({ type: 'create-post' })} onShowNotifications={() => setPanel(panel === 'notifications' ? 'none' : 'notifications')} onLogout={handleLogout} />
                    <main className="md:pt-16">{/* Render View Here */}</main>
                </div>
            </div>
            <BottomNav currentView={view} onNavigate={handleNavigate} onCreatePost={() => setModal({ type: 'create-post' })} currentUser={currentUser} />
            {/* Render Modal & Panel Here */}
            {toast && <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-50"><Toast message={toast} onDismiss={() => setToast(null)} /></div>}
        </div>
    );
};
export default App;
