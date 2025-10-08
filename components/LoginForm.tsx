import React, { useState } from 'react';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';
import type { User } from '../types.ts';

interface LoginFormProps {
  onLoginSuccess: (data: { user: User }) => void;
  onLoginNeeds2FA: (user: User) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginNeeds2FA, onSwitchToRegister, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Mocking 2FA check for a specific user for demonstration
      if (username === 'johndoe_2fa') {
          // In a real app, the API would tell us this.
          // We simulate getting a user object back first.
          const mockUser: User = { 
              id: '2', username: 'johndoe_2fa', name: 'John Doe', avatar_url: '', 
              isVerified: true, isPremium: false, isPrivate: false, isAdmin: false, 
              status: 'active', created_at: new Date().toISOString() 
          };
          onLoginNeeds2FA(mockUser);
      } else {
        const data = await api.login(username, password);
        onLoginSuccess(data);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
    const SocialButton: React.FC<{ provider: 'Google' | 'Apple', className?: string }> = ({ provider, className }) => (
        <button type="button" className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm border border-gray-300 hover:bg-gray-100 transition-colors ${className}`}>
           {provider}
        </button>
    );

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold text-center mb-2 text-blue-600 animate-slide-fade-in">talka</h2>
      <p className="text-center text-gray-500 mb-6 text-sm animate-slide-fade-in" style={{ animationDelay: '100ms' }}>Sign in to see photos and videos from your friends.</p>
      
      <div className="flex gap-4 mb-4 animate-slide-fade-in" style={{ animationDelay: '200ms' }}>
        <SocialButton provider="Google" className="social-btn-google" />
        <SocialButton provider="Apple" className="social-btn-apple" />
      </div>

      <div className="flex items-center my-2 animate-slide-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md text-center">{error}</p>}
        
        <div className="relative animate-slide-fade-in" style={{ animationDelay: '400ms' }}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></Icon>
            </span>
            <input
                type="text"
                placeholder="Username, email, or phone"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
            />
        </div>

        <div className="relative animate-slide-fade-in" style={{ animationDelay: '500ms' }}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon>
            </span>
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-md pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Icon className="w-5 h-5 text-gray-400">
                    {showPassword 
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.574M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    }
                </Icon>
            </button>
        </div>
        
        <div className="flex items-center justify-between animate-slide-fade-in" style={{ animationDelay: '600ms' }}>
            <label className="flex items-center text-xs text-gray-500">
                <input type="checkbox" className="w-4 h-4 mr-2 bg-gray-200 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                Remember Me
            </label>
            <button onClick={onForgotPassword} type="button" className="text-xs text-gray-500 hover:underline">
              Forgot password?
            </button>
        </div>

        <button
          type="submit"
          className="w-full btn-gradient text-white font-semibold py-2.5 px-4 rounded-md disabled:opacity-70 flex items-center justify-center transition-colors animate-slide-fade-in"
          style={{ animationDelay: '700ms' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;