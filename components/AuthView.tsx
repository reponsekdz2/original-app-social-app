import React, { useState } from 'react';
import type { User } from '../types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthImageCarousel from './AuthImageCarousel';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <main className="min-h-screen w-full bg-[#111] flex items-center justify-center p-4">
      <div className="container mx-auto flex items-center justify-center gap-16">
        {/* Image Carousel - Hidden on mobile */}
        <AuthImageCarousel />

        {/* Form Container */}
        <div className="w-full max-w-md flex-shrink-0">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
            <div className="p-8 border-b border-white/10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-red-600">Netflixgram</h1>
                <p className="text-gray-300 mt-2">
                  {isLoginView ? 'Welcome back to the show.' : 'Join the cast.'}
                </p>
              </div>
              
              {isLoginView ? (
                <LoginForm onLoginSuccess={onLoginSuccess} />
              ) : (
                <RegisterForm onRegisterSuccess={onLoginSuccess} />
              )}
            </div>
             <div className="py-6 text-center text-sm">
                <button onClick={() => setIsLoginView(!isLoginView)} className="text-gray-400 hover:text-white transition-colors">
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