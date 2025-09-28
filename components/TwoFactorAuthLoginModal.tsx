import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface TwoFactorAuthLoginModalProps {
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const TwoFactorAuthLoginModal: React.FC<TwoFactorAuthLoginModalProps> = ({ onClose, onSubmit }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
        setError("Please enter a 6-digit code.");
        return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        // In a real app, you'd verify the code with the backend
        onSubmit(code);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Icon className="w-12 h-12 text-gray-400 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></Icon>
          <p className="text-sm text-gray-400 text-center">Enter the 6-digit code from your authenticator app.</p>
          {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md text-center">{error}</p>}
          <div>
            <label htmlFor="2fa-code" className="sr-only">Verification Code</label>
            <input
              id="2fa-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-red-500"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuthLoginModal;
