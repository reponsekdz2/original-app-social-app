import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService.ts';
import type { AccountStatusInfo } from '../types.ts';
import Icon from './Icon.tsx';

interface AccountStatusViewProps {
    onBack: () => void;
}

const AccountStatusView: React.FC<AccountStatusViewProps> = ({ onBack }) => {
    const [statusInfo, setStatusInfo] = useState<AccountStatusInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAccountStatus();
                setStatusInfo(data);
            } catch (error) {
                console.error("Failed to fetch account status", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const statusStyles = {
        active: { text: 'Active', color: 'text-green-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        suspended: { text: 'Suspended', color: 'text-yellow-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /> },
        banned: { text: 'Banned', color: 'text-red-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> },
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                </button>
                <h1 className="text-2xl font-bold">Account Status</h1>
            </div>
            
            {isLoading ? <p>Loading status...</p> : !statusInfo ? <p>Could not load account status.</p> : (
                <>
                    <div className="bg-gray-800 rounded-lg p-6 mb-6 flex items-center gap-4">
                        <Icon className={`w-10 h-10 ${statusStyles[statusInfo.status].color}`}>{statusStyles[statusInfo.status].icon}</Icon>
                        <div>
                            <p className="text-sm text-gray-400">Current Status</p>
                            <p className={`text-xl font-bold ${statusStyles[statusInfo.status].color}`}>{statusStyles[statusInfo.status].text}</p>
                        </div>
                    </div>
                    
                    <h2 className="text-lg font-bold mb-4">Warnings & Violations</h2>
                    {statusInfo.warnings.length > 0 ? (
                         <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
                            {statusInfo.warnings.map(warning => (
                                <div key={warning.id} className="p-4">
                                    <p className="font-semibold text-red-400">{warning.reason}</p>
                                    <p className="text-xs text-gray-500 mt-1">Issued on: {new Date(warning.created_at).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-16">You have no warnings or violations. Keep up the good work!</p>
                    )}
                </>
            )}
        </div>
    );
};

export default AccountStatusView;