import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface TwoFactorAuthModalProps {
  onClose: () => void;
  onEnable: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ onClose, onEnable }) => {
    const [code, setCode] = useState('');

    const handleEnable = () => {
        // In a real app, you'd verify the code
        onEnable();
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 flex flex-col text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <h2 className="text-lg font-semibold">Enable Two-Factor Auth</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <div className="p-6 text-center">
            <h3 className="font-semibold text-lg">Scan QR Code</h3>
            <p className="text-sm text-gray-500 mb-4">Scan this QR code with your authenticator app (like Google Authenticator or Authy).</p>
            <div className="bg-white p-4 inline-block rounded-lg border border-gray-200">
                {/* Placeholder for QR Code Image */}
                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-500">QR Code</div>
            </div>
            <div className="mt-4">
                 <label htmlFor="2fa-code" className="block text-sm font-medium text-gray-600 mb-1">Enter Confirmation Code</label>
                 <input id="2fa-code" type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-center tracking-widest" placeholder="123456" />
            </div>
            <button onClick={handleEnable} disabled={code.length !== 6} className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md disabled:bg-gray-400">Enable</button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
