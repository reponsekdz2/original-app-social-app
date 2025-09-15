import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500); // Show success message for 1.5s before closing
    }, 2000); // Simulate 2s processing time
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <svg className="animate-spin h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold">Processing Payment...</p>
          </div>
        );
      case 'success':
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Icon className="w-20 h-20 text-green-500" fill="currentColor">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 6.22a.75.75 0 00-1.06-1.06L11 11.69 8.78 9.47a.75.75 0 00-1.06 1.06l2.75 2.75a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" />
                </Icon>
                <p className="mt-4 text-xl font-bold">Payment Successful!</p>
                <p className="text-gray-400">Welcome to Premium.</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="card-name" className="block text-sm font-medium text-gray-400 mb-1">Name on Card</label>
              <input id="card-name" type="text" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500" required />
            </div>
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
              <input id="card-number" type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500" required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                <input id="card-expiry" type="text" placeholder="MM / YY" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500" required />
              </div>
              <div className="flex-1">
                <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-400 mb-1">CVC</label>
                <input id="card-cvc" type="text" placeholder="123" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500" required />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors">
                Pay $95.99
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={status === 'idle' ? onClose : undefined}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Complete Purchase</h2>
          {status === 'idle' && (
            <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentModal;