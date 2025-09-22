import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface NewSupportRequestModalProps {
  onClose: () => void;
  onSubmit: (subject: string, description: string) => Promise<void>;
}

const NewSupportRequestModal: React.FC<NewSupportRequestModalProps> = ({ onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
        await onSubmit(subject, description);
        onClose();
    } catch (error) {
        console.error("Failed to submit ticket", error);
        // Optionally show an error message to the user
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">New Support Request</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
              placeholder="Please describe your issue in detail..."
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!subject.trim() || !description.trim() || isSubmitting}
            >
              {isSubmitting && (
                  <div className="sk-chase mr-3" style={{ width: '20px', height: '20px' }}>
                      <div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div>
                  </div>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSupportRequestModal;