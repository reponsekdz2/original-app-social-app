import React, { useState } from 'react';
import type { User } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface RegisterFormProps {
  onRegisterSuccess: (data: { user: User, token: string }) => void;
}

// Fix: Implement the PasswordStrengthIndicator component to return a ReactNode.
const PasswordStrengthIndicator: React.FC<{ password?: string }> = ({ password }) => {
    const getStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length > 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const strengthText = ['Very Weak', 'Weak', 'Okay', 'Good', 'Strong', 'Very Strong'][strength];
    const color = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'][strength];

    if (!password) return null;

    return (
        <div className="flex items-center gap-2 -mt-2">
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${(strength / 5) * 100}%` }}></div>
            </div>
            <span className="text-xs text-gray-400 w-20 text-right">{strengthText}</span>
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
      const data = await api.register({ email, name, username, password, phone, dob });
      onRegisterSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
      
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:scale-105" required />
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:scale-105" required />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:scale-105" required />
      <input type="tel" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      
      <div>
        <label htmlFor="dob" className="text-xs text-gray-400 px-1">Date of Birth</label>
        <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
      </div>

      <div className="relative">
        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
         {/* ... show/hide password icon */}
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
