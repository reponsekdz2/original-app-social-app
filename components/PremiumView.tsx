import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface PremiumViewProps {
    onShowPaymentModal: () => void;
    isCurrentUserPremium: boolean;
}

const PremiumView: React.FC<PremiumViewProps> = ({ onShowPaymentModal, isCurrentUserPremium }) => {
    const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');

    const features = [
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
            title: 'Verified Badge',
            description: 'Stand out from the crowd with an exclusive badge on your profile and posts.'
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
            title: 'Advanced AI Tools',
            description: 'Unlock next-level AI for story generation, captions, and comment moderation.'
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />,
            title: '4K UHD Uploads',
            description: 'Share your reels and videos in the highest quality possible, up to 2160p.'
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
            title: 'Ad-Free Experience',
            description: 'Enjoy Netflixgram completely uninterrupted, with no ads in your feed, stories, or reels.'
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.002 1.11-1.212l1.173-.42c.328-.118.665-.118.993 0l1.173.42c.55.198 1.02.67 1.11 1.212l.245 1.488a8.13 8.13 0 01.702.308l1.357-.549c.42-.17.905-.025 1.15.35l.805 1.393c.246.426.11 1.004-.265 1.32l-1.095.845a7.51 7.51 0 010 1.344l1.095.845c.375.29.51.865.265 1.32l-.805 1.393c-.245.426-.73.52-1.15.35l-1.357-.549a8.13 8.13 0 01-.702.308l-.245 1.488c-.09.542-.56 1.002-1.11 1.212l-1.173-.42c-.328-.118-.665-.118-.993 0l-1.173-.42c-.55-.198-1.02-.67-1.11-1.212l-.245-1.488a8.13 8.13 0 01-.702-.308l-1.357.549c-.42.17-.905-.025-1.15-.35l-.805-1.393c-.246.426-.11-1.004.265-1.32l1.095-.845a7.51 7.51 0 010-1.344l-1.095-.845c-.375-.29-.51-.865-.265-1.32l.805-1.393c.245.426.73.52 1.15.35l1.357.549a8.13 8.13 0 01.702.308l.245-1.488z" />,
            title: 'Profile Customization',
            description: 'Get access to more profile layouts, custom themes, and add a link to your website.'
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
            title: 'Early Access',
            description: 'Be the first to try new features before they are released to everyone else.'
        }
    ];

    if (isCurrentUserPremium) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center h-[calc(100vh-10rem)]">
                <div className="text-center max-w-xl mx-auto bg-gray-900 rounded-lg p-10 border border-gray-800 shadow-2xl">
                    <Icon className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 6.22a.75.75 0 00-1.06-1.06L11 11.69 8.78 9.47a.75.75 0 00-1.06 1.06l2.75 2.75a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" />
                    </Icon>
                    <h1 className="text-4xl font-bold text-white mb-3">Welcome to Premium!</h1>
                    <p className="text-gray-300">Your subscription is active. You can now enjoy all the exclusive features of Netflixgram Premium.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4 font-serif tracking-wide">Unlock Netflixgram Premium</h1>
                <p className="text-lg text-gray-300 mb-12">Supercharge your social experience with exclusive features, advanced AI tools, and more.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                {features.map(feature => (
                    <div key={feature.title} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-red-600 hover:scale-105 transform transition-all duration-300">
                        <div className="text-red-500 mb-4">
                            <Icon className="w-8 h-8">{feature.icon}</Icon>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8 border border-gray-800 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <button onClick={() => setPlan('monthly')} className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${plan === 'monthly' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                        <p className="font-bold text-lg">Monthly</p>
                        <p className="text-2xl font-extrabold">$9.99<span className="text-base font-normal text-gray-400">/month</span></p>
                    </button>
                    <button onClick={() => setPlan('yearly')} className={`relative flex-1 p-4 rounded-lg border-2 text-left transition-colors ${plan === 'yearly' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                        <span className="absolute top-0 right-4 -mt-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">SAVE 20%</span>
                        <p className="font-bold text-lg">Yearly</p>
                        <p className="text-2xl font-extrabold">$95.99<span className="text-base font-normal text-gray-400">/year</span></p>
                    </button>
                </div>
                <button onClick={onShowPaymentModal} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform hover:scale-105">
                    Subscribe and Unlock
                </button>
                 <p className="text-xs text-gray-500 text-center mt-4">Subscription renews automatically. Cancel anytime.</p>
            </div>
        </div>
    );
}

export default PremiumView;