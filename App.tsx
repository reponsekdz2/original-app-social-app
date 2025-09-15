// Fix: Create the main App component to structure the application.
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES, MOCK_REELS, MOCK_CONVERSATIONS, MOCK_ACTIVITIES } from './constants';
import type { User, Post as PostType, Story as StoryType, View, Reel as ReelType, Conversation, StoryItem } from './types';

// Import views
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import ReelsView from './components/ReelsView';
import MessagesView from './MessagesView';
import ProfileView from './components/ProfileView';
import SavedView from './components/SavedView';
import SettingsView from './components/SettingsView';
import PremiumView from './components/PremiumView';
import ArchiveView from './components/ArchiveView';

// Import components
import Header from './components/Header';
import PostModal from './components/PostModal';
import CreatePostModal from './components/CreatePostModal';
import StoryViewer from './components/StoryViewer';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import ShareModal from './components/ShareModal';
import LeftSidebar from './components/LeftSidebar';
import BottomNav from './components/BottomNav';
import SearchView from './components/SearchView';
import NotificationsPanel from './components/NotificationsPanel';
import CreateStoryModal from './components/CreateStoryModal';
import GetVerifiedModal from './components/GetVerifiedModal';
import EditProfileModal from './components/EditProfileModal';
import FollowListModal from './components/FollowListModal';
// Fix: Import the 'Sidebar' component to resolve the 'Cannot find name' error.
import Sidebar from './components/Sidebar';

type PostData = {
    user: User;
    media: string;
    mediaType: 'image' | 'video';
    caption: string;
};

type FollowListModalData = {
    type: 'followers' | 'following';
    users: User[];
}

const App: React.FC = () => {
    // State management...
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
    const [posts, setPosts] = useState<PostType[]>(MOCK_POSTS);
    const [stories, setStories] = useState<StoryType[]>(MOCK_STORIES);
    const [reels, setReels] = useState<ReelType[]>(MOCK_REELS);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

    const [currentView, setCurrentView] = useState<View>('home');
    const [viewingPost, setViewingPost] = useState<PostType | null>(null);
    const [viewingStoryData, setViewingStoryData] = useState<{ stories: StoryType[], startIndex: number } | null>(null);
    const [sharingPost, setSharingPost] = useState<PostType | null>(null);

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);
    const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [isNotificationsPanelVisible, setNotificationsPanelVisible] = useState(false);
    const [isVerifiedModalOpen, setVerifiedModalOpen] = useState(false);
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [followListModalData, setFollowListModalData] = useState<FollowListModalData | null>(null);

    // Handlers...
    const handleLike = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, likedByUser: !p.likedByUser, likes: p.likedByUser ? p.likes - 1 : p.likes + 1 } : p));
        if (viewingPost?.id === postId) {
            setViewingPost(post => post ? { ...post, likedByUser: !post.likedByUser, likes: post.likedByUser ? post.likes - 1 : post.likes + 1 } : null);
        }
    };

    const handleComment = (postId: string, commentText: string) => {
        const newComment = { id: `c-${Date.now()}`, user: currentUser, text: commentText, timestamp: 'Just now' };
        const updatePost = (p: PostType) => ({ ...p, comments: [...p.comments, newComment] });
        setPosts(posts.map(p => p.id === postId ? updatePost(p) : p));
        if (viewingPost?.id === postId) {
            setViewingPost(p => p ? updatePost(p) : null);
        }
    };
    
    const handleViewStory = (storyToView: StoryType) => {
        const startIndex = stories.findIndex(s => s.id === storyToView.id);
        if (startIndex > -1) {
            setViewingStoryData({ stories, startIndex });
        }
    };

    const handleSave = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, savedByUser: !p.savedByUser } : p));
    };

    const handleSwitchAccount = (user: User) => {
        setCurrentUser(user);
        setAccountSwitcherOpen(false);
    };
    
    const handleCreatePost = (postData: PostData) => {
        const newPost: PostType = {
            ...postData,
            id: `post-${Date.now()}`,
            likes: 0,
            likedByUser: false,
            comments: [],
            timestamp: 'Just now',
            savedByUser: false,
        };
        setPosts([newPost, ...posts]);
        setCreateModalOpen(false);
        setCurrentView('home');
    };
    
    const handleCreateStory = (newStoryItem: Omit<StoryItem, 'id'>) => {
        const fullStoryItem: StoryItem = { ...newStoryItem, id: `s-ai-${Date.now()}`};
        
        setStories(prevStories => {
            const currentUserStoryIndex = prevStories.findIndex(s => s.user.id === currentUser.id);
            const newStories = [...prevStories];

            if (currentUserStoryIndex > -1) {
                // Add to existing story
                const updatedStory = { ...newStories[currentUserStoryIndex] };
                updatedStory.stories = [fullStoryItem, ...updatedStory.stories];
                newStories[currentUserStoryIndex] = updatedStory;
            } else {
                // Create new story for user if they don't have one
                const newStory: StoryType = {
                    id: `story-${currentUser.id}`,
                    user: currentUser,
                    stories: [fullStoryItem]
                };
                newStories.unshift(newStory);
            }
            return newStories;
        });
        setCreateStoryModalOpen(false);
    };

    const handleSubscribeToPremium = () => {
      setCurrentUser(prevUser => ({...prevUser, isPremium: true}));
    };

    const handleUpdateUser = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setEditProfileModalOpen(false);
    };

    const handleUnfollow = (userIdToUnfollow: string) => {
        // Update current user's following list
        const updatedCurrentUser = {
            ...currentUser,
            following: currentUser.following.filter(id => id !== userIdToUnfollow)
        };
        setCurrentUser(updatedCurrentUser);

        // Update the unfollowed user's followers list
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === currentUser.id) {
                return updatedCurrentUser;
            }
            if (user.id === userIdToUnfollow) {
                return {
                    ...user,
                    followers: user.followers.filter(id => id !== currentUser.id)
                };
            }
            return user;
        }));
        
        // Refresh modal data
        if(followListModalData){
            const newFollowListUsers = followListModalData.users.filter(u => u.id !== userIdToUnfollow);
            setFollowListModalData({ ...followListModalData, users: newFollowListUsers });
        }
    };
    
    const showFollowList = (type: 'followers' | 'following') => {
        const userListIds = type === 'followers' ? currentUser.followers : currentUser.following;
        const userList = users.filter(u => userListIds.includes(u.id));
        setFollowListModalData({ type, users: userList });
    };

    const handleNavigate = (view: View) => {
        if (currentView === 'messages' && view !== 'messages') {
        }
        setCurrentView(view);
    }

    const renderView = () => {
        switch (currentView) {
            case 'home':
                return <HomeView posts={posts} stories={stories} onLike={handleLike} onComment={handleComment} onViewPost={setViewingPost} onViewStory={handleViewStory} onSave={handleSave} onShare={setSharingPost} onCreateStory={() => setCreateStoryModalOpen(true)} currentUser={currentUser} />;
            case 'explore':
                return <ExploreView posts={posts} />;
            case 'reels':
                return <ReelsView reels={reels} />;
            case 'messages':
                return <MessagesView currentUser={currentUser} conversations={conversations} />;
            case 'profile':
                return <ProfileView 
                            user={currentUser} 
                            posts={posts.filter(p => p.user.id === currentUser.id && !p.isArchived)} 
                            onEditProfile={() => setEditProfileModalOpen(true)}
                            onViewArchive={() => handleNavigate('archive')}
                            onViewFollowers={() => showFollowList('followers')}
                            onViewFollowing={() => showFollowList('following')}
                            onCreatePost={() => setCreateModalOpen(true)}
                        />;
            case 'saved':
                return <SavedView posts={posts.filter(p => p.savedByUser)} />;
            case 'settings':
                return <SettingsView onGetVerified={() => setVerifiedModalOpen(true)} />;
            case 'premium':
                return <PremiumView onSubscribe={handleSubscribeToPremium} isCurrentUserPremium={currentUser.isPremium ?? false} />;
            case 'archive':
                return <ArchiveView posts={posts.filter(p => p.user.id === currentUser.id && p.isArchived)} />;
            default:
                return <HomeView posts={posts} stories={stories} onLike={handleLike} onComment={handleComment} onViewPost={setViewingPost} onViewStory={handleViewStory} onSave={handleSave} onShare={setSharingPost} onCreateStory={() => setCreateStoryModalOpen(true)} currentUser={currentUser} />;
        }
    };
    
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Header 
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onSwitchAccount={() => setAccountSwitcherOpen(true)}
                onCreatePost={() => setCreateModalOpen(true)}
                onShowNotifications={() => setNotificationsPanelVisible(true)}
                onShowSearch={() => setSearchVisible(true)}
            />
            <div className="container mx-auto flex">
                 <LeftSidebar 
                    currentView={currentView}
                    onNavigate={handleNavigate}
                    onCreatePost={() => setCreateModalOpen(true)}
                    currentUser={currentUser}
                    onShowSearch={() => setSearchVisible(true)}
                    onShowNotifications={() => setNotificationsPanelVisible(true)}
                />
                 
                <main className={`w-full md:pl-[72px] lg:pl-64 ${currentView === 'messages' ? 'flex justify-center' : ''}`}>
                    <div className="flex justify-center w-full">
                        <div className={`w-full ${currentView !== 'messages' ? 'max-w-[630px] border-x border-gray-800' : ''} min-h-screen`}>
                            {renderView()}
                        </div>
                        <div className="hidden lg:block w-[320px] ml-8">
                           {currentView === 'home' && <Sidebar currentUser={currentUser} onSwitchAccount={() => setAccountSwitcherOpen(true)} />}
                        </div>
                    </div>
                </main>
            </div>
            
             <BottomNav 
                currentView={currentView}
                onNavigate={handleNavigate}
                onCreatePost={() => setCreateModalOpen(true)}
                currentUser={currentUser}
            />

            {/* Modals */}
            {viewingPost && <PostModal post={viewingPost} onClose={() => setViewingPost(null)} onLike={handleLike} onComment={handleComment} />}
            {isCreateModalOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreateModalOpen(false)} onCreatePost={handleCreatePost} />}
            {isCreateStoryModalOpen && <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreateStory={handleCreateStory} />}
            {viewingStoryData && <StoryViewer stories={viewingStoryData.stories} startIndex={viewingStoryData.startIndex} onClose={() => setViewingStoryData(null)} />}
            {isAccountSwitcherOpen && <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={handleSwitchAccount} />}
            {sharingPost && <ShareModal post={sharingPost} onClose={() => setSharingPost(null)} />}
            {isSearchVisible && <SearchView users={users} onClose={() => setSearchVisible(false)} />}
            {isNotificationsPanelVisible && <NotificationsPanel activities={MOCK_ACTIVITIES} onClose={() => setNotificationsPanelVisible(false)} />}
            {isVerifiedModalOpen && <GetVerifiedModal onClose={() => setVerifiedModalOpen(false)} />}
            {isEditProfileModalOpen && <EditProfileModal currentUser={currentUser} onUpdateUser={handleUpdateUser} onClose={() => setEditProfileModalOpen(false)} />}
            {followListModalData && <FollowListModal 
                                        listType={followListModalData.type}
                                        users={followListModalData.users}
                                        currentUserFollowing={currentUser.following}
                                        onUnfollow={handleUnfollow}
                                        onClose={() => setFollowListModalData(null)} 
                                     />}
        </div>
    );
}

export default App;