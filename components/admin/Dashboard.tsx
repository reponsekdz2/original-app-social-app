
import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { AdminStats, AnalyticsData } from '../../types.ts';
import Icon from '../Icon.tsx';
import BarChart from './BarChart.tsx';

// Fix: Replaced JSX.Element with React.ReactNode to resolve namespace error.
const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500/20 text-red-400 mr-4">
                <Icon className="w-6 h-6">{icon}</Icon>
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [userGrowth, setUserGrowth] = useState<AnalyticsData | null>(null);
    const [contentTrends, setContentTrends] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [statsData, userGrowthData, contentTrendsData] = await Promise.all([
                    api.getAdminStats(),
                    api.getAdminUserGrowthData(),
                    api.getAdminContentTrendsData(),
                ]);
                setStats(statsData);
                setUserGrowth(userGrowthData);
                setContentTrends(contentTrendsData);
            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div>
            </div>
        )
    }

    if (!stats) {
        return <div className="text-center p-8 text-red-500">Failed to load dashboard data.</div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.109m-11.964-4.663c0-1.113.285-2.16.786-3.07M3.75 9.128v.003c0 1.113.285-2.16.786-3.07M3.75 9.128v-.109a12.318 12.318 0 018.624-8.043 12.318 12.318 0 018.624 8.043l-.001.109c0 1.113-.285-2.16-.786-3.07m-11.964-4.663l.001-.109a6.375 6.375 0 0111.964 4.663l-.001.109" />} />
                <StatCard title="New Users Today" value={stats.newUsersToday} icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />} />
                <StatCard title="Total Posts" value={stats.totalPosts} icon={<path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />} />
                <StatCard title="Total Reels" value={stats.totalReels} icon={<path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />} />
                <StatCard title="Pending Reports" value={stats.pendingReports} icon={<path d="M3 3v1.5M3 21v-6m0 0l2.75-.625M3 15l2.75-.625m0 0l3.5 7.5M5.75 14.375l3.5 7.5M8.5 21H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H8.5" />} />
                <StatCard title="Live Streams" value={stats.liveStreams} icon={<path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                    <h3 className="font-bold mb-4">User Growth (Last 30 Days)</h3>
                    {userGrowth && <BarChart data={userGrowth} />}
                </div>
                 <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                    <h3 className="font-bold mb-4">Content Trends (Last 30 Days)</h3>
                    {contentTrends && <BarChart data={{ labels: contentTrends.labels, values: contentTrends.postValues }} data2={{ labels: contentTrends.labels, values: contentTrends.reelValues }} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
