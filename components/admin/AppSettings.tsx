import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import ToggleSwitch from '../ToggleSwitch.tsx';

const AppSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        maintenance_mode: false,
        new_registrations_enabled: true,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAppSettings();
                setSettings(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSettingChange = async (key: keyof typeof settings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await api.updateAppSettings(newSettings);
    };

    return (
        <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-bold">Application Settings</h2>
            {isLoading ? <p>Loading settings...</p> : (
                <div className="bg-gray-800 rounded-lg p-6 space-y-4 divide-y divide-gray-700">
                    <div className="flex justify-between items-center pt-4 first:pt-0">
                        <div>
                            <p className="font-semibold">Maintenance Mode</p>
                            <p className="text-sm text-gray-400">Puts the site in a read-only mode for all non-admin users.</p>
                        </div>
                        <ToggleSwitch enabled={settings.maintenance_mode} setEnabled={(val) => handleSettingChange('maintenance_mode', val)} />
                    </div>
                     <div className="flex justify-between items-center pt-4 first:pt-0">
                        <div>
                            <p className="font-semibold">Enable New Registrations</p>
                            <p className="text-sm text-gray-400">Allows new users to sign up for an account.</p>
                        </div>
                        <ToggleSwitch enabled={settings.new_registrations_enabled} setEnabled={(val) => handleSettingChange('new_registrations_enabled', val)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppSettings;
