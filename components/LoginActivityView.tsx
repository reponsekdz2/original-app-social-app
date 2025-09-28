import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface LoginActivity {
    id: number;
    ip_address: string;
    user_agent: string;
    login_time: string;
}

interface LoginActivityViewProps {
    onBack: () => void;
}

const LoginActivityView: React.FC<LoginActivityViewProps> = ({ onBack }) => {
    const [activity, setActivity] = useState<LoginActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            setIsLoading(true);
            try {
                const data = await api.getLoginActivity();
                setActivity(data);
            } catch (error) {
                console.error("Failed to fetch login activity", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, []);

    return (
         <div className="p-4 md:p-8 max-w-4xl mx-auto">
             <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                </button>
                <h1 className="text-2xl font-bold">Login Activity</h1>
            </div>

            <p className="text-sm text-gray-400 mb-6">This is a list of devices that have logged into your account. Revoke any sessions you do not recognize.</p>
            
             {isLoading ? (
                <p>Loading activity...</p>
            ) : activity.length > 0 ? (
                <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
                    {activity.map(item => (
                        <div key={item.id} className="p-4">
                            <p className="font-semibold">{item.ip_address} (Approx. Location)</p>
                            <p className="text-sm text-gray-400">{item.user_agent}</p>
                             <p className="text-xs text-gray-500 mt-1">{new Date(item.login_time).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 py-16">No recent login activity found.</p>
            )}
        </div>
    );
};

export default LoginActivityView;
