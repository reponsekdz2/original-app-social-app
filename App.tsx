import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView.tsx';
import ExploreView from './components/ExploreView.tsx';
import ReelsView from './components/ReelsView.tsx';
import ProfileView from './components/ProfileView.tsx';
import Header from './components/Header.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import BottomNav from './components/BottomNav.tsx';
import AuthView from './components/AuthView.tsx';
import PostModal from './components/PostModal.tsx';
import StoryViewer from './components/StoryViewer.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import ViewLikesModal from './components/ViewLikesModal.tsx';
import FollowListModal from './components/FollowListModal.tsx';
import AccountSwitcherModal from './components/AccountSwitcherModal.tsx';
import CreateStoryModal from './components/CreateStoryModal.tsx';
import SearchView from './components/SearchView.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import SavedView from './components/SavedView.tsx';
import SettingsView from './components/SettingsView.tsx';
import EditProfileModal from './components/EditProfileModal.tsx';
import PremiumView from './components/PremiumView.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import Toast from './components/Toast.tsx';
import MessagesView from './MessagesView.tsx';

import * as api from './services/apiService.ts';
import { socketService } from './services/socketService.ts';

import type { User, Post, Story, Reel, View, Conversation } from './types.ts';

const App: React.FC = () => {
    // Overall App State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('home');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [appData, setAppData] = useState<any>({}); // For other data like trending, sponsored etc.


    // Modal & Panel State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsVisible, setNotificationsVisible] = useState(false);
    
    // This would be managed by a router in a real app
    const navigate = (newView: View, data?: any) => {
        if (newView === 'profile' && data) {
            setProfileUser(data);
        } else if (newView === 'profile' && !data) {
            setProfileUser(currentUser);
        }
        setView(newView);
        // Close panels on navigation
        setSearchVisible(false);
        setNotificationsVisible(false);
    };
    
    const showToast = (message: string) => {
        setToastMessage(message);
    };

    const handleLoginSuccess = async (user: User) => {
        setCurrentUser(user);
        socketService.connect(user.id);
        
        // Fetch all app data after login
        try {
            const data = await api.getAppData(user.id);
            setUsers(data.users);
            setPosts(data.posts);
            setStories(data.stories);
            setReels(data.reels);
            setConversations(data.conversations);
            setAppData(data);
            setView('home');
        } catch (error) {
            console.error("Failed to load app data", error);
            showToast("Could not load app data.");
        }
    };
    
    useEffect(() => {
        // Mock auto-login for development
        // In a real app, you'd check for a token in localStorage
        const devUserId = 'user-1';
        if (!currentUser && devUserId) {
            api.getAppData(devUserId).then(data => {
                const loggedInUser = data.users.find((u: User) => u.id === devUserId);
                if (loggedInUser) {
                    handleLoginSuccess(loggedInUser);
                }
            });
        }
        
        return () => {
            socketService.disconnect();
        };
    }, []);


    if (!currentUser) {
        return <AuthView onLoginSuccess={handleLoginSuccess} onForgotPassword={() => showToast("Password reset email sent (mock).")} />;
    }
    
    const renderView = () => {
        switch(view) {
            case 'explore': return <ExploreView posts={posts} onViewPost={(post) => { setActiveModal('post'); setModalData(post); }} />;
            case 'reels': return <ReelsView reels={reels} currentUser={currentUser} onLikeReel={() => {}} onCommentOnReel={() => {}} onShareReel={() => {}} />;
            case 'profile': return <ProfileView user={profileUser || currentUser} posts={posts.filter(p => p.user.id === (profileUser || currentUser).id)} reels={reels.filter(r => r.user.id === (profileUser || currentUser).id)} isCurrentUser={profileUser?.id === currentUser.id || profileUser === null} currentUser={currentUser} onEditProfile={() => setActiveModal('edit-profile')} onViewPost={(post) => { setActiveModal('post'); setModalData(post); }} onShowFollowers={(users) => { setActiveModal('follow-list'); setModalData({title: 'Followers', users})}} onShowFollowing={(users) => { setActiveModal('follow-list'); setModalData({title: 'Following', users})}} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => showToast(`Unfollowed ${user.username}`)} onViewReel={() => {}} onMessage={(user) => { navigate('messages'); }} onOpenCreateHighlightModal={() => {}} onViewArchive={() => {}} />;
            case 'saved': return <SavedView posts={posts.filter(p => p.isSaved)} onViewPost={(post) => { setActiveModal('post'); setModalData(post); }} />;
            case 'settings': return <SettingsView currentUser={currentUser} onNavigate={navigate} onShowHelp={() => {}} onShowSupport={() => {}} onChangePassword={() => {}} onManageAccount={() => setActiveModal('edit-profile')} onTwoFactorAuth={() => {}} onGetVerified={() => {}} />;
            case 'premium': return <PremiumView testimonials={appData.testimonials || []} isCurrentUserPremium={currentUser.isPremium} onShowPaymentModal={() => setActiveModal('payment')} />;
            case 'messages': return <MessagesView conversations={conversations} setConversations={setConversations} currentUser={currentUser} onSendMessage={() => {}} onViewProfile={(user) => navigate('profile', user)} onInitiateCall={(user, type) => { setActiveModal('call'); setModalData({user, type})}} onUpdateUserRelationship={() => {}} onNewMessage={() => {}} conversationToSelect={null} setConversationToSelect={() => {}} />;
            case 'home':
            default:
                return <HomeView 
                    posts={posts} 
                    stories={stories} 
                    currentUser={currentUser} 
                    suggestedUsers={appData.suggestedUsers || []}
                    trendingTopics={appData.trendingTopics || []}
                    feedActivities={appData.feedActivities || []}
                    sponsoredContent={appData.sponsoredContent || []}
                    conversations={conversations}
                    onToggleLike={() => {}}
                    onToggleSave={() => {}}
                    onComment={() => {}}
                    onShare={(post) => { setActiveModal('share'); setModalData(post); }}
                    onViewStory={(story) => { setActiveModal('story'); setModalData({stories: stories, startIndex: stories.indexOf(story)}); }}
                    onViewLikes={(users) => { setActiveModal('view-likes'); setModalData(users); }}
                    onViewProfile={(user) => navigate('profile', user)}
                    onViewPost={(post) => { setActiveModal('post'); setModalData(post); }}
                    onOptions={() => {}}
                    onShowSuggestions={() => {}}
                    onShowTrends={() => {}}
                    onCreateStory={() => setActiveModal('create-story')}
                    onShowSearch={() => setSearchVisible(true)}
                    onNavigate={navigate}
                    onFollow={(user) => showToast(`Followed ${user.username}`)}
                    onUnfollow={(user) => showToast(`Unfollowed ${user.username}`)}
                />;
        }
    }
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Header 
                currentUser={currentUser} 
                onNavigate={navigate}
                onCreatePost={() => setActiveModal('create-post')}
                onShowNotifications={() => setNotificationsVisible(true)}
                onLogout={() => setCurrentUser(null)}
                onSwitchAccount={() => setActiveModal('switch-account')}
            />
            <div className="flex">
                <LeftSidebar 
                    currentUser={currentUser} 
                    currentView={view} 
                    onNavigate={navigate}
                    onCreatePost={() => setActiveModal('create-post')}
                    onShowNotifications={() => setNotificationsVisible(true)}
                    onShowSearch={() => setSearchVisible(true)}
                    onLogout={() => setCurrentUser(null)}
                    onSwitchAccount={() => setActiveModal('switch-account')}
                />
                <main className="flex-1 md:ml-[72px] lg:ml-64">
                    {renderView()}
                </main>
            </div>
            <BottomNav 
                currentUser={currentUser} 
                currentView={view} 
                onNavigate={navigate}
                onCreatePost={() => setActiveModal('create-post')}
            />
            
            {/* Modals & Panels */}
            {activeModal === 'post' && modalData && <PostModal post={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onToggleLike={() => {}} onToggleSave={() => {}} onComment={() => {}} onToggleCommentLike={() => {}} onShare={(post) => { setActiveModal('share'); setModalData(post); }} onViewLikes={(users) => { setActiveModal('view-likes'); setModalData(users); }} onViewProfile={(user) => { setActiveModal(null); navigate('profile', user);}} onOptions={() => {}} />}
            {activeModal === 'story' && modalData && <StoryViewer stories={modalData.stories} startIndex={modalData.startIndex} onClose={() => setActiveModal(null)} onViewProfile={(user) => { setActiveModal(null); navigate('profile', user); }} onReply={() => {}} onShare={() => {}} />}
            {activeModal === 'create-post' && <CreatePostModal currentUser={currentUser} onClose={() => setActiveModal(null)} onCreatePost={() => { setActiveModal(null); showToast("Post created successfully!"); }} />}
            {activeModal === 'create-story' && <CreateStoryModal onClose={() => setActiveModal(null)} onCreateStory={() => { setActiveModal(null); showToast("Story added!"); }} />}
            {activeModal === 'share' && modalData && <ShareModal content={modalData} users={users} onClose={() => setActiveModal(null)} onSendShare={() => showToast("Shared successfully!")} onCopyLink={() => showToast("Link copied!")} />}
            {activeModal === 'view-likes' && modalData && <ViewLikesModal users={modalData} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={(user) => { setActiveModal(null); navigate('profile', user);}} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => showToast(`Unfollowed ${user.username}`)} />}
            {activeModal === 'follow-list' && modalData && <FollowListModal title={modalData.title} users={modalData.users} currentUser={currentUser} onClose={() => setActiveModal(null)} onViewProfile={(user) => { setActiveModal(null); navigate('profile', user);}} onFollow={(user) => showToast(`Followed ${user.username}`)} onUnfollow={(user) => showToast(`Unfollowed ${user.username}`)} />}
            {activeModal === 'switch-account' && <AccountSwitcherModal accounts={users.slice(0,3)} currentUser={currentUser} onClose={() => setActiveModal(null)} onSwitchAccount={() => {}} onAddAccount={() => {}} />}
            {activeModal === 'edit-profile' && <EditProfileModal user={currentUser} onClose={() => setActiveModal(null)} onSave={(updatedUser) => { setCurrentUser(updatedUser); setActiveModal(null); showToast("Profile updated!"); }} />}
            {activeModal === 'payment' && <PaymentModal onClose={() => setActiveModal(null)} onConfirmPayment={() => { setCurrentUser({...currentUser, isPremium: true }); setActiveModal(null); showToast("Welcome to Premium!"); }} />}
            {activeModal === 'call' && modalData && <CallModal user={modalData.user} type={modalData.type} onClose={() => setActiveModal(null)} />}

            {isSearchVisible && <SearchView users={users} onClose={() => setSearchVisible(false)} onViewProfile={(user) => navigate('profile', user)} />}
            {isNotificationsVisible && <NotificationsPanel notifications={appData.notifications || []} onClose={() => setNotificationsVisible(false)} />}
            
             {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
                </div>
            )}
        </div>
    );
};

export default App;
