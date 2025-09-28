import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { SupportTicket, AdminReply } from '../../types.ts';
import Icon from '../Icon.tsx';

const TicketDetailModal: React.FC<{ ticket: SupportTicket, onClose: () => void, onReply: (ticketId: number, message: string) => Promise<void> }> = ({ ticket, onClose, onReply }) => {
    const [replies, setReplies] = useState<AdminReply[]>([]);
    const [newReply, setNewReply] = useState('');

    useEffect(() => {
        const fetchReplies = async () => {
            const data = await api.getTicketReplies(ticket.id);
            setReplies(data);
        };
        fetchReplies();
    }, [ticket.id]);

    const handleReply = async () => {
        if (!newReply.trim()) return;
        await onReply(ticket.id, newReply);
        // Optimistically add reply to UI
        setReplies(prev => [...prev, { id: Date.now(), ticket_id: ticket.id, admin_user_id: 'current_admin', message: newReply, created_at: new Date().toISOString() }]);
        setNewReply('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h3 className="p-4 font-bold border-b border-gray-700">Ticket #{ticket.id} - {ticket.subject}</h3>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                     <p className="bg-gray-900 p-3 rounded-lg"><span className="font-bold">{ticket.user_username}:</span> {ticket.description}</p>
                     {replies.map(reply => (
                         <p key={reply.id} className="bg-red-500/10 p-3 rounded-lg"><span className="font-bold">Admin:</span> {reply.message}</p>
                     ))}
                </div>
                <div className="p-4 border-t border-gray-700 flex gap-2">
                    <input value={newReply} onChange={e => setNewReply(e.target.value)} placeholder="Write a reply..." className="w-full bg-gray-700 p-2 rounded-md" />
                    <button onClick={handleReply} className="bg-red-600 px-4 rounded-md font-semibold">Send</button>
                </div>
            </div>
        </div>
    );
};


const SupportTicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

     useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAdminAllTickets();
                setTickets(data);
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, []);
    
    const handleReply = async (ticketId: number, message: string) => {
        await api.replyToTicket(ticketId, message);
        // Optionally refetch tickets or update state
    };


    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Support Tickets</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Ticket ID</th>
                            <th className="p-3 text-left text-sm font-semibold">User</th>
                            <th className="p-3 text-left text-sm font-semibold">Subject</th>
                            <th className="p-3 text-left text-sm font-semibold">Status</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                         {isLoading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading tickets...</td></tr>
                        ) : tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td className="p-3">#{ticket.id}</td>
                                <td className="p-3">{ticket.user_username}</td>
                                <td className="p-3">{ticket.subject}</td>
                                <td className="p-3">{ticket.status}</td>
                                <td className="p-3">
                                    <button onClick={() => setSelectedTicket(ticket)} className="text-blue-400 hover:underline text-sm">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedTicket && <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onReply={handleReply} />}
        </div>
    );
};

export default SupportTicketManagement;