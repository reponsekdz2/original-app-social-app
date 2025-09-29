import React, { useState, useMemo } from 'react';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';
import type { User } from '../types.ts';


interface RegisterFormProps {
  onRegisterSuccess: (data: { user: any }) => void;
  onSwitchToLogin: () => void;
}

const PasswordStrengthIndicator: React.FC<{ strength: number }> = ({ strength }) => {
    const strengthLevels = [
        { color: 'bg-gray-600', width: 'w-0' },
        { color: 'bg-red-500', width: 'w-1/5' },
        { color: 'bg-orange-500', width: 'w-2/5' },
        { color: 'bg-yellow-500', width: 'w-3/5' },
        { color: 'bg-lime-500', width: 'w-4/5' },
        { color: 'bg-green-500', width: 'w-full' },
    ];

    return (
        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${strengthLevels[strength].color} ${strengthLevels[strength].width}`}></div>
        </div>
    );
};

const StepIndicator: React.FC<{ step: number, currentStep: number, label: string}> = ({ step, currentStep, label }) => {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;

    return (
        <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted ? 'bg-red-500 text-white' : isActive ? 'bg-red-700 text-white' : 'bg-gray-600 text-gray-300'}`}>
                {isCompleted ? <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></Icon> : step}
            </div>
            <span className={`font-semibold text-xs transition-colors ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<User['gender']>('Prefer not to say');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };
  
  const passwordStrength = useMemo(() => checkPasswordStrength(password), [password]);


  const handleNext = () => {
    setError('');
    if (step === 1) {
        if (!email.includes('@') || !username) {
            setError("Please enter a valid email and username.");
            return;
        }
    }
    if (step === 2) {
        if (passwordStrength < 3) {
             setError("Password is too weak. It should be at least 8 characters and include uppercase, lowercase, numbers, and symbols.");
             return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    }
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
      setError('');
      setStep(prev => prev - 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!dob) {
        setError("Please enter your date of birth.");
        return;
    }
    
    setIsLoading(true);
    try {
      const data = await api.register(username, email, password, name, phone, dob, gender || 'Prefer not to say', country, avatarUrl);
      onRegisterSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      if (err.message.includes('already in use')) {
          setStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
   const SocialButton: React.FC<{ provider: 'Google' | 'Apple' }> = ({ provider }) => (
        <button type="button" className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm border border-gray-700 hover:bg-gray-800 transition-colors`}>
           {provider}
        </button>
    );

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">InstaFire</h2>
      <p className="text-center text-gray-400 mb-4 text-sm">Sign up to see photos and videos from your friends.</p>
      
       <div className="mb-4 px-2">
            <div className="flex items-center">
                <StepIndicator step={1} currentStep={step} label="Account" />
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > 1 ? 'bg-red-500' : 'bg-gray-600'}`} />
                <StepIndicator step={2} currentStep={step} label="Details" />
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > 2 ? 'bg-red-500' : 'bg-gray-600'}`} />
                <StepIndicator step={3} currentStep={step} label="Finish" />
            </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex-grow flex flex-col">
        {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md text-center">{error}</p>}
        
        <div className="flex-grow">
            {step === 1 && (
                <div key="step1" className="space-y-3 animate-slide-fade-in">
                    <h3 className="font-semibold text-center text-lg mt-2">Create your account</h3>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243c0 .384.128.753.36 1.06l.995 1.493a.75.75 0 01-.26 1.06l-1.636 1.09a.75.75 0 00-.26 1.06l.995 1.493c.232.348.359.726.359 1.112v.243m-13.5-9.75h9" /></Icon></span>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" required autoFocus/>
                    </div>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></Icon></span>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" required />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div key="step2" className="space-y-3 animate-slide-fade-in">
                    <h3 className="font-semibold text-center text-lg mt-2">Profile & Security</h3>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm-2.25-6h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-3.75a.75.75 0 01-.75-.75v-3.75a.75.75 0 01.75-.75z" /></Icon></span>
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" required autoFocus/>
                    </div>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></Icon></span>
                        <input type="url" placeholder="Avatar URL (Optional)" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon></span>
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3"><Icon className="w-5 h-5 text-gray-400">{showPassword ? <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.574M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /> : <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />}</Icon></button>
                        <PasswordStrengthIndicator strength={passwordStrength} />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon></span>
                        <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" required />
                         <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3"><Icon className="w-5 h-5 text-gray-400">{showConfirmPassword ? <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.574M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /> : <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />}</Icon></button>
                    </div>
                </div>
            )}
            
            {step === 3 && (
                <div key="step3" className="space-y-3 animate-slide-fade-in">
                    <h3 className="font-semibold text-center text-lg mt-2">Final Details</h3>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon></span>
                        <input type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Icon className="w-5 h-5"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></Icon></span>
                        <input type="text" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" required />
                    </div>
                     <div className="relative">
                        <label className="text-xs text-gray-400 px-1">Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value as User['gender'])} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-3 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
                            <option>Prefer not to say</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m18.132-4.5A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 13.5c-2.998 0-5.74-1.1-7.843-2.918" /></Icon></span>
                        <input type="text" placeholder="Country (Optional)" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                </div>
            )}
        </div>
        
        <div className="mt-auto pt-4 flex gap-4">
             {step > 1 && (
                 <button type="button" onClick={handleBack} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-md">
                    Back
                </button>
             )}
            {step < 3 ? (
                <button type="button" onClick={handleNext} className="w-full btn-gradient text-white font-semibold py-2.5 px-4 rounded-md">
                    Next
                </button>
            ) : (
                <button type="submit" className="w-full btn-gradient text-white font-semibold py-2.5 px-4 rounded-md disabled:bg-gray-700 flex items-center justify-center" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            )}
        </div>

      </form>
    </div>
  );
};

export default RegisterForm;