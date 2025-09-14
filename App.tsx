import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StoryBubble from './components/StoryBubble';
import Post from './components/Post';
import Sidebar from './components/Sidebar';
import CreatePostModal from './components/CreatePostModal';
import PostModal from './components/PostModal';
import StoryViewer from './components/StoryViewer';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import LeftSidebar from './components/LeftSidebar';
import MessagesView from './MessagesView';
import ExploreView from './components/ExploreView';
import ReelsView from './components/ReelsView';
import ProfileView from './components/ProfileView';

import type { Post as PostType, Story as StoryType, User, Conversation as ConvoType, View } from './types';
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES, MOCK_CONVERSATIONS, MOCK_REELS } from './constants';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [posts, setPosts] = useState<PostType[]>(MOCK_POSTS);
  const [stories, setStories] = useState<StoryType[]>(MOCK_STORIES);
  const [conversations, setConversations] = useState<ConvoType[]>(MOCK_CONVERSATIONS);
  
  const [activeView, setActiveView] = useState<View>('home');

  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<PostType | null>(null);
  const [viewingStory, setViewingStory] = useState<StoryType | null>(null);
  const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likedByUser: !p.likedByUser, likes: p.likedByUser ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleComment = (postId: string, commentText: string) => {
    const newComment = { id: `comment-${Date.now()}`, user: currentUser, text: commentText, timestamp: 'Just now' };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  };
  
  const handleCreatePost = (newPostData: Omit<PostType, 'id' | 'likes' | 'likedByUser' | 'comments' | 'timestamp'>) => {
    const newPost: PostType = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 0,
      likedByUser: false,
      comments: [],
      timestamp: 'JUST NOW',
    };
    setPosts([newPost, ...posts]);
    setCreatePostModalOpen(false);
  };
  
  const handleViewStory = (story: StoryType) => {
    setViewingStory(story);
    setStories(stories.map(s => s.id === story.id ? {...s, viewed: true} : s));
  };

  const handleSendMessage = (convoId: string, content: string, type: 'text' | 'image' | 'voice') => {
      const newMessage = { id: `msg-${Date.now()}`, senderId: currentUser.id, content, type, timestamp: 'Just now', reactions: [] };
      setConversations(convos => convos.map(c => c.id === convoId ? {...c, messages: [...c.messages, newMessage]} : c));
  };

  useEffect(() => {
    document.body.className = 'bg-black text-white overflow-hidden';
  }, []);

  const renderActiveView = () => {
    switch(activeView) {
      case 'explore':
        return <ExploreView posts={posts} onViewPost={setViewingPost} />;
      case 'reels':
        return <ReelsView reels={MOCK_REELS} />;
      case 'profile':
        return <ProfileView currentUser={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)} onViewPost={setViewingPost} />;
      case 'messages':
        return <MessagesView currentUser={currentUser} conversations={conversations} onSendMessage={handleSendMessage} onDeleteMessage={() => {}} onReact={() => {}} />;
      case 'home':
      default:
        return (
          <div className="w-full lg:w-2/3">
             <div className="px-4 md:px-0">
                <div className="py-4 border-b border-gray-800 overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-4">
                    {stories.map(story => (
                      <StoryBubble key={story.id} story={story} onView={handleViewStory} />
                    ))}
                  </div>
                </div>

                <div className="max-w-xl mx-auto py-6">
                  {posts.map(post => (
                    <Post 
                      key={post.id} 
                      post={post} 
                      onLike={handleLikePost} 
                      onComment={handleComment} 
                      onViewPost={setViewingPost}
                    />
                  ))}
                </div>
             </div>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftSidebar 
        activeView={activeView}
        onNavigate={setActiveView}
        onCreatePost={() => setCreatePostModalOpen(true)} 
      />
      <div className="w-full lg:pl-64 flex flex-col h-screen">
        <Header 
            onNavigate={setActiveView}
            onCreatePost={() => setCreatePostModalOpen(true)} 
            onSwitchAccount={() => setAccountSwitcherOpen(true)}
            currentUser={currentUser}
        />
        <main className="pt-16 flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-screen-xl flex">
            {renderActiveView()}
            {activeView === 'home' && (
              <div className="hidden lg:block w-1/3">
                <Sidebar currentUser={currentUser} onSwitchAccount={() => setAccountSwitcherOpen(true)} />
              </div>
            )}
          </div>
        </main>
      </div>

      {isCreatePostModalOpen && <CreatePostModal currentUser={currentUser} onClose={() => setCreatePostModalOpen(false)} onCreatePost={handleCreatePost} />}
      {viewingPost && <PostModal post={viewingPost} onClose={() => setViewingPost(null)} onLike={handleLikePost} onComment={handleComment} />}
      {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}
      {isAccountSwitcherOpen && <AccountSwitcherModal users={MOCK_USERS} currentUser={currentUser} onClose={() => setAccountSwitcherOpen(false)} onSwitchUser={(user) => { setCurrentUser(user); setAccountSwitcherOpen(false); }} />}
    </div>
  );
};

export default App;