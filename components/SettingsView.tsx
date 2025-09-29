import React from 'react';
import Icon from './Icon.tsx';

interface SettingsViewProps {
    onLogout: () => void;
    onNavigate: (view: 'changePassword' | 'blockedUsers' | 'loginActivity' | 'accountStatus' | 'help' | 'privacy') => void;
}

const SettingsLink: React.FC<{ label: string, description: string, onClick: () => void }> = ({ label, description, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-4 hover:bg-gray-800/50 rounded-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
    </button>
);

const SettingsView: React.FC<SettingsViewProps> = ({ onLogout, onNavigate }) => {
    
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</h2>
                    <div className="bg-gray-800 rounded-lg">
                        <SettingsLink label="Change Password" description="Update your password for better security." onClick={() => onNavigate('changePassword')} />
                        <SettingsLink label="Blocked Accounts" description="Manage the accounts you have blocked." onClick={() => onNavigate('blockedUsers')} />
                        <SettingsLink label="Login Activity" description="See where you're logged in." onClick={() => onNavigate('loginActivity')} />
                    </div>
                </div>

                <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Support & About</h2>
                     <div className="bg-gray-800 rounded-lg">
                        <SettingsLink label="Account Status" description="View any warnings or violations." onClick={() => onNavigate('accountStatus')} />
                        <SettingsLink label="Help Center" description="Get help with your account." onClick={() => onNavigate('help')} />
                        <SettingsLink label="Privacy Policy" description="Read our privacy guidelines." onClick={() => {}} />
                    </div>
                </div>
                 <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Logins</h2>
                     <div className="bg-gray-800 rounded-lg">
                        <button onClick={onLogout} className="w-full text-left p-4 text-red-500 hover:bg-gray-800/50 rounded-lg">
                           Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
