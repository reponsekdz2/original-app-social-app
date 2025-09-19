
import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { TrendingTopic } from '../../types.ts';
import Icon from '../Icon.tsx';

const TrendingManagement: React.FC = () => {
    const [topics, setTopics] = useState<TrendingTopic[]>([]);
    const [newTopic, setNewTopic] = useState({ topic: '', post_count: 0 });

    const fetchTopics = async () => {
        const data = await api.getAdminTrendingTopics();
        setTopics(data);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleAdd = async () => {
        if (!newTopic.topic) return;
        await api.createAdminTrendingTopic(newTopic.topic, newTopic.post_count);
        setNewTopic({ topic: '', post_count: 0 });
        await fetchTopics();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure?")) {
            await api.deleteAdminTrendingTopic(id);
            await fetchTopics();
        }
    };
    
    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="font-bold text-lg mb-4">Manage Trending Topics</h3>
            <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Topic" value={newTopic.topic} onChange={e => setNewTopic({...newTopic, topic: e.target.value})} className="flex-1 bg-gray-700 p-2 rounded-md text-sm" />
                <input type="number" placeholder="Post Count" value={newTopic.post_count || ''} onChange={e => setNewTopic({...newTopic, post_count: Number(e.target.value)})} className="w-32 bg-gray-700 p-2 rounded-md text-sm" />
                <button onClick={handleAdd} className="px-4 py-2 text-sm bg-red-600 rounded-md">Add</button>
            </div>
            <div className="space-y-2">
                 {topics.map(topic => (
                    <div key={topic.id} className="p-2 bg-gray-700/50 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{topic.topic}</p>
                            <p className="text-xs text-gray-400">{topic.post_count.toLocaleString()} posts</p>
                        </div>
                        <button onClick={() => handleDelete(topic.id)} className="text-red-500 p-1"><Icon className="w-4 h-4"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingManagement;
