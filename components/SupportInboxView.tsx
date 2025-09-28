import React, { useState, useEffect } from 'react';
import type { SupportTicket } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface SupportInboxViewProps {
    onBack: () => void;
    onNewRequest: () => void;
}

const SupportInboxView: React.FC<SupportInboxViewProps> = ({ onBack, onNewRequest }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const data = await api.getSupportTickets();
                setTickets(data);
            } catch (error) {
                console.error("Failed to fetch support tickets", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, []);
    
    const statusStyles = {
        Open: 'bg-blue-500/20 text-blue-400',
        Pending: 'bg-yellow-500/20 text-yellow-400',
        Resolved: 'bg-green-500/20 text-green-400',
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
             <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                    </button>
                    <h1 className="text-2xl font-bold">Support Inbox</h1>
                </div>
                <button onClick={onNewRequest} className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2 px-4 rounded-md">
                    New Request
                </button>
            </div>
            
            {isLoading ? <p>Loading tickets...</p> : tickets.length > 0 ? (
                <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="p-4 hover:bg-gray-700/50 cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500">Ticket #{ticket.id} · Last updated: {new Date(ticket.updated_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[ticket.status]}`}>{ticket.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-center text-gray-400 py-16">You have no support tickets.</p>
            )}
        </div>
    );
};

export default SupportInboxView;
