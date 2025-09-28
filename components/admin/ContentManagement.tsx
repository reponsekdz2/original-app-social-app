import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { Post, Reel } from '../../types.ts';

const ContentManagement: React.FC = () => {
    const [contentType, setContentType] = useState<'posts' | 'reels'>('posts');
    const [content, setContent] = useState<(Post | Reel)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const data = contentType === 'posts'
                    ? await api.getAdminAllPosts()
                    : await api.getAdminAllReels();
                setContent(data);
            } catch (error) {
                console.error(`Failed to fetch ${contentType}`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [contentType]);
    
    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this content?")) {
            contentType === 'posts' ? await api.adminDeletePost(id) : await api.adminDeleteReel(id);
            setContent(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Content Management</h2>
            <div className="flex gap-2 border-b border-gray-700">
                <button onClick={() => setContentType('posts')} className={`py-2 px-4 ${contentType === 'posts' ? 'border-b-2 border-red-500 font-semibold' : 'text-gray-400'}`}>Posts</button>
                <button onClick={() => setContentType('reels')} className={`py-2 px-4 ${contentType === 'reels' ? 'border-b-2 border-red-500 font-semibold' : 'text-gray-400'}`}>Reels</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Content ID</th>
                            <th className="p-3 text-left text-sm font-semibold">Author</th>
                            <th className="p-3 text-left text-sm font-semibold">Caption</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                     <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading content...</td></tr>
                        ) : content.map(item => (
                            <tr key={item.id}>
                                <td className="p-3 text-xs font-mono">{item.id}</td>
                                <td className="p-3">{(item as any).username || item.user.username}</td>
                                <td className="p-3 max-w-xs truncate">{item.caption}</td>
                                <td className="p-3">
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentManagement;
