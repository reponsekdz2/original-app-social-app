import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Forgot Password</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        {isSubmitted ? (
            <div className="p-8 text-center">
                <Icon className="w-16 h-16 text-green-500 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243c0 .384.128.753.36 1.06l.995 1.493a.75.75 0 01-.26 1.06l-1.636 1.09a.75.75 0 00-.26 1.06l.995 1.493c.232.348.359.726.359 1.112v.243m-13.5-9.75h9" /></Icon>
                <p>If an account with that email exists, a password reset link has been sent.</p>
                <button onClick={onClose} className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-md">Close</button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-sm text-gray-400">Enter your email and we'll send you a link to get back into your account.</p>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required disabled={isLoading} />
                </div>
                <div className="pt-2">
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
