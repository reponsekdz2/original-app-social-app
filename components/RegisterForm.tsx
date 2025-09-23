import React, { useState } from 'react';
import * as api from '../services/apiService.ts';

interface RegisterFormProps {
  onRegisterSuccess: (data: { user: any }) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await api.register({ email, name, username, password });
      onRegisterSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-4">InstaFire</h1>
      <p className="text-center text-gray-400 mb-8">Sign up to see photos and videos from your friends.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
        <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md disabled:bg-red-800">
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div className="text-center text-sm mt-8">
        <p className="text-gray-400">Have an account? <button onClick={onSwitchToLogin} className="font-semibold text-red-500 hover:underline">Log in</button></p>
      </div>
    </div>
  );
};

export default RegisterForm;
