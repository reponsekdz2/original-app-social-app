import React from 'react';
// Fix: Add .tsx extension to Icon import.
import Icon from './Icon.tsx';

interface GetVerifiedModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const GetVerifiedModal: React.FC<GetVerifiedModalProps> = ({ onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 .377-.042.748-.122 1.112A4.5 4.5 0 0119.5 17.25h-.513c-1.386 0-2.655.57-3.585 1.506a4.5 4.5 0 01-4.793 0 4.5 4.5 0 01-3.586-1.506h-.513a4.5 4.5 0 01-2.25-4.138c-.08-.364-.122-.735-.122-1.112a4.49 4.49 0 011.549-3.397 4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.498-1.307zM11.25 10.5a.75.75 0 00-1.5 0v.001a.75.75 0 001.5 0v-.001zm1.85-1.04a.75.75 0 10-1.2 1.29l-1.01 1.01a.75.75 0 101.06 1.06l1.01-1.01a.75.75 0 10-1.29-1.2l-.22.22a.75.75 0 001.06 1.06l.22-.22a.75.75 0 00-1.06-1.06l-.22.22a.75.75 0 001.06 1.06l1.22-1.22a.75.75 0 00-1.06-1.06l-1.22 1.22a.75.75 0 001.06 1.06l.22-.22z" clipRule="evenodd" />
        </Icon>
        <h2 className="text-2xl font-bold mb-3">Get Verified on talka</h2>
        <p className="text-gray-400 mb-6">
          A verified badge lets people know that you're the real deal. Apply now to confirm your authenticity and get a blue checkmark next to your name.
        </p>
        <button 
          onClick={onSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors"
        >
          Start Application
        </button>
         <button 
          onClick={onClose}
          className="mt-2 text-sm text-gray-400 hover:text-white"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default GetVerifiedModal;