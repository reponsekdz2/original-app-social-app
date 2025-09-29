import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { SponsoredContent } from '../../types.ts';

const SponsoredContentManagement: React.FC = () => {
    const [ads, setAds] = useState<SponsoredContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAdminAllSponsoredContent();
                setAds(data);
            } catch (error) {
                console.error("Failed to fetch ads", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAds();
    }, []);

    const handleDelete = async (id: number) => {
        if(window.confirm("Delete this ad?")) {
            await api.deleteSponsoredContent(id);
            setAds(prev => prev.filter(ad => ad.id !== id));
        }
    };
    
    // In a real app, you'd have a form modal to add/edit
    const handleAdd = async () => {
        const company = prompt("Company Name:");
        if (company) {
            const newAdData = { company, logo_url: '/uploads/default_avatar.png', media_url: '/uploads/default_avatar.png', tagline: 'A great product', call_to_action: 'Learn More', link: '#' };
            const newAd = await api.addSponsoredContent(newAdData);
            setAds(prev => [...prev, newAd]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sponsored Content</h2>
                <button onClick={handleAdd} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm">Add Ad</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Company</th>
                            <th className="p-3 text-left text-sm font-semibold">Tagline</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>
                        ) : ads.map(ad => (
                            <tr key={ad.id}>
                                <td className="p-3">{ad.company}</td>
                                <td className="p-3">{ad.tagline}</td>
                                <td className="p-3">
                                    <button onClick={() => handleDelete(ad.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SponsoredContentManagement;
