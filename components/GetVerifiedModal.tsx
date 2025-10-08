import React from 'react';
import Icon from './Icon.tsx';

interface GetVerifiedModalProps {
    onClose: () => void;
}

const GetVerifiedModal: React.FC<GetVerifiedModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <Icon className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.757 2.847c-.996.598-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </Icon>
                    <h2 className="text-2xl font-bold text-gray-900">Get Verified</h2>
                    <p className="text-gray-500 mt-2">A verified badge means an account is authentic, notable, and active. This feature is coming soon!</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="w-full py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GetVerifiedModal;
