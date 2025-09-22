
import React from 'react';
import type { View } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface PremiumWelcomeViewProps {
    onNavigate: (view: View) => void;
}

const PremiumWelcomeView: React.FC<PremiumWelcomeViewProps> = ({ onNavigate }) => {
    const features = [
        {
            icon: <VerifiedBadge className="w-8 h-8" />,
            title: 'Your Verified Badge is Active',
            description: 'Your new blue badge is now visible on your profile, posts, and comments. Enjoy the recognition!'
        },
        {
            icon: <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>,
            title: 'Upload in Stunning 4K UHD',
            description: 'When creating a new post or reel, you can now upload your videos in the highest possible quality.'
        },
        {
            icon: <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></Icon>,
            title: 'Enjoy an Ad-Free Experience',
            description: 'Your feed, stories, and reels are now completely free of sponsored content. Focus on what matters.'
        },
    ];

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
             <div className="text-center max-w-3xl mx-auto">
                <Icon className="w-20 h-20 text-red-500 mx-auto mb-4" fill="currentColor">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" />
                </Icon>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif tracking-wide">Welcome to the Club!</h1>
                <p className="text-lg text-gray-300 mb-12">Your Premium subscription is active. Here's a quick look at the powerful new features you've just unlocked.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-12">
                {features.map(feature => (
                    <div key={feature.title} className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex items-start gap-4">
                        <div className="text-red-500 flex-shrink-0 mt-1">
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onNavigate('home')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
            >
                Start Exploring
            </button>
        </div>
    );
};

export default PremiumWelcomeView;