
import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { SupportTicket, AdminReply } from '../../types.ts';
import Icon from '../Icon.tsx';

interface TicketDetailsModalProps {
    ticket: SupportTicket;
    onClose: () => void;
    onReply: (ticketId: number, message: string) => Promise<void>;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, onClose, onReply }) => {
    const [reply, setReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const handleReply = async () => {
        if (!reply.trim() || isReplying) return;
        setIsReplying(true);
        await onReply(ticket.id, reply);
        setIsReplying(false);
        setReply('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 w-full max-w-2xl rounded-lg h-[80vh] flex flex-col border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-3 border-b border-gray-700 text-center relative">
                    <h2 className="text-lg font-semibold">Ticket Details</h2>
                    <button className="absolute top-2 right-3" onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
                </div>
                <div className="p-4">
                    <h3 className="font-bold">{ticket.subject}</h3>
                    <p className="text-sm text-gray-400">From: {ticket.user_username} | Status: {ticket.status}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                        <p className="font-semibold text-sm">{ticket.user_username} said:</p>
                        <p className="text-sm mt-1">{ticket.description}</p>
                    </div>
                     {ticket.replies.map(r => (
                        <div key={r.id} className="p-3 bg-red-500/10 rounded-lg text-right">
                            <p className="font-semibold text-sm">You replied:</p>
                            <p className="text-sm mt-1">{r.message}</p>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                    <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Write your reply..." rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm resize-none"></textarea>
                    <button onClick={handleReply} disabled={isReplying || !reply.trim()} className="w-full bg-red-600 text-white font-semibold py-2 rounded-md mt-2 disabled:bg-gray-600">
                        {isReplying ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const SupportTicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminSupportTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch support tickets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleViewTicket = async (ticket: SupportTicket) => {
        const fullTicket = await api.getAdminSupportTicketDetails(ticket.id);
        setSelectedTicket(fullTicket);
    };

    const handleReply = async (ticketId: number, message: string) => {
        await api.replyToSupportTicket(ticketId, message);
        await fetchTickets(); // Refresh all tickets
        const updatedTicket = await api.getAdminSupportTicketDetails(ticketId); // Get fresh data for modal
        setSelectedTicket(updatedTicket);
    };

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="font-bold mb-4 text-lg">Support Inbox</h3>
            <div className="space-y-3">
                {tickets.map(ticket => (
                    <div key={ticket.id} onClick={() => handleViewTicket(ticket)} className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-semibold">{ticket.subject}</p>
                                <p className="text-xs text-gray-400">From: {ticket.user_username}</p>
                            </div>
                            <span className="text-xs font-bold">{ticket.status}</span>
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && <p className="text-center py-4">Loading tickets...</p>}
            {!isLoading && tickets.length === 0 && <p className="text-center py-4">No support tickets found.</p>}
            
            {selectedTicket && <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onReply={handleReply}/>}
        </div>
    );
};

export default SupportTicketManagement;
