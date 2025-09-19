import React, { useState } from 'react';
import Dashboard from './admin/Dashboard.tsx';
import UserManagement from './admin/UserManagement.tsx';
import ContentManagement from './admin/ContentManagement.tsx';
import ReportManagement from './admin/ReportManagement.tsx';
import Icon from './Icon.tsx';

type AdminTab = 'dashboard' | 'users' | 'content' | 'reports';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const tabs: { id: AdminTab; label: string; icon: JSX.Element }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <path d="M9 17v-2a3 3 0 00-3-3H4a3 3 0 00-3 3v2h2a1 1 0 011 1v2h1a1 1 0 011-1h2a1 1 0 011 1h1v-2a1 1 0 011-1h2zm-3-8a3 3 0 100-6 3 3 0 000 6zm-5 4a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zm5 0a3 3 0 100-6 3 3 0 000 6z" /> },
    { id: 'users', label: 'Users', icon: <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.109m-11.964-4.663c0-1.113.285-2.16.786-3.07M3.75 9.128v.003c0 1.113.285 2.16.786 3.07M3.75 9.128v-.109a12.318 12.318 0 018.624-8.043 12.318 12.318 0 018.624 8.043l-.001.109c0 1.113-.285 2.16-.786 3.07m-11.964-4.663l.001-.109a6.375 6.375 0 0111.964 4.663l-.001.109" /> },
    { id: 'content', label: 'Content', icon: <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
    { id: 'reports', label: 'Reports', icon: <path d="M3 3v1.5M3 21v-6m0 0l2.75-.625M3 15l2.75-.625m0 0l3.5 7.5M5.75 14.375l3.5 7.5M8.5 21H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H8.5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UserManagement />;
      case 'content': return <ContentManagement />;
      case 'reports': return <ReportManagement />;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Platform management and analytics.</p>
      </header>
      
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <Icon className="w-5 h-5 mr-2">{tab.icon}</Icon>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminView;