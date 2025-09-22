import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import AuthImageCarousel from './AuthImageCarousel.tsx';
import AuthWelcomeContent from './AuthWelcomeContent.tsx';

interface AuthViewProps {
  onLoginSuccess: (data: { user: User }) => void;
  onForgotPassword: () => void;
}

const welcomeMessages = {
    login: [
        'Welcome back! The spotlight awaits.',
        'Ready for your close-up?',
        'Your audience is waiting.',
        'Let\'s get this show on the road.',
        'Glad to see you again.',
    ],
    register: [
        'Join the cast and share your story.',
        'A new star is born. Welcome!',
        'Create your scene. Start your story.',
        'Your next chapter begins now.',
        'Welcome to the community.',
    ]
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [animation, setAnimation] = useState('');
  const [welcome, setWelcome] = useState('');

  useEffect(() => {
    const messages = view === 'login' ? welcomeMessages.login : welcomeMessages.register;
    setWelcome(messages[Math.floor(Math.random() * messages.length)]);
  }, [view]);

  const handleSwitchView = () => {
      if (view === 'login') {
          setAnimation('slide-out-left');
          setTimeout(() => {
              setView('register');
              setAnimation('slide-in-right');
          }, 300);
      } else {
          setAnimation('slide-out-right');
          setTimeout(() => {
              setView('login');
              setAnimation('slide-in-left');
          }, 300);
      }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center max-w-7xl">
        
        <div className="hidden lg:flex justify-center">
            <AuthWelcomeContent />
        </div>

        <div className="hidden md:flex justify-center row-start-1 md:row-start-auto">
             <AuthImageCarousel />
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0 md:col-start-1 md:col-span-2 lg:col-start-3 lg:col-span-1 animate-auth-card">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
            <div className="p-6 sm:p-8 overflow-hidden">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-red-600">talka</h1>
                <p className="text-gray-300 mt-2 animate-fade-in h-5">
                  {welcome}
                </p>
              </div>
              
              <div className={animation}>
                {view === 'login' ? (
                  <LoginForm onLoginSuccess={onLoginSuccess} onForgotPassword={onForgotPassword} />
                ) : (
                  <RegisterForm onRegisterSuccess={onLoginSuccess} />
                )}
              </div>
            </div>
            
             <div className="py-6 text-center text-sm bg-black/20 rounded-b-2xl border-t border-white/10">
                <button onClick={handleSwitchView} className="text-gray-400 hover:text-white transition-colors">
                  {view === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthView;