
import React, { useState } from 'react';
import Icon from './Icon.tsx';
// Fix: Corrected import path for types
import type { Testimonial } from '../types.ts';

interface PremiumViewProps {
    onShowPaymentModal: () => void;
    isCurrentUserPremium: boolean;
    testimonials: Testimonial[];
}

const CheckIcon: React.FC = () => (
    <Icon className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 