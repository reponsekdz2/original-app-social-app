import React, { useState } from 'react';
import type { Post } from '../types.ts';
import Icon from './Icon.tsx';

interface TipModalProps {
  post: Post;
  onClose: () => void;
  onSendTip: (amount: number) => Promise<void>;
}

const TIP_AMOUNTS = [1, 5, 10, 20];

const TipModal: React.FC<TipModalProps> = ({ post, onClose, onSendTip }) => {
  const [amount, setAmount] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendTip = async () => {
    if (isProcessing || amount <= 0) return;
    setIsProcessing(true);
    try {
        await onSendTip(amount);
        onClose();
    } catch(error) {
        console.error("Failed to send tip", error);
        // You might want to show an error inside the modal
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Send a Tip</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <div className="p-6 text-center">
            <img src={post.user.avatar} alt={post.user.username} className="w-20 h-20 rounded-full mx-auto mb-3" />
            <p>You are tipping <span className="font-bold">{post.user.username}</span></p>
            <p className="text-xs text-gray-400 mb-6">Show your appreciation for their content!</p>

            <div className="flex justify-center gap-2 mb-4">
                {TIP_AMOUNTS.map(tip => (
                    <button key={tip} onClick={() => setAmount(tip)} className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors ${amount === tip ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}>
                        ${tip}
                    </button>
                ))}
            </div>
            <div className="relative mb-6">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                <input 
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 pl-7 text-center font-bold text-lg"
                />
            </div>
            <button onClick={handleSendTip} disabled={isProcessing || amount <= 0} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md disabled:bg-gray-600">
                {isProcessing ? 'Sending...' : `Send Tip of $${amount}`}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TipModal;