import React, { useState } from 'react';
import Icon from './Icon.tsx';
import * as api from '../services/apiService.ts';

interface NewSupportRequestModalProps {
  onClose: () => void;
  onSubmit: (ticket: any) => void;
}

const NewSupportRequestModal: React.FC<NewSupportRequestModalProps> = ({ onClose, onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!subject.trim() || !description.trim()) {
            setError("Subject and description are required.");
            return;
        }
        setIsLoading(true);
        try {
            const newTicket = await api.createSupportTicket(subject, description);
            onSubmit(newTicket);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit ticket.');
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">New Support Request</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full bg-gray-700 p-2 rounded-md resize-none" />
            </div>
            <div className="pt-2">
                 <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md disabled:bg-gray-600" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NewSupportRequestModal;