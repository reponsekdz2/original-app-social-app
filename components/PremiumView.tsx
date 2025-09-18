import React, { useState } from 'react';
import Icon from './Icon.tsx';
import type { Testimonial } from '../types.ts';

interface PremiumViewProps {
    onShowPaymentModal: () => void;
    isCurrentUserPremium: boolean;
    testimonials: Testimonial[];
}

const CheckIcon: React.FC = () => (
    <Icon className="w-6 h-6 text-green-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

const PremiumView: React.FC<PremiumViewProps> = ({ onShowPaymentModal, isCurrentUserPremium, testimonials }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  const features = [
    'Verified badge',
    'AI Magic Compose for comments',
    '4K UHD video uploads',
    'Ad-free experience',
    'Priority support',
    'Exclusive profile customization',
  ];
  
  const annualPrice = 95.99;
  const monthlyPrice = 9.99;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif tracking-wide">Unlock Your Potential</h1>
        <p className="text-lg text-gray-300">Go Premium to get a verified badge and access exclusive features.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Features List */}
        <div className="space-y-4">
          {features.map(feature => (
            <div key={feature} className="flex items-center gap-4">
              <CheckIcon />
              <span className="text-lg">{feature}</span>
            </div>
          ))}
        </div>

        {/* Pricing Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
          {isCurrentUserPremium ? (
             <div className="flex flex-col items-center justify-center h-48">
                <Icon className="w-16 h-16 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
                <p className="text-2xl font-bold mt-4">You are a Premium Member!</p>
             </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-gray-800 p-1 rounded-full flex items-center">
                  <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>Monthly</button>
                  <button onClick={() => setBillingCycle('annually')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors relative ${billingCycle === 'annually' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>
                    Annually
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">SAVE 20%</span>
                  </button>
                </div>
              </div>
              
              <p className="text-5xl font-bold mb-2">
                ${billingCycle === 'annually' ? (annualPrice / 12).toFixed(2) : monthlyPrice.toFixed(2)}
                <span className="text-lg text-gray-400">/ month</span>
              </p>
              <p className="text-gray-400 mb-6">Billed as one payment of ${billingCycle === 'annually' ? annualPrice : monthlyPrice}</p>
              
              <button onClick={onShowPaymentModal} className="w-full bg-white text-black font-bold py-3 rounded-full text-lg hover:bg-gray-200 transition-transform hover:scale-105">
                Subscribe
              </button>
            </>
          )}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">What Creators Are Saying</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-300 italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.user.avatar} alt={t.user.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{t.user.name}</p>

                  <p className="text-sm text-gray-400">@{t.user.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumView;