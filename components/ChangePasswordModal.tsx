import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    try {
        await onSubmit(oldPassword, newPassword);
        onClose(); // Close on success
    } catch(err: any) {
        setError(err.message || "Failed to change password.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required disabled={isLoading} />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md" disabled={isLoading}>
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
