import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Post as PostType, Story, Comment, User, Conversation, Message, MessageType } from './types';
import Header from './components/Header';
import Post from './components/Post';
import StoryBubble from './components/StoryBubble';
import Sidebar from './components/Sidebar';
import PostModal from './components/PostModal';
import CreatePostModal from './components/CreatePostModal';
import LeftSidebar from './components/LeftSidebar';
import Icon from './components/Icon';
import StoryViewer from './components/StoryViewer';
import MessagesView from './MessagesView';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import { MOCK_POSTS, MOCK_STORIES, CURRENT_USER, MOCK_CONVERSATIONS, ALL_USERS } from './constants';

const App: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>(MOCK_POSTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);

  const storiesContainerRef = useRef<HTMLDivElement>(null);
  const [showPrevStoryButton, setShowPrevStoryButton] = useState(false);
  const [showNextStoryButton, setShowNextStoryButton] = useState(false);

  const totalUnreadCount = conversations.reduce((sum, convo) => sum + convo.unreadCount, 0);

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likedByUser: !post.likedByUser, likes: post.likedByUser ? post.likes - 1 : post.likes + 1 }
        : post
    ));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likedByUser: !prev.likedByUser, likes: prev.likedByUser ? prev.likes - 1 : prev.likes + 1 } : null);
    }
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: currentUser,
      text: commentText,
      timestamp: 'Just now'
    };
    const updatedPosts = posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    setPosts(updatedPosts);
    if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
    }
  };
  
  const handleCreatePost = (newPostData: Omit<PostType, 'id' | 'likes' | 'likedByUser' | 'comments' | 'timestamp'>) => {
    const newPost: PostType = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 0,
      likedByUser: false,
      comments: [],
      timestamp: 'JUST NOW'
    };
    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
  };

  const handleStoryScroll = (direction: 'prev' | 'next') => {
    if (storiesContainerRef.current) {
        const scrollAmount = storiesContainerRef.current.clientWidth * 0.8;
        storiesContainerRef.current.scrollBy({
            left: direction === 'prev' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    }
  };
  
  const handleViewStory = (story: Story) => {
    setViewingStory(story);
    setStories(currentStories => currentStories.map(s => s.id === story.id ? { ...s, viewed: true } : s));
  };

  const checkStoryScrollButtons = useCallback(() => {
    if (storiesContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = storiesContainerRef.current;
        setShowPrevStoryButton(scrollLeft > 1);
        setShowNextStoryButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);
  
  const handleSendMessage = (conversationId: string, content: string, type: MessageType, replyTo?: Message) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      type,
      timestamp: 'Just now',
      replyTo
    };
    setConversations(convos => convos.map(c => 
      c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c
    ));
  };

  const handleDeleteMessage = (conversationId: string, messageId: string) => {
    setConversations(convos => convos.map(c => 
      c.id === conversationId 
        ? { ...c, messages: c.messages.filter(m => m.id !== messageId) } 
        : c
    ));
  };
  
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setIsAccountSwitcherOpen(false);
  };

  useEffect(() => {
    const container = storiesContainerRef.current;
    if (container) {
        checkStoryScrollButtons();
        container.addEventListener('scroll', checkStoryScrollButtons);
        const resizeObserver = new ResizeObserver(checkStoryScrollButtons);
        resizeObserver.observe(container);
        return () => {
            container.removeEventListener('scroll', checkStoryScrollButtons);
            resizeObserver.unobserve(container);
        };
    }
  }, [stories, checkStoryScrollButtons]);


  return (
    <div className="bg-black min-h-screen text-white">
      <Header onCreatePost={() => setIsCreateModalOpen(true)} />
      
      <div className="hidden lg:block">
        <LeftSidebar 
          onCreatePost={() => setIsCreateModalOpen(true)}
          onOpenMessages={() => setIsMessagesOpen(true)}
          unreadMessagesCount={totalUnreadCount}
        />
      </div>
      
      <div className="lg:pl-60 xl:pr-80">
        <main className="max-w-[630px] mx-auto pt-16">
          <section className="my-6">
            <div className="relative">
                <div className="border border-gray-800 rounded-lg p-4">
                    <div ref={storiesContainerRef} className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                        {stories.map(story => <StoryBubble key={story.id} story={story} onView={handleViewStory} />)}
                    </div>
                </div>
                {showPrevStoryButton && (
                    <button 
                        onClick={() => handleStoryScroll('prev')}
                        className="absolute top-1/2 left-2 -translate-y-[calc(50%-0.25rem)] transform bg-gray-800 bg-opacity-70 hover:bg-opacity-100 rounded-full p-1.5 z-10 transition-opacity"
                        aria-label="Previous stories"
                    >
                        <Icon className="w-5 h-5 text-white"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.34 12l6.94 6.94a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" /></Icon>
                    </button>
                )}
                {showNextStoryButton && (
                    <button 
                        onClick={() => handleStoryScroll('next')}
                        className="absolute top-1/2 right-2 -translate-y-[calc(50%-0.25rem)] transform bg-gray-800 bg-opacity-70 hover:bg-opacity-100 rounded-full p-1.5 z-10 transition-opacity"
                        aria-label="Next stories"
                    >
                        <Icon className="w-5 h-5 text-white"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.66 12 7.72 5.06a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" /></Icon>
                    </button>
                )}
            </div>
          </section>

          <div className="max-w-md mx-auto lg:max-w-none">
            {posts.map(post => (
                <Post 
                key={post.id} 
                post={post} 
                onLike={handleLikePost} 
                onComment={handleAddComment}
                onViewPost={setSelectedPost} 
                />
            ))}
          </div>
        </main>
      </div>

      <div className="hidden xl:block">
          <Sidebar currentUser={currentUser} onSwitchAccount={() => setIsAccountSwitcherOpen(true)} />
      </div>

      {isMessagesOpen && (
        <MessagesView 
          conversations={conversations}
          currentUser={currentUser}
          onClose={() => setIsMessagesOpen(false)}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      )}
      
      {isAccountSwitcherOpen && (
        <AccountSwitcherModal 
          users={ALL_USERS}
          currentUser={currentUser}
          onClose={() => setIsAccountSwitcherOpen(false)}
          onSwitchUser={handleSwitchUser}
        />
      )}

      {viewingStory && (
        <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />
      )}

      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onLike={handleLikePost}
          onComment={handleAddComment}
        />
      )}

      {isCreateModalOpen && (
        <CreatePostModal 
          currentUser={currentUser}
          onClose={() => setIsCreateModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
      )}
    </div>
  );
};

export default App;