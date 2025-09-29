import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { TrendingTopic } from '../../types.ts';

const TrendingManagement: React.FC = () => {
    const [topics, setTopics] = useState<TrendingTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTopic, setNewTopic] = useState('');

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAdminTrendingTopics();
                setTopics(data);
            } catch (error) {
                console.error("Failed to fetch topics", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const handleAddTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopic.trim()) return;
        const addedTopic = await api.addTrendingTopic(newTopic);
        setTopics(prev => [...prev, addedTopic]);
        setNewTopic('');
    };

    const handleDeleteTopic = async (id: number) => {
        await api.deleteTrendingTopic(id);
        setTopics(prev => prev.filter(t => t.id !== id));
    };

    return (
         <div className="space-y-4">
            <h2 className="text-2xl font-bold">Trending Topics</h2>
            <form onSubmit={handleAddTopic} className="flex gap-2">
                <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="New topic..." className="w-full bg-gray-800 p-2 rounded-md" />
                <button type="submit" className="bg-red-600 px-4 rounded-md font-semibold text-sm">Add</button>
            </form>
             <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Topic</th>
                            <th className="p-3 text-left text-sm font-semibold">Post Count</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>
                        ) : topics.map(topic => (
                            <tr key={topic.id}>
                                <td className="p-3">{topic.topic}</td>
                                <td className="p-3">{topic.post_count}</td>
                                <td className="p-3">
                                    <button onClick={() => handleDeleteTopic(topic.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrendingManagement;
