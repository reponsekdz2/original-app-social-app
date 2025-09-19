

import React from 'react';
import type { Testimonial } from '../types';
import Icon from './Icon.tsx';

interface PremiumViewProps {
  testimonials: Testimonial[];
  onSubscribe: () => void;
}

const PremiumView: React.FC<PremiumViewProps> = ({ testimonials, onSubscribe }) => {
  const features = [
    'Get a verified badge on your profile.',
    'Upload videos in stunning 4K UHD.',
    'Enjoy a completely ad-free experience.',
    'Priority support from our team.',
    'Early access to new features.',
    'Eligible to receive a share of ad revenue.',
  ];

  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif tracking-wide">Go Premium</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10">Unlock exclusive features, get verified, and enhance your experience.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl shadow-red-900/10 mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Premium Features</h2>
            <ul className="space-y-4 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></Icon>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="text-center mb-2">
                <span className="text-5xl font-bold">$95.99</span>
                <span className="text-gray-400">/ year</span>
            </div>
            <button onClick={onSubscribe} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full mt-4 text-lg transition-transform hover:scale-105">
                Subscribe Now
            </button>
        </div>

        {testimonials.length > 0 && (
             <div className="max-w-4xl mx-auto w-full">
                <h3 className="text-2xl font-bold text-center mb-6">What Creators Are Saying</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                             <p className="text-gray-300 mb-4">"{t.quote}"</p>
                             <div className="flex items-center gap-3">
                                <img src={t.user.avatar} alt={t.user.username} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold">{t.user.name}</p>
                                    <p className="text-sm text-gray-500">@{t.user.username}</p>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
             </div>
        )}
    </div>
  );
};

export default PremiumView;