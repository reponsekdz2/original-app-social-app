import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import ToggleSwitch from '../ToggleSwitch.tsx';

const AppSettings: React.FC = () => {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        setIsLoading(true);
        const data = await api.getAppSettings();
        setSettings(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleToggleChange = (key: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value ? 'true' : 'false' }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await api.updateAppSettings(settings);
        setIsSaving(false);
        // Maybe show a success toast
    };

    const settingDefinitions = [
        { key: 'maintenance_mode', label: 'Maintenance Mode', description: 'Temporarily disable access to the app for non-admin users.', type: 'toggle' },
        { key: 'disable_new_registrations', label: 'Disable New Registrations', description: 'Prevent new users from signing up.', type: 'toggle' },
        { key: 'reels_enabled', label: 'Enable Reels', description: 'Enable or disable the Reels feature globally.', type: 'toggle' },
    ];
    
    if (isLoading) return <p>Loading settings...</p>;

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="font-bold text-lg mb-4">Application Settings</h3>
            <div className="space-y-4">
                {settingDefinitions.map(def => (
                    <div key={def.key} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                        <div>
                            <p className="font-semibold">{def.label}</p>
                            <p className="text-xs text-gray-400">{def.description}</p>
                        </div>
                        {def.type === 'toggle' && (
                            <ToggleSwitch
                                enabled={settings[def.key] === 'true'}
                                setEnabled={(val) => handleToggleChange(def.key, val)}
                            />
                        )}
                    </div>
                ))}
            </div>
             <div className="mt-6 text-right">
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 text-sm bg-red-600 rounded-md disabled:bg-gray-600">
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default AppSettings;