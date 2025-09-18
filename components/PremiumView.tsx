import React, { useState } from 'react';
import Icon from './Icon.tsx';
import type { Testimonial } from '../types.ts';

interface PremiumViewProps {
    onShowPaymentModal: () => void;
    isCurrentUserPremium: boolean;
    testimonials: Testimonial[];
}

const CheckIcon: React.FC = () => (
    <Icon className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

const CrossIcon: React.FC = () => (
    <Icon className="w-6 h-6 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></Icon>
);

const PremiumView: React.FC<PremiumViewProps> = ({ onShowPaymentModal, isCurrentUserPremium, testimonials }) => {
    const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');

    const comparisonFeatures = [
        { feature: 'Verified Badge', free: <CrossIcon />, premium: <CheckIcon /> },
        { feature: 'Ad-Free Experience', free: <CrossIcon />, premium: <CheckIcon /> },
        { feature: 'Advanced AI Tools', free: 'Limited', premium: 'Unlimited' },
        { feature: 'HD Video Uploads', free: <CheckIcon />, premium: <CheckIcon /> },
        { feature: '4K UHD Video Uploads', free: <CrossIcon />, premium: <CheckIcon /> },
        { feature: 'Early Access to Features', free: <CrossIcon />, premium: <CheckIcon /> },
        { feature: 'Profile Customization', free: 'Basic', premium: 'Advanced' },
    ];

    if (isCurrentUserPremium) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center h-[calc(100vh-10rem)]">
                <div className="text-center max-w-xl mx-auto bg-gray-900 rounded-lg p-10 border border-gray-800 shadow-2xl">
                    <Icon className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 6.22a.75.75 0 00-1.06-1.06L11 11.69 8.78 9.47a.75.75 0 00-1.06 1.06l2.75 2.75a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" />
                    </Icon>
                    <h1 className="text-4xl font-bold text-white mb-3">Welcome to Premium!</h1>
                    <p className="text-gray-300">Your subscription is active. You can now enjoy all the exclusive features of talka Premium.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4 font-serif tracking-wide">Unlock talka Premium</h1>
                <p className="text-lg text-gray-300 mb-12">Supercharge your social experience with exclusive features, advanced AI tools, and an ad-free experience.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl mb-16 overflow-hidden">
                <h2 className="text-2xl font-bold text-center p-6 bg-gray-900">Free vs. Premium</h2>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Feature</th>
                            <th scope="col" className="px-6 py-3 text-center">Free</th>
                            <th scope="col" className="px-6 py-3 text-center text-red-500 font-bold">Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonFeatures.map((item, index) => (
                            <tr key={index} className="border-b border-gray-800">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.feature}</th>
                                <td className="px-6 py-4 flex justify-center items-center text-gray-300">{item.free}</td>
                                <td className="px-6 py-4 text-center font-semibold text-white">{item.premium}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="max-w-5xl mx-auto mb-16">
                 <h2 className="text-3xl font-bold text-center mb-8">What Creators Are Saying</h2>
                 <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
                            <p className="text-gray-300 italic mb-4">"{t.quote}"</p>
                            <div className="flex items-center justify-center gap-2">
                                <img src={t.user.avatar} alt={t.user.username} className="w-8 h-8 rounded-full" />
                                <span className="font-semibold text-sm">@{t.user.username}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8 border border-gray-800 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <button onClick={() => setPlan('monthly')} className={`flex-1 p-4 rounded-lg border-2 text-left transition-all duration-300 transform hover:scale-105 ${plan === 'monthly' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                        <p className="font-bold text-lg">Monthly</p>
                        <p className="text-2xl font-extrabold">$9.99<span className="text-base font-normal text-gray-400">/month</span></p>
                    </button>
                    <button onClick={() => setPlan('yearly')} className={`relative flex-1 p-4 rounded-lg border-2 text-left transition-all duration-300 transform hover:scale-105 ${plan === 'yearly' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
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