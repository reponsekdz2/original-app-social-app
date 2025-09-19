import React, { useState } from 'react';
import type { Post, User } from '../types.ts';
import Icon from './Icon.tsx';

interface ReportModalProps {
  content: Post | User;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  "It's spam",
  "Nudity or sexual activity",
  "Hate speech or symbols",
  "False information",
  "Bullying or harassment",
  "Scam or fraud",
  "Violence or dangerous organizations",
  "I just don't like it",
  "Other",
];

const ReportModal: React.FC<ReportModalProps> = ({ content, onClose, onSubmitReport }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmitReport(selectedReason, details);
  };
  
  const contentType = 'username' in content ? 'user' : 'post';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">{step === 1 ? 'Report' : `Why are you reporting?`}</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        
        {step === 1 ? (
            <div className="p-6">
                <h3 className="font-semibold mb-2">Why are you reporting this {contentType}?</h3>
                <p className="text-sm text-gray-400 mb-4">Your report is anonymous, except if you're reporting an intellectual property infringement. If someone is in immediate danger, call local emergency services - don't wait.</p>
                <div className="flex flex-col">
                    {REPORT_REASONS.map(reason => (
                        <button key={reason} onClick={() => { setSelectedReason(reason); setStep(2); }} className="w-full text-left p-3 hover:bg-gray-700/50 rounded-md border-b border-gray-700 last:border-b-0">
                            {reason}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="p-6 text-center">
                <Icon className="w-16 h-16 text-green-500 mx-auto mb-4"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
                <h3 className="text-xl font-bold">Thanks for reporting</h3>
                <p className="text-gray-300 mt-2">We've received your report for "{selectedReason}". If we find this content violates our policies, we will remove it.</p>
                <button onClick={onClose} className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-md">
                    Done
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
