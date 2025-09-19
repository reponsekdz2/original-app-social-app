

import React, { useState } from 'react';
import type { User } from '../types.ts';
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import AuthImageCarousel from './AuthImageCarousel.tsx';
import AuthWelcomeContent from './AuthWelcomeContent.tsx';

interface AuthViewProps {
  onLoginSuccess: (data: { user: User, token: string }) => void;
  onForgotPassword: () => void;
}

const SocialLogins: React.FC = () => (
    <>
        <div className="flex items-center gap-4">
            <hr className="w-full border-gray-700" />
            <span className="text-gray-400 text-xs uppercase font-semibold">Or</span>
            <hr className="w-full border-gray-700" />
        </div>
        <div className="space-y-3">
            {/* Social login buttons */}
        </div>
    </>
);


const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchView = () => {
      setIsSwitching(true);
      setTimeout(() => {
          setIsLoginView(prev => !prev);
          setIsSwitching(false);
      }, 300);
  }

  return (
    <main className="min-h-screen w-full bg-[#111] flex items-center justify-center p-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center max-w-7xl">
        
        <div className="hidden lg:flex justify-center">
            <AuthWelcomeContent />
        </div>

        <div className="hidden md:flex justify-center row-start-1 md:row-start-auto">
             <AuthImageCarousel />
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0 md:col-start-2 lg:col-start-3">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-red-600">talka</h1>
                <p className="text-gray-300 mt-2">
                  {isLoginView ? 'Welcome back! The spotlight awaits.' : 'Join the cast and share your story.'}
                </p>
              </div>
              
              <div className={`transition-opacity duration-300 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}>
                {isLoginView ? (
                  <LoginForm onLoginSuccess={onLoginSuccess} onForgotPassword={onForgotPassword} />
                ) : (
                  <RegisterForm onRegisterSuccess={onLoginSuccess} />
                )}
              </div>
            </div>
            
             <div className="py-6 text-center text-sm bg-black/20 rounded-b-2xl border-t border-white/10">
                <button onClick={handleSwitchView} className="text-gray-400 hover:text-white transition-colors">
                  {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthView;
