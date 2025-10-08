import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface ResetPasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  token: string; // The token from the URL
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onClose, onSubmit, token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    try {
        await onSubmit(newPassword);
        setIsSuccess(true);
    } catch(err: any) {
        setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <h2 className="text-lg font-semibold text-gray-800">Reset Password</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        {isSuccess ? (
             <div className="p-8 text-center text-gray-700">
                <Icon className="w-16 h-16 text-green-500 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
                <p className="font-semibold">Your password has been successfully reset.</p>
                <button onClick={onClose} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">Log In</button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={isLoading}
                />
            </div>
            <div className="pt-2">
                <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:opacity-70 flex items-center justify-center"
                disabled={!newPassword || newPassword !== confirmPassword || isLoading}
                >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
