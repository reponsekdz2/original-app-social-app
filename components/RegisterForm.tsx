import React, { useState } from 'react';
import type { User } from '../types';
import * as api from '../services/apiService';
import Icon from './Icon';

interface RegisterFormProps {
  onRegisterSuccess: (user: User) => void;
}

const PasswordStrengthIndicator: React.FC<{ password?: string }> = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = [
    '',
    'w-1/4 bg-red-600',
    'w-1/2 bg-yellow-500',
    'w-3/4 bg-sky-500',
    'w-full bg-green-500',
  ][strength];

  if (!password) return null;

  return (
    <div className="mt-1">
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div className={`h-1 rounded-full transition-all duration-300 ${strengthColor}`}></div>
      </div>
      <p className="text-xs text-right text-gray-400 mt-1">{strengthLabel}</p>
    </div>
  );
};


const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    
    setIsLoading(true);

    try {
      const user = await api.register({ email, name, username, password, phone, dob });
      onRegisterSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
      
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      <input type="tel" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      
      <div>
        <label htmlFor="dob" className="text-xs text-gray-400 px-1">Date of Birth</label>
        <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      </div>

      <div className="relative">
        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
          <Icon className="w-5 h-5">{showPassword ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}</Icon>
        </button>
      </div>
       <PasswordStrengthIndicator password={password} />

      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />

      <p className="text-xs text-gray-500 text-center pt-2">By signing up, you agree to our <a href="#" className="underline hover:text-gray-300">Terms</a>, <a href="#" className="underline hover:text-gray-300">Privacy Policy</a>, and <a href="#" className="underline hover:text-gray-300">Cookie Use</a>.</p>

      <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-300 transform hover:scale-105 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center">
        {isLoading && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>)}
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default RegisterForm;
