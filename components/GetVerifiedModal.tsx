import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface GetVerifiedModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const GetVerifiedModal: React.FC<GetVerifiedModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [documentType, setDocumentType] = useState('');

  const handleNext = () => {
    if (step === 2 && category) setStep(3);
    if (step === 1) setStep(2);
  };
  
  const handleSubmit = () => {
      onSubmit({ category, documentType });
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Apply for Verification</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        
        <div className="p-6">
          {step === 1 && (
            <div>
              <h3 className="font-bold text-center text-lg mb-2">Step 1: Confirm Authenticity</h3>
              <p className="text-sm text-gray-400 mb-4">A verified badge means your account represents a real, notable public figure, celebrity, or brand.</p>
              <button onClick={handleNext} className="w-full bg-red-600 text-white font-semibold py-2 rounded-md">Next</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="font-bold text-center text-lg mb-2">Step 2: Confirm Notability</h3>
              <p className="text-sm text-gray-400 mb-4">Show that your account represents a well-known person or brand. We review accounts that are featured in multiple news sources.</p>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded p-2 mb-4">
                  <option value="">Select a Category</option>
                  <option>News / Media</option>
                  <option>Sports</option>
                  <option>Government / Politics</option>
                  <option>Music</option>
                  <option>Fashion</option>
                  <option>Entertainment</option>
                  <option>Digital Creator / Influencer</option>
                  <option>Brand / Business</option>
              </select>
              <button onClick={handleNext} disabled={!category} className="w-full bg-red-600 text-white font-semibold py-2 rounded-md disabled:bg-gray-600">Next</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="font-bold text-center text-lg mb-2">Step 3: Add Documentation</h3>
              <p className="text-sm text-gray-400 mb-4">Attach a photo of an official government-issued ID.</p>
              <input type="file" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500/20 file:text-red-300 hover:file:bg-red-500/30" />
              <button onClick={handleSubmit} className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-md">Submit Application</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetVerifiedModal;
