import React from 'react';
import Icon from './Icon.tsx';

interface HelpCenterViewProps {
    onBack: () => void;
    onNavigate: (view: 'support_inbox' | 'faq') => void;
}

const HelpCenterView: React.FC<HelpCenterViewProps> = ({ onBack, onNavigate }) => {
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto text-gray-800">
             <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                </button>
                <h1 className="text-2xl font-bold">Help Center</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                 <button onClick={() => onNavigate('support_inbox')} className="p-6 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-left">
                    <h3 className="font-bold">Support Inbox</h3>
                    <p className="text-sm text-gray-500">View your past and current support requests.</p>
                </button>
                <button onClick={() => onNavigate('faq')} className="p-6 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-left">
                    <h3 className="font-bold">FAQs</h3>
                    <p className="text-sm text-gray-500">Find answers to frequently asked questions.</p>
                </button>
            </div>
        </div>
    );
};

export default HelpCenterView;
