import React, { useState } from 'react';
import Icon from './Icon.tsx';
import Dashboard from './admin/Dashboard.tsx';
import UserManagement from './admin/UserManagement.tsx';
import ContentManagement from './admin/ContentManagement.tsx';
import ReportManagement from './admin/ReportManagement.tsx';
import SupportTicketManagement from './admin/SupportTicketManagement.tsx';
import SponsoredContentManagement from './admin/SponsoredContentManagement.tsx';
import TrendingManagement from './admin/TrendingManagement.tsx';
import CarouselManagement from './admin/CarouselManagement.tsx';
import AnnouncementsManagement from './admin/AnnouncementsManagement.tsx';
import AppSettings from './admin/AppSettings.tsx';

type AdminViewType = 'dashboard' | 'users' | 'content' | 'reports' | 'support' | 'sponsored' | 'trending' | 'carousel' | 'announcements' | 'settings';

const AdminView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [activeView, setActiveView] = useState<AdminViewType>('dashboard');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /> },
        { id: 'users', label: 'Users', icon: <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.109m-11.964-4.663c0-1.113.285-2.16.786-3.07M3.75 9.128v.003c0 1.113.285-2.16.786-3.07M3.75 9.128v-.109a12.318 12.318 0 018.624-8.043 12.318 12.318 0 018.624 8.043l-.001.109c0 1.113-.285-2.16-.786-3.07m-11.964-4.663l.001-.109a6.375 6.375 0 0111.964 4.663l-.001.109" /> },
        { id: 'content', label: 'Content', icon: <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
        { id: 'reports', label: 'Reports', icon: <path d="M3 3v1.5M3 21v-6m0 0l2.75-.625M3 15l2.75-.625m0 0l3.5 7.5M5.75 14.375l3.5 7.5M8.5 21H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H8.5" /> },
        { id: 'support', label: 'Support', icon: <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /> },
        { id: 'sponsored', label: 'Sponsored', icon: <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.768 0 1.536.219 2.121.659l.879.659m0-2.218a.375.375 0 00.495-.595l-1.328-1.328a.375.375 0 00-.595.495l1.428 1.428z" /> },
        { id: 'trending', label: 'Trending', icon: <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.182-3.182m3.182 3.182v4.995A2.25 2.25 0 0119.5 19.5h-4.995" /> },
        { id: 'carousel', label: 'Auth Carousel', icon: <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /> },
        { id: 'announcements', label: 'Announcements', icon: <path d="M10.34 15.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM10.34 10.34c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM10.34 4.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM14.84 15.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM14.84 10.34c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM14.84 4.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25z" /> },
        { id: 'settings', label: 'Settings', icon: <path d="M9.594 3.94c.09-.542.56-1.002 1.11-1.212l1.173-.42c.328-.118.665-.118.993 0l1.173.42c.55.198 1.02.67 1.11 1.212l.245 1.488a8.13 8.13 0 01.702.308l1.357-.549c.42-.17.905-.025 1.15.35l.805 1.393c.246.426.11 1.004-.265 1.32l-1.095.845a7.51 7.51 0 010 1.344l1.095.845c.375.29.51.865.265 1.32l-.805 1.393c-.245.426-.73.52-1.15.35l-1.357-.549a8.13 8.13 0 01-.702.308l-.245 1.488c-.09.542-.56-1.002-1.11-1.212l-1.173.42c-.328-.118-.665-.118-.993 0l-1.173-.42c-.55-.198-1.02-.67-1.11-1.212l-.245-1.488a8.13 8.13 0 01-.702-.308l-1.357.549c-.42.17-.905-.025-1.15-.35l-.805-1.393c-.246.426-.11-1.004.265-1.32l1.095-.845a7.51 7.51 0 010 1.344l-1.095-.845c-.375-.29-.51-.865-.265-1.32l.805 1.393c.245.426.73.52 1.15.35l1.357.549a8.13 8.13 0 01.702.308l.245-1.488zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /> },
    ];

    const renderContent = () => {
        switch(activeView) {
            case 'dashboard': return <Dashboard />;
            case 'users': return <UserManagement />;
            case 'content': return <ContentManagement />;
            case 'reports': return <ReportManagement />;
            case 'support': return <SupportTicketManagement />;
            case 'sponsored': return <SponsoredContentManagement />;
            case 'trending': return <TrendingManagement />;
            case 'carousel': return <CarouselManagement />;
            case 'announcements': return <AnnouncementsManagement />;
            case 'settings': return <AppSettings />;
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <aside className="w-20 lg:w-64 bg-black/50 border-r border-gray-800 p-3 flex flex-col">
                <div className="text-red-500 mb-8 py-2">
                    <Icon className="w-8 h-8 lg:hidden"><path fill="currentColor" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" /></Icon>
                    <span className="hidden lg:block text-2xl font-bold">Admin Panel</span>
                </div>
                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveView(item.id as AdminViewType)} className={`w-full flex items-center gap-4 p-3 rounded-lg text-left ${activeView === item.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                            <Icon className="w-6 h-6">{item.icon}</Icon>
                            <span className="hidden lg:block">{item.label}</span>
                        </button>
                    ))}
                </nav>
                 <button onClick={onExit} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 mt-auto">
                    <Icon className="w-6 h-6"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></Icon>
                    <span className="hidden lg:block">Exit Admin</span>
                </button>
            </aside>
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminView;