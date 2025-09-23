
import React from 'react';
import Icon from './Icon.tsx';

interface LoginActivity {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrent: boolean;
}

interface LoginActivityViewProps {
  activities: LoginActivity[];
  onBack: () => void;
}

const LoginActivityView: React.FC<LoginActivityViewProps> = ({ activities, onBack }) => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
          <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
        </button>
        <h1 className="text-2xl font-bold">Login Activity</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">This is a list of devices that have logged into your account. Revoke any sessions that you don't recognize.</p>

      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <ul className="divide-y divide-gray-800">
          {activities.map(activity => (
            <li key={activity.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon className="w-8 h-8 text-gray-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></Icon>
                <div>
                  <p className="font-semibold">{activity.device} {activity.isCurrent && <span className="text-xs text-green-400">(Current Session)</span>}</p>
                  <p className="text-sm text-gray-400">{activity.location} - IP: {activity.ipAddress}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {!activity.isCurrent && (
                <button className="mt-2 sm:mt-0 text-sm font-semibold text-red-500 hover:underline">Log out</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoginActivityView;
