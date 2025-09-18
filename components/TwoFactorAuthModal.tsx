import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface TwoFactorAuthModalProps {
  onClose: () => void;
  onEnable: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ onClose, onEnable }) => {
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <p className="text-gray-400 mb-6">
                            Add an extra layer of security to your account. You'll be asked for a code from an authenticator app when you log in.
                        </p>
                        <div className="flex justify-center my-4 p-4 bg-white rounded-lg">
                            {/* In a real app, this would be a dynamically generated QR code */}
                           <img src="/qr-code-placeholder.svg" alt="QR Code" className="w-40 h-40"/>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Scan this with your authenticator app (like Google Authenticator or Authy) to get started.</p>
                        <button onClick={() => setStep(2)} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md">
                            Next
                        </button>
                    </>
                );
            case 2:
                 return (
                    <>
                        <p className="text-gray-400 mb-6">Enter the 6-digit code from your authenticator app to complete setup.</p>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="_ _ _ _ _ _"
                            maxLength={6}
                            className="w-full text-center text-2xl tracking-[.5em] bg-gray-700 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <button onClick={onEnable} disabled={code.length !== 6} className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md disabled:bg-gray-600">
                            Enable 2FA
                        </button>
                    </>
                 );
        }
    }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon className="w-12 h-12 text-red-500 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Icon>
        <h2 className="text-2xl font-bold mb-3">Two-Factor Authentication</h2>
        {renderStep()}
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
