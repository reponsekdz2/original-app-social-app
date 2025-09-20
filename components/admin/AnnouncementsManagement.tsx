import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { Announcement } from '../../types.ts';
import Icon from '../Icon.tsx';

// Form Modal for Create/Edit
const AnnouncementFormModal: React.FC<{ announcement?: Announcement; onClose: () => void; onSave: () => void }> = ({ announcement, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: announcement?.title || '',
        content: announcement?.content || '',
        type: announcement?.type || 'info',
        is_active: announcement ? announcement.is_active : true,
        expires_at: announcement?.expires_at ? announcement.expires_at.split('T')[0] : ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        const payload = { ...formData, expires_at: formData.expires_at || null };
        if (announcement) {
            await api.updateAnnouncement(announcement.id, payload);
        } else {
            await api.createAnnouncement(payload);
        }
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 w-full max-w-lg rounded-lg border border-gray-700" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold p-4 border-b border-gray-700">{announcement ? 'Edit' : 'Create'} Announcement</h3>
                <div className="p-4 space-y-3">
                    <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-sm" />
                    <textarea name="content" placeholder="Content" value={formData.content} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-sm h-24 resize-none" />
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-sm">
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                    </select>
                    <input name="expires_at" type="date" value={formData.expires_at} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-sm" />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} /> Active</label>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-600 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-red-600 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

const AnnouncementsManagement: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | undefined>(undefined);

    const fetchAnnouncements = async () => {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure?")) {
            await api.deleteAnnouncement(id);
            await fetchAnnouncements();
        }
    };

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Manage Announcements</h3>
                <button onClick={() => { setEditingAnnouncement(undefined); setIsModalOpen(true); }} className="px-4 py-2 text-sm bg-red-600 rounded-md flex items-center gap-2">
                    <Icon className="w-4 h-4"><path d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                    New Announcement
                </button>
            </div>
             <div className="space-y-2">
                {announcements.map(ann => (
                    <div key={ann.id} className="p-3 bg-gray-700/50 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{ann.title} <span className={`text-xs p-1 rounded ${ann.is_active ? 'bg-green-500/50' : 'bg-gray-500/50'}`}>{ann.is_active ? 'Active' : 'Inactive'}</span></p>
                            <p className="text-xs text-gray-400">{ann.content}</p>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => { setEditingAnnouncement(ann); setIsModalOpen(true); }} className="text-xs">Edit</button>
                            <button onClick={() => handleDelete(ann.id)} className="text-xs text-red-500">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <AnnouncementFormModal announcement={editingAnnouncement} onClose={() => setIsModalOpen(false)} onSave={fetchAnnouncements} />}
        </div>
    );
};

export default AnnouncementsManagement;
