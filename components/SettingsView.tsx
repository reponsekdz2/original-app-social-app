
import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { User, View } from '../types.ts';
import Icon from './Icon.tsx';
import ToggleSwitch from './ToggleSwitch.tsx';

interface SettingsViewProps {
  currentUser: User;
  onNavigate: (view: View) => void;
  onShowHelp: () => void;
  onShowSupport: () => void;
  onChangePassword: () => void;
  onManageAccount: () => void;
  onTwoFactorAuth: () => void;
  onGetVerified: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  const [notifications, setNotifications] = useState(props.currentUser.notificationSettings);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { label: 'Edit Profile', action: props.onManageAccount, icon: <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
        { label: 'Change Password', action: props.onChangePassword, icon: <path d="M15.75 5.25a3 3 0 013 3m3 0a9 9 0 11-18 0 9 9 0 0118 0zM8.25 9.75A2.25 2.25 0 0110.5 7.5h3a2.25 2.25 0 012.25 2.25v3a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25v-3z" /> },
        { label: 'Two-Factor Authentication', action: props.onTwoFactorAuth, icon: <path d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
      ]
    },
    {
      title: 'Support & About',
      items: [
        { label: 'Help Center', action: props.onShowHelp, icon: <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /> },
        { label: 'Support Inbox', action: props.onShowSupport, icon: <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /> },
      ]
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {!props.currentUser.isVerified && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between mb-8">
              <div>
                  <h3 className="font-bold text-blue-300">Get Verified</h3>
                  <p className="text-sm text-blue-400">Get a verified badge and show you're the real deal.</p>
              </div>
              <button onClick={props.onGetVerified} className="bg-blue-500 text-white font-semibold py-1.5 px-4 rounded-md text-sm hover:bg-blue-600">Apply Now</button>
          </div>
      )}

      {settingsGroups.map(group => (
        <div key={group.title} className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-300">{group.title}</h2>
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            {group.items.map((item, index) => (
              <button key={item.label} onClick={item.action} className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 ${index < group.items.length -1 ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6 text-gray-400">{item.icon}</Icon>
                  <span>{item.label}</span>
                </div>
                <Icon className="w-5 h-5 text-gray-500"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
              </button>
            ))}
          </div>
        </div>
      ))}
       
       <div className="mb-8">
         <h2 className="text-xl font-semibold mb-3 text-gray-300">Notifications</h2>
         <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <span>Likes</span>
                <ToggleSwitch enabled={notifications.likes} setEnabled={(val) => setNotifications(p => ({...p, likes: val}))} />
            </div>
             <div className="flex items-center justify-between">
                <span>Comments</span>
                <ToggleSwitch enabled={notifications.comments} setEnabled={(val) => setNotifications(p => ({...p, comments: val}))} />
            </div>
             <div className="flex items-center justify-between">
                <span>New Followers</span>
                <ToggleSwitch enabled={notifications.follows} setEnabled={(val) => setNotifications(p => ({...p, follows: val}))} />
            </div>
         </div>
       </div>
    </div>
  );
};

export default SettingsView;
