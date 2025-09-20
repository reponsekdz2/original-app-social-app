import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { SponsoredContent } from '../../types.ts';
import Icon from '../Icon.tsx';

// A simple form modal for creating/editing ads
const AdFormModal: React.FC<{ ad?: SponsoredContent; onClose: () => void; onSave: () => void }> = ({ ad, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        company: ad?.company || '',
        logo_url: ad?.logo_url || '',
        media_url: ad?.media_url || '',
        tagline: ad?.tagline || '',
        call_to_action: ad?.call_to_action || '',
        link: ad?.link || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (ad) {
            await api.updateAdminSponsoredContent(ad.id, formData);
        } else {
            await api.createAdminSponsoredContent(formData as any);
        }
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 w-full max-w-lg rounded-lg border border-gray-700" onClick={e => e.stopPropagation()}>
                 <h3 className="text-lg font-bold p-4 border-b border-gray-700">{ad ? 'Edit' : 'Create'} Sponsored Content</h3>
                 <div className="p-4 space-y-3">
                     {Object.keys(formData).map(key => (
                         <input key={key} name={key} placeholder={key.replace(/_/g, ' ')} value={(formData as any)[key]} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md text-sm" />
                     ))}
                 </div>
                 <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
                     <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-600 rounded-md">Cancel</button>
                     <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-red-600 rounded-md">Save</button>
                 </div>
            </div>
        </div>
    );
};

const SponsoredContentManagement: React.FC = () => {
    const [ads, setAds] = useState<SponsoredContent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<SponsoredContent | undefined>(undefined);
    
    const fetchAds = async () => {
        const data = await api.getAdminSponsoredContent();
        setAds(data);
    };

    useEffect(() => {
        fetchAds();
    }, []);
    
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure?")) {
            await api.deleteAdminSponsoredContent(id);
            await fetchAds();
        }
    };
    
    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Manage Sponsored Content</h3>
                <button onClick={() => { setEditingAd(undefined); setIsModalOpen(true); }} className="px-4 py-2 text-sm bg-red-600 rounded-md flex items-center gap-2">
                    <Icon className="w-4 h-4"><path d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                    New Ad
                </button>
            </div>
            <div className="space-y-2">
                {ads.map(ad => (
                    <div key={ad.id} className="p-2 bg-gray-700/50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={ad.logo_url} className="w-10 h-10 rounded-full" alt={ad.company} />
                            <p className="font-semibold">{ad.company}</p>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => { setEditingAd(ad); setIsModalOpen(true); }} className="text-xs">Edit</button>
                            <button onClick={() => handleDelete(ad.id)} className="text-xs text-red-500">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <AdFormModal ad={editingAd} onClose={() => setIsModalOpen(false)} onSave={fetchAds} />}
        </div>
    );
};

export default SponsoredContentManagement;