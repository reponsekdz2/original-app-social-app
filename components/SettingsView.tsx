
import React from 'react';
import Icon from './Icon.tsx';

interface SettingsViewProps {
  onBack: () => void;
  // In a real app, you'd have more specific navigation functions
  // For now, we'll just log the action
  onNavigate: (setting: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onNavigate }) => {
  const settingsItems = [
    { label: 'Edit Profile', icon: <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />, action: 'edit_profile' },
    { label: 'Change Password', icon: <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.967-.562 1.563-.432z" />, action: 'change_password' },
    { label: 'Privacy and Security', icon: <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-.228-3.447A11.96 11.96 0 0012 2.25c-2.636 0-5.053.94-6.976 2.502" />, action: 'privacy' },
    { label: 'Notifications', icon: <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5a3 3 0 11-6 0 3 3 0 016 0z" />, action: 'notifications' },
    { label: 'Account Status', icon: <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />, action: 'account_status' },
    { label: 'Help', icon: <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />, action: 'help' },
    { label: 'Log Out', icon: <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />, action: 'logout' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full md:hidden">
          <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg">
        <ul className="divide-y divide-gray-800">
          {settingsItems.map(item => (
            <li key={item.action}>
              <button
                onClick={() => onNavigate(item.action)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${item.action === 'logout' ? 'text-red-500' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6">{item.icon}</Icon>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <Icon className="w-5 h-5 text-gray-500"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsView;
