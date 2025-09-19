import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/apiService.ts';
import type { Post, Reel } from '../../types.ts';
import Icon from '../Icon.tsx';

const ContentManagement: React.FC = () => {
    const [contentType, setContentType] = useState<'posts' | 'reels'>('posts');
    const [content, setContent] = useState<(Post & Reel)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminContent(contentType);
            setContent(data);
        } catch (error) {
            console.error(`Failed to fetch ${contentType}:`, error);
        } finally {
            setIsLoading(false);
        }
    }, [contentType]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const handleDelete = async (item: Post | Reel) => {
        const type = 'video' in item ? 'reel' : 'post';
        if (!window.confirm(`Are you sure you want to delete this ${type} by ${item.user.username}?`)) return;
        try {
            await api.deleteAdminContent(type, item.id);
            fetchContent(); // Refresh
        } catch (error) {
            console.error(`Failed to delete ${type}:`, error);
        }
    };

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Content Moderation</h3>
                <div>
                    <button onClick={() => setContentType('posts')} className={`px-3 py-1 text-sm rounded-l-md ${contentType === 'posts' ? 'bg-red-600' : 'bg-gray-700'}`}>Posts</button>
                    <button onClick={() => setContentType('reels')} className={`px-3 py-1 text-sm rounded-r-md ${contentType === 'reels' ? 'bg-red-600' : 'bg-gray-700'}`}>Reels</button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {content.map(item => (
                    <div key={item.id} className="relative aspect-square group bg-black">
                         {contentType === 'posts' ? (
                            <img src={(item as any).media_url} alt="Post" className="w-full h-full object-cover rounded" />
                         ) : (
                            <video src={(item as any).media_url} className="w-full h-full object-cover rounded" />
                         )}
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-xs">
                            <p>by <span className="font-bold">{(item as any).username}</span></p>
                             <button onClick={() => handleDelete(item)} className="self-end p-2 bg-red-600/80 rounded-full">
                                <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon>
                            </button>
                         </div>
                    </div>
                ))}
            </div>
            {isLoading && <p className="text-center py-4">Loading content...</p>}
            {!isLoading && content.length === 0 && <p className="text-center py-4">No {contentType} found.</p>}
        </div>
    );
};

export default ContentManagement;