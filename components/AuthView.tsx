import React, { useState } from 'react';
import type { User } from '../types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthImageCarousel from './AuthImageCarousel';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

const SocialLogins: React.FC = () => (
    <>
        <div className="flex items-center gap-4">
            <hr className="w-full border-gray-700" />
            <span className="text-gray-400 text-xs uppercase font-semibold">Or</span>
            <hr className="w-full border-gray-700" />
        </div>
        <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.228 0-9.652-3.488-11.284-8.239l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.447-2.75 4.385-5.303 5.625l6.19 5.238C42.012 35.841 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                Continue with Google
            </button>
             <button className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.01 2.02c-1.23 0-2.18.4-2.9.95-.7.54-1.2 1.3-1.54 2.3-.34 1-.5 2.1-.5 3.32 0 1.21.16 2.27.48 3.19.32.92.8 1.68 1.45 2.28s1.45.9 2.4.9c.43 0 .83-.07 1.2-.21.37-.14.7-.35.98-.61l.01-.01c.29-.27.5-.59.62-.97.12-.38.18-.8.18-1.27h-4.6v-3.34h7.93c.05.3.08.63.08 1v.01c0 1.3-.32 2.45-.96 3.45-.64 1-1.5 1.76-2.63 2.3s-2.4.8-3.82.8c-1.62 0-3.1-.42-4.42-1.26-1.32-.84-2.33-2-3.04-3.48-.7-1.47-1.06-3.1-1.06-4.9 0-1.8.34-3.42 1.03-4.85.69-1.43 1.7-2.58 3.02-3.45 1.32-.87 2.8-1.3 4.43-1.3 1.38 0 2.62.33 3.72.98l-1.56 2.76c-.6-.35-1.28-.53-2.04-.53z"></path></svg>
                Continue with Apple
            </button>
             <button className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors">
                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"></path></svg>
                Continue with Facebook
            </button>
        </div>
    </>
);


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
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-red-600">Netflixgram</h1>
                <p className="text-gray-300 mt-2">
                  {isLoginView ? 'Welcome back! The spotlight awaits.' : 'Join the cast and share your story.'}
                </p>
              </div>
              
              {isLoginView ? (
                <LoginForm onLoginSuccess={onLoginSuccess} />
              ) : (
                <RegisterForm onRegisterSuccess={onLoginSuccess} />
              )}
              
              <SocialLogins />
            </div>
            
             <div className="py-6 text-center text-sm bg-black/20 rounded-b-2xl border-t border-white/10">
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
