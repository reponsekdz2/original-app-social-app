import React from 'react';
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
  onToggleTwoFactor: () => void;
  onGetVerified: () => void;
  onUpdateSettings: (settings: Partial<User['notificationSettings'] & { isPrivate: boolean }>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  const { currentUser, onUpdateSettings, onNavigate } = props;

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { label: 'Edit Profile', action: props.onManageAccount, icon: <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
        { label: 'Change Password', action: props.onChangePassword, icon: <path d="M15.75 5.25a3 3 0 013 3m3 0a9 9 0 11-18 0 9 9 0 0118 0zM8.25 9.75A2.25 2.25 0 0110.5 7.5h3a2.25 2.25 0 012.25 2.25v3a2.25 2.25 0 01-2.25-2.25h-3a2.25 2.25 0 01-2.25-2.25v-3z" /> },
        { label: 'Account Status', action: () => onNavigate('account-status'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-.228-4.014A12.022 12.022 0 0012 2.25c-2.705 0-5.231.81-7.243 2.188" /> },
      ]
    },
    {
        title: 'Privacy and Security',
        items: [
            { label: 'Blocked Accounts', action: () => onNavigate('blocked'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> },
            { label: 'Two-Factor Authentication', action: props.onToggleTwoFactor, icon: <path d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {!currentUser.isVerified && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div>
                  <h3 className="font-bold text-blue-300">Get Verified</h3>
                  <p className="text-sm text-blue-400">Get a verified badge and show you're the real deal.</p>
              </div>
              <button onClick={props.onGetVerified} className="bg-blue-500 text-white font-semibold py-1.5 px-4 rounded-md text-sm hover:bg-blue-600 w-full sm:w-auto flex-shrink-0">Apply Now</button>
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
         <h2 className="text-xl font-semibold mb-3 text-gray-300">Privacy</h2>
         <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                    <p>Private Account</p>
                    <p className="text-xs text-gray-400">When your account is private, only people you approve can see your photos and videos.</p>
                </div>
                <ToggleSwitch enabled={currentUser.isPrivate} setEnabled={(val) => onUpdateSettings({ isPrivate: val })} />
            </div>
         </div>
       </div>

       <div className="mb-8">
         <h2 className="text-xl font-semibold mb-3 text-gray-300">Notifications</h2>
         <div className="bg-gray-900 rounded-lg border border-gray-800 divide-y divide-gray-800">
            <div className="flex items-center justify-between p-4">
                <span>Likes</span>
                <ToggleSwitch enabled={currentUser.notificationSettings.likes} setEnabled={(val) => onUpdateSettings({ likes: val })} />
            </div>
             <div className="flex items-center justify-between p-4">
                <span>Comments</span>
                <ToggleSwitch enabled={currentUser.notificationSettings.comments} setEnabled={(val) => onUpdateSettings({ comments: val })} />
            </div>
             <div className="flex items-center justify-between p-4">
                <span>New Followers</span>
                <ToggleSwitch enabled={currentUser.notificationSettings.follows} setEnabled={(val) => onUpdateSettings({ follows: val })} />
            </div>
         </div>
       </div>
    </div>
  );
};

export default SettingsView;