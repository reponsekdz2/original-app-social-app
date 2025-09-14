// Fix: Create the SettingsView component.
import React from 'react';
import Icon from './Icon';

const SettingsView: React.FC = () => {
  const settingsItems = [
    { label: 'Edit Profile', icon: <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /> },
    { label: 'Change Password', icon: <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563.097-1.159.162-1.77.198V17.25a3 3 0 00-3-3H6.75a3 3 0 00-3 3v.75c0 1.657 1.343 3 3 3h4.5a3 3 0 003-3v-2.707a6.015 6.015 0 013.75-5.972z" /> },
    { label: 'Privacy and Security', icon: <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /> },
    { label: 'Notifications', icon: <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632 23.848 23.848 0 005.454 1.31M15 17.5c-.618 1.078-1.76 1.75-3 1.75s-2.382-.672-3-1.75M15 17.5S14.01 19.5 12 19.5s-3-2-3-2" /> },
    { label: 'Help', icon: <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /> },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <div className="space-y-4">
        {settingsItems.map(item => (
          <button key={item.label} className="w-full text-left p-4 bg-gray-900 rounded-lg flex items-center gap-4 hover:bg-gray-800 transition-colors">
            <Icon className="w-6 h-6 text-gray-400">{item.icon}</Icon>
            <span>{item.label}</span>
            <Icon className="w-5 h-5 ml-auto text-gray-500"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
          </button>
        ))}
         <div className="border-t border-gray-700 my-4"></div>
        <button className="w-full text-left p-4 text-red-500 font-semibold flex items-center gap-4 hover:bg-gray-800 rounded-lg transition-colors">
            Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
