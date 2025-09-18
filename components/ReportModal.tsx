import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface ReportModalProps {
  onClose: () => void;
  onSubmitReport: (reason: string) => void;
}

const reportReasons = [
  "It's spam",
  "Nudity or sexual activity",
  "Hate speech or symbols",
  "False information",
  "Bullying or harassment",
  "Scam or fraud",
  "Violence or dangerous organizations",
  "Intellectual property violation",
  "Sale of illegal or regulated goods",
  "Suicide or self-injury",
  "I just don't like it",
];

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmitReport }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmitReport(selectedReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Report</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">Why are you reporting this?</h3>
          <p className="text-xs text-gray-400 mb-4">Your report is anonymous, except if you're reporting an intellectual property infringement. If someone is in immediate danger, call the local emergency services - don't wait.</p>
        </div>
        <div className="overflow-y-auto max-h-[50vh]">
          {reportReasons.map(reason => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-left p-3 text-sm flex justify-between items-center hover:bg-gray-700/50 border-t border-gray-700 ${selectedReason === reason ? 'font-bold' : ''}`}
            >
              <span>{reason}</span>
              <div className={`w-5 h-5 rounded-full border-2 ${selectedReason === reason ? 'border-red-500 bg-red-500' : 'border-gray-500'} flex items-center justify-center`}>
                  {selectedReason === reason && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
            <button
                onClick={handleSubmit}
                disabled={!selectedReason}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Submit Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
