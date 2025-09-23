
import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService.ts';
// Fix: Add .ts extension to types import
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
                console.error("Failed to fetch account status:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const getStatusInfo = () => {
        if (!statusInfo) return { color: 'text-gray-400', icon: <path />, message: 'Could not load status.' };
        switch (statusInfo.status) {
            case 'active':
                return {
                    color: 'text-green-400',
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    message: "Your account is in good standing."
                };
            case 'suspended':
                return {
                    color: 'text-yellow-400',
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
                    message: "Your account is temporarily suspended. You may have limited access to features."
                };
            case 'banned':
                return {
                    color: 'text-red-500',
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
                    message: "Your account has been banned due to repeated violations of our community guidelines."
                };
            default:
                return { color: 'text-gray-400', icon: <path />, message: '' };
        }
    };

    const currentStatus = getStatusInfo();

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                </button>
                <h1 className="text-2xl font-bold">Account Status</h1>
            </div>

            {isLoading ? (
                <p>Loading account status...</p>
            ) : statusInfo ? (
                <>
                    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center mb-8 ${currentStatus.color}`}>
                        <Icon className="w-16 h-16">{currentStatus.icon}</Icon>
                        <p className="text-xl font-bold mt-4 uppercase tracking-wider">{statusInfo.status}</p>
                        <p className="mt-2 text-gray-300">{currentStatus.message}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Account Warnings</h2>
                        {statusInfo.warnings.length > 0 ? (
                            <div className="space-y-4">
                                {statusInfo.warnings.map(warning => (
                                    <div key={warning.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                        <p className="font-semibold text-yellow-300">Warning issued on {new Date(warning.created_at).toLocaleDateString()}</p>
                                        <p className="text-sm text-yellow-400 mt-1">Reason: {warning.reason}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">You have no warnings on your account. Keep up the great work!</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Could not load account status information.</p>
            )}
        </div>
    );
};

export default AccountStatusView;