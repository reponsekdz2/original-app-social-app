import React, { useState } from 'react';
import type { User } from '../types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
          src="https://videos.pexels.com/video-files/3209828/3209828-hd_1080_1920_30fps.mp4"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white">
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

          <div className="mt-6 text-center text-sm">
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-gray-400 hover:text-white transition-colors">
              {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
