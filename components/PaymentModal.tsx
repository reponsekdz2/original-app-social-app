
import React from 'react';
import Icon from './Icon.tsx';

interface PaymentModalProps {
    onClose: () => void;
    amount: number;
    onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, amount, onPaymentSuccess }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 text-center relative">
                    <h2 className="text-lg font-semibold">Complete Payment</h2>
                     <button className="absolute top-2 right-3" onClick={onClose}>
                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-center">You are about to pay <span className="font-bold text-xl">${amount.toFixed(2)}</span></p>
                    
                    <div>
                        <label className="text-sm text-gray-400">Card Number</label>
                        <input className="w-full bg-gray-700 p-2 rounded-md mt-1" placeholder="**** **** **** ****" />
                    </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Expiry</label>
                            <input className="w-full bg-gray-700 p-2 rounded-md mt-1" placeholder="MM / YY" />
                        </div>
                        <div className="flex-1">
                             <label className="text-sm text-gray-400">CVC</label>
                            <input className="w-full bg-gray-700 p-2 rounded-md mt-1" placeholder="123" />
                        </div>
                    </div>
                     <button onClick={onPaymentSuccess} className="w-full bg-red-600 text-white font-bold py-3 rounded-md mt-4">
                        Pay ${amount.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
