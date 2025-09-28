import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { Announcement } from '../../types.ts';

const AnnouncementsManagement: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAdminAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleAdd = async () => {
        const title = prompt("Announcement Title:");
        if (title) {
            const content = prompt("Announcement Content:");
            if (content) {
                const newAnnouncement = await api.addAnnouncement({ title, content, type: 'info', is_active: false });
                setAnnouncements(prev => [...prev, newAnnouncement]);
            }
        }
    };
    
    const handleToggleActive = async (announcement: Announcement) => {
        const updated = { ...announcement, is_active: !announcement.is_active };
        await api.updateAnnouncement(announcement.id, updated);
        setAnnouncements(prev => prev.map(a => a.id === announcement.id ? updated : a));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Delete this announcement?")) {
            await api.deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        }
    };

    return (
         <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Announcements</h2>
                <button onClick={handleAdd} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm">New Announcement</button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Title</th>
                            <th className="p-3 text-left text-sm font-semibold">Content</th>
                            <th className="p-3 text-left text-sm font-semibold">Active</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                        ) : announcements.map(ann => (
                            <tr key={ann.id}>
                                <td className="p-3">{ann.title}</td>
                                <td className="p-3 max-w-sm truncate">{ann.content}</td>
                                <td className="p-3">
                                    <button onClick={() => handleToggleActive(ann)} className={`px-2 py-1 text-xs rounded-full ${ann.is_active ? 'bg-green-500' : 'bg-gray-600'}`}>
                                        {ann.is_active ? 'Yes' : 'No'}
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => handleDelete(ann.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnnouncementsManagement;