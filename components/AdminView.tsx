import React, { useState } from 'react';
import Dashboard from './admin/Dashboard.tsx';
import UserManagement from './admin/UserManagement.tsx';
import ContentManagement from './admin/ContentManagement.tsx';
import ReportManagement from './admin/ReportManagement.tsx';
import SupportTicketManagement from './admin/SupportTicketManagement.tsx';
import SponsoredContentManagement from './admin/SponsoredContentManagement.tsx';
import TrendingManagement from './admin/TrendingManagement.tsx';
import AnnouncementsManagement from './admin/AnnouncementsManagement.tsx';
import AppSettings from './admin/AppSettings.tsx';
import Icon from './Icon.tsx';
import CarouselManagement from './admin/CarouselManagement.tsx';

type AdminTab = 'dashboard' | 'users' | 'content' | 'reports' | 'support' | 'ads' | 'trends' | 'announcements' | 'settings' | 'carousel';

const AdminView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <path d="M9 17v-2a3 3 0 013-3h0a3 3 0 013 3v2m-6 0h6M9 7.5a3 3 0 013-3h0a3 3 0 013 3v0a3 3 0 01-3 3h0a3 3 0 01-3-3v0z" /> },
        { id: 'users', label: 'Users', icon: <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.109m-11.964-4.663c0-1.113.285-2.16.786-3.07M3.75 9.128v.003c0 1.113.285-2.16.786-3.07M3.75 9.128v-.109a12.318 12.318 0 018.624-8.043 12.318 12.318 0 018.624 8.043l-.001.109c0 1.113-.285-2.16-.786-3.07m-11.964-4.663l.001-.109a6.375 6.375 0 0111.964 4.663l-.001.109" /> },
        { id: 'content', label: 'Content', icon: <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
        { id: 'reports', label: 'Reports', icon: <path d="M3 3v1.5M3 21v-6m0 0l2.75-.625M3 15l2.75-.625m0 0l3.5 7.5M5.75 14.375l3.5 7.5M8.5 21H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H8.5" /> },
        { id: 'support', label: 'Support', icon: <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /> },
        { id: 'ads', label: 'Sponsored', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 10.5 12 10.5s-1.536.71-2.121 1.359c-1.172.879-1.172 2.303 0 3.182z" /> },
        { id: 'trends', label: 'Trends', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.182-3.182m3.182 3.182v4.995A2.25 2.25 0 0119.5 19.5h-4.995" /> },
        { id: 'announcements', label: 'Announcements', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.33-.423-.586-.908-.753-1.425m.753 1.425c.33.423.586.908.753 1.425m-1.506-2.85a.75.75 0 100-1.5.75.75 0 000 1.5m1.506 2.85a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5m-3.75 0h7.5m-7.5 0c-.33-.423-.586-.908-.753-1.425m.753 1.425c.33.423.586.908.753 1.425" /> },
        { id: 'carousel', label: 'Carousel', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" /> },
        { id: 'settings', label: 'App Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.002 1.11-1.212l1.173-.42c.328-.118.665-.118.993 0l1.173.42c.55.198 1.02.67 1.11 1.212l.245 1.488a8.13 8.13 0 01.702.308l1.357-.549c.42-.17.905-.025 1.15.35l.805 1.393c.246.426-.11 1.004-.265 1.32l-1.095.845a7.51 7.51 0 010 1.344l1.095.845c.375.29.51.865.265 1.32l-.805 1.393c-.245.426-.73.52-1.15.35l-1.357-.549a8.13 8.13 0 01-.702.308l-.245 1.488c-.09.542-.56-1.002-1.11-1.212l-1.173.42c-.328-.118-.665-.118-.993 0l-1.173-.42c-.55-.198-1.02-.67-1.11-1.212l-.245-1.488a8.13 8.13 0 01-.702-.308l-1.357.549c-.42.17-.905-.025-1.15-.35l-.805-1.393c-.246.426-.11-1.004.265-1.32l1.095-.845a7.51 7.51 0 010 1.344l-1.095-.845c-.375-.29-.51-.865-.265-1.32l.805 1.393c.245.426.73.52 1.15.35l1.357.549a8.13 8.13 0 01.702.308l.245-1.488zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'users': return <UserManagement />;
            case 'content': return <ContentManagement />;
            case 'reports': return <ReportManagement />;
            case 'support': return <SupportTicketManagement />;
            case 'announcements': return <AnnouncementsManagement />;
            case 'settings': return <AppSettings />;
            case 'ads': return <SponsoredContentManagement />;
            case 'trends': return <TrendingManagement />;
            case 'carousel': return <CarouselManagement />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full">
            <aside className="w-full md:w-64 bg-gray-900/50 p-4 border-b md:border-b-0 md:border-r border-gray-800 flex-shrink-0">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)}
                            className={`w-full flex items-center gap-3 p-2 rounded-md text-sm ${activeTab === tab.id ? 'bg-red-600 text-white' : 'hover:bg-gray-800'}`}>
                            <Icon className="w-5 h-5">{tab.icon}</Icon>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-4 sm:p-6 bg-black/30">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminView;