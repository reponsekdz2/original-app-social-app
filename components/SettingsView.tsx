// Fix: Create the SettingsView component.
import React from 'react';
import Icon from './Icon.tsx';
import ToggleSwitch from './ToggleSwitch.tsx';
import type { NotificationSettings, View } from '../types.ts';

interface SettingsViewProps {
  onGetVerified: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
  isPrivateAccount: boolean;
  onTogglePrivateAccount: (enabled: boolean) => void;
  isTwoFactorEnabled: boolean;
  onToggleTwoFactor: (enabled: boolean) => void;
  notificationSettings: NotificationSettings;
  onUpdateNotificationSettings: (setting: keyof NotificationSettings, value: boolean) => void;
  onNavigate: (view: View) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  onGetVerified, 
  onEditProfile, 
  onChangePassword,
  isPrivateAccount,
  onTogglePrivateAccount,
  isTwoFactorEnabled,
  onToggleTwoFactor,
  notificationSettings,
  onUpdateNotificationSettings,
  onNavigate,
}) => {
  const accountItems = [
    { label: 'Edit Profile', action: onEditProfile, icon: <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /> },
    { label: 'Get Verified', action: onGetVerified, icon: <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 .377-.042.748-.122 1.112A4.5 4.5 0 0119.5 17.25h-.513c-1.386 0-2.655.57-3.585 1.506a4.5 4.5 0 01-4.793 0 4.5 4.5 0 01-3.586-1.506h-.513a4.5 4.5 0 01-2.25-4.138c-.08-.364-.122-.735-.122-1.112a4.49 4.49 0 011.549-3.397 4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.498-1.307zM11.25 10.5a.75.75 0 00-1.5 0v.001a.75.75 0 001.5 0v-.001zm1.85-1.04a.75.75 0 10-1.2 1.29l-1.01 1.01a.75.75 0 101.06 1.06l1.01-1.01a.75.75 0 10-1.29-1.2l-.22.22a.75.75 0 001.06 1.06l.22-.22a.75.75 0 00-1.06-1.06l-.22.22a.75.75 0 001.06 1.06l1.22-1.22a.75.75 0 00-1.06-1.06l-1.22 1.22a.75.75 0 001.06 1.06l.22-.22z" clipRule="evenodd" /> },
  ];
  
  const securityItems = [
     { label: 'Change Password', action: onChangePassword, icon: <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563.097-1.159.162-1.77.198V17.25a3 3 0 00-3-3H6.75a3 3 0 00-3 3v.75c0 1.657 1.343 3 3 3h4.5a3 3 0 003-3v-2.707a6.015 6.015 0 013.75-5.972z" /> },
  ]

  const helpItems = [
     { label: 'Help Center', action: () => onNavigate('help-center'), icon: <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /> },
     { label: 'Support Inbox', action: () => onNavigate('support-inbox'), icon: <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /> },
  ]

  return (
    <div className="p-2 sm:p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">

        <div>
          <h3 className="text-gray-400 font-semibold mb-2 px-2 text-sm uppercase tracking-wider">Account</h3>
          {accountItems.map(item => (
            <button key={item.label} onClick={item.action} className="w-full text-left p-3 rounded-lg flex items-center gap-4 hover:bg-gray-800 transition-colors">
              <Icon className="w-6 h-6 text-gray-400">{item.icon}</Icon>
              <span>{item.label}</span>
              <Icon className="w-5 h-5 ml-auto text-gray-500"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
            </button>
          ))}
        </div>

        <div>
           <h3 className="text-gray-400 font-semibold mb-2 px-2 text-sm uppercase tracking-wider">Privacy & Security</h3>
            <div className="w-full text-left p-3 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon>
                 <span>Private Account</span>
              </div>
              <ToggleSwitch enabled={isPrivateAccount} setEnabled={onTogglePrivateAccount} />
            </div>
            {securityItems.map(item => (
              <button key={item.label} onClick={item.action} className="w-full text-left p-3 rounded-lg flex items-center gap-4 hover:bg-gray-800 transition-colors">
                <Icon className="w-6 h-6 text-gray-400">{item.icon}</Icon>
                <span>{item.label}</span>
                <Icon className="w-5 h-5 ml-auto text-gray-500"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
              </button>
            ))}
             <div className="w-full text-left p-3 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></Icon>
                 <span>Two-Factor Authentication</span>
              </div>
              <ToggleSwitch enabled={isTwoFactorEnabled} setEnabled={onToggleTwoFactor} />
            </div>
        </div>

        <div>
          <h3 className="text-gray-400 font-semibold mb-2 px-2 text-sm uppercase tracking-wider">Notifications</h3>
          <div className="w-full text-left p-3 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
               <span>Likes</span>
            </div>
            <ToggleSwitch enabled={notificationSettings.likes} setEnabled={(val) => onUpdateNotificationSettings('likes', val)} />
          </div>
           <div className="w-full text-left p-3 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" /></Icon>
               <span>Comments</span>
            </div>
            <ToggleSwitch enabled={notificationSettings.comments} setEnabled={(val) => onUpdateNotificationSettings('comments', val)} />
          </div>
           <div className="w-full text-left p-3 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
               <span>New Followers</span>
            </div>
            <ToggleSwitch enabled={notificationSettings.follows} setEnabled={(val) => onUpdateNotificationSettings('follows', val)} />
          </div>
        </div>

        <div>
           <h3 className="text-gray-400 font-semibold mb-2 px-2 text-sm uppercase tracking-wider">Support</h3>
           {helpItems.map(item => (
              <button key={item.label} onClick={item.action} className="w-full text-left p-3 rounded-lg flex items-center gap-4 hover:bg-gray-800 transition-colors">
                <Icon className="w-6 h-6 text-gray-400">{item.icon}</Icon>
                <span>{item.label}</span>
                <Icon className="w-5 h-5 ml-auto text-gray-500"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
              </button>
           ))}
        </div>
        
        <div className="border-t border-gray-700 my-4 pt-4">
          <button className="w-full text-left p-3 text-red-500 font-semibold flex items-center gap-4 hover:bg-gray-800 rounded-lg transition-colors">
              Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;