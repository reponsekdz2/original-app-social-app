

import React from 'react';
// Fix: Add .ts extension to types import
import type { SupportTicket } from './types.ts';
import Icon from './components/Icon.tsx';

interface SupportInboxViewProps {
  tickets: SupportTicket[];
  onBack: () => void;
  onNewRequest: () => void;
}

const SupportInboxView: React.FC<SupportInboxViewProps> = ({ tickets, onBack, onNewRequest }) => {
  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-500';
      case 'Resolved': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-8">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
            </button>
            <h1 className="text-2xl font-bold">Support Inbox</h1>
        </div>
        <button onClick={onNewRequest} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center gap-2">
            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
            <span>New Request</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-gray-800/50 hover:bg-gray-800 p-4 rounded-lg cursor-pointer transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-gray-400 mt-1">Last updated: {ticket.updated_at}</p>
                </div>
                <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-full text-white ${getStatusColor(ticket.status)}`}>
                  <div className={`w-2 h-2 rounded-full bg-white`} />
                  {ticket.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Icon className="w-16 h-16 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></Icon>
            <p className="font-semibold">No support requests yet.</p>
            <p className="text-sm">Click "New Request" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportInboxView;