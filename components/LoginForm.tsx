import React, { useState } from 'react';
import * as api from '../services/apiService.ts';

interface LoginFormProps {
  onLoginSuccess: (data: { user: any }) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister, onForgotPassword }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await api.login(identifier, password);
      onLoginSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-4">InstaFire</h1>
      <p className="text-center text-gray-400 mb-8">Sign in to see photos and videos from your friends.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">{error}</p>}
        <input
          type="text"
          placeholder="Username or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md disabled:bg-red-800"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div className="text-center my-4">
        <button onClick={onForgotPassword} className="text-xs text-gray-400 hover:underline">Forgot password?</button>
      </div>
      <div className="text-center text-sm">
        <p className="text-gray-400">Don't have an account? <button onClick={onSwitchToRegister} className="font-semibold text-red-500 hover:underline">Sign up</button></p>
      </div>
    </div>
  );
};

export default LoginForm;
