import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import ReelsView from './components/ReelsView';
import MessagesView from './MessagesView';
import ProfileView from './components/ProfileView';
import SavedView from './components/SavedView';
import PostModal from './components/PostModal';
import CreatePostModal from './components/CreatePostModal';
import StoryViewer from './components/StoryViewer';
import NotificationsPanel from './components/NotificationsPanel';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import SearchView from './components/SearchView';
import ShareModal from './components/ShareModal';
import { MOCK_POSTS, MOCK_STORIES, MOCK_USERS, MOCK_REELS, MOCK_CONVERSATIONS } from './constants';
import type { Post, Story, User, Comment, View } from './types';
import { generateCaption } from './services/geminiService';


const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stories] = useState<Story[]>(MOCK_STORIES);
  const [users] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToShare, setPostToShare] = useState<Post | null>(null);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [isSearchPanelOpen, setSearchPanelOpen] = useState(false);
  
  useEffect(() => {
    if (isSearchPanelOpen || isNotificationsPanelOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
  }, [isSearchPanelOpen, isNotificationsPanelOpen]);
  
  const handleNavigate = (newView: View) => {
    setView(newView);
    setSearchPanelOpen(false);
    setNotificationsPanelOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likedByUser: !p.likedByUser, likes: p.likedByUser ? p.likes - 1 : p.likes + 1 } : p));
  };
  
  const handleSave = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, savedByUser: !p.savedByUser } : p));
  };

  const handleComment = (postId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: currentUser,
      text: commentText,
      timestamp: 'Just now',
    };
    const updatedPosts = posts.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    );
    setPosts(updatedPosts);
    if(selectedPost?.id === postId) {
      setSelectedPost(updatedPosts.find(p => p.id === postId) || null);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleCreatePost = async (postData: Omit<Post, 'id' | 'likes' | 'likedByUser' | 'comments' | 'timestamp' | 'savedByUser'>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      ...postData,
      likes: 0,
      likedByUser: false,
      savedByUser: false,
      comments: [],
      timestamp: 'Just now',
    };
    setPosts([newPost, ...posts]);
    setCreatePostModalOpen(false);
  };

  const toggleSearchPanel = () => {
    if (isNotificationsPanelOpen) setNotificationsPanelOpen(false);
    setSearchPanelOpen(p => !p);
  }

  const toggleNotificationsPanel = () => {
    if (isSearchPanelOpen) setSearchPanelOpen(false);
    setNotificationsPanelOpen(p => !p);
  }

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView posts={posts} stories={stories} onLike={handleLike} onComment={handleComment} onViewPost={setSelectedPost} onViewStory={setViewingStory} onSave={handleSave} onShare={setPostToShare} />;
      case 'explore':
        return <ExploreView posts={posts} />;
      case 'reels':
        return <ReelsView reels={MOCK_REELS} />;
      case 'messages':
        return <MessagesView currentUser={currentUser} conversations={MOCK_CONVERSATIONS} />;
      case 'profile':
        return <ProfileView user={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)} />;
      case 'saved':
        return <SavedView posts={posts.filter(p => p.savedByUser)} />;
      case 'settings':
        return <div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p>Settings page coming soon!</p></div>;
      default:
        return <HomeView posts={posts} stories={stories} onLike={handleLike} onComment={handleComment} onViewPost={setSelectedPost} onViewStory={setViewingStory} onSave={handleSave} onShare={setPostToShare} />;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="relative flex min-h-screen">
        <LeftSidebar 
          currentView={view} 
          onNavigate={handleNavigate} 
          onCreatePost={() => setCreatePostModalOpen(true)} 
          onShowNotifications={toggleNotificationsPanel} 
          onShowSearch={toggleSearchPanel}
        />
        
        {isSearchPanelOpen && <SearchView onClose={() => setSearchPanelOpen(false)} users={users} />}
        {isNotificationsPanelOpen && <NotificationsPanel onClose={() => setNotificationsPanelOpen(false)} />}
        
        <main className="w-full transition-all duration-300 md:ml-[72px] lg:ml-64">
           <Header 
              currentUser={currentUser} 
              onNavigate={handleNavigate} 
              onSwitchAccount={() => setAccountSwitcherOpen(true)}
              onSearchFocus={() => {
                setNotificationsPanelOpen(false);
                setSearchPanelOpen(true);
              }}
            />
            <div className="flex justify-center md:px-4">
                <div className="w-full max-w-[630px]">
                    {renderView()}
                </div>
                <div className="hidden xl:block w-[350px] shrink-0 ml-8">
                   <Sidebar currentUser={currentUser} onSwitchAccount={() => setAccountSwitcherOpen(true)} />
                </div>
            </div>
        </main>
      </div>

      <BottomNav currentView={view} onNavigate={handleNavigate} onCreatePost={() => setCreatePostModalOpen(true)} currentUser={currentUser}/>
      
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} onLike={handleLike} onComment={handleComment} />
      )}
      {postToShare && (
        <ShareModal post={postToShare} onClose={() => setPostToShare(null)} />
      )}
      {isCreatePostModalOpen && (
        <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostModalOpen(false)} onCreatePost={handleCreatePost} />
      )}
      {viewingStory && (
        <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />
      )}
      {isAccountSwitcherOpen && (
          <AccountSwitcherModal users={users} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => { setCurrentUser(user); setAccountSwitcherOpen(false); }} />
      )}
    </div>
  );
};

export default App;
