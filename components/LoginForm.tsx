import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface LoginFormProps {
  onLoginSuccess: (data: { user: User }) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const lastUser = localStorage.getItem('lastLoggedInUser');
    if (lastUser) {
      setIdentifier(lastUser);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.login(identifier, password);
      localStorage.setItem('lastLoggedInUser', identifier);
      onLoginSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
      
      <div>
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={isLoading}
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:scale-105"
          required
        />
      </div>
      
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:scale-105"
          required
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
        >
          <Icon className="w-5 h-5">
            {showPassword ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </>
            )}
          </Icon>
        </button>
      </div>

      <button type="button" onClick={onForgotPassword} className="text-xs text-red-400 hover:underline text-right block -mt-2">Forgot Password?</button>

      <button
        type="submit"
        disabled={isLoading || !identifier.trim() || !password.trim()}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-300 transform hover:scale-105 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
