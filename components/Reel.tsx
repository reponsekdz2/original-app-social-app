import React from 'react';
import type { Reel as ReelType } from '../types';
import Icon from './Icon';

interface ReelProps {
    reel: ReelType;
}

const Reel: React.FC<ReelProps> = ({ reel }) => {
    return (
        <div className="relative w-full h-full bg-black">
            <img src={reel.videoUrl} alt={reel.caption} className="w-full h-full object-cover" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center mb-2">
                    <img src={reel.user.avatar} alt={reel.user.username} className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-white"/>
                    <p className="font-bold">{reel.user.username}</p>
                    <button className="ml-4 px-3 py-1 border border-white rounded-md text-sm font-semibold">Follow</button>
                </div>
                <p className="text-sm">{reel.caption}</p>
            </div>

            <div className="absolute bottom-4 right-2 flex flex-col items-center space-y-6 text-white">
                <button className="flex flex-col items-center">
                    <Icon className="w-8 h-8"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001a.75.75 0 01.224-1.037l.428-.746a.45.45 0 00-.224-.194l-2.034-1.173a.75.75 0 01-.144-1.303l.006-.003c.1-.058.22-.078.332-.044a4.914 4.914 0 004.897-1.123 4.914 4.914 0 001.123-4.897c.034-.112.014-.232-.044-.332l-.003-.006a.75.75 0 01.776-.89l2.454.409a.75.75 0 01.665.665l.409 2.454a.75.75 0 01-.89.776l-.006-.003c-.1.058-.22-.078-.332-.044a4.914 4.914 0 00-4.897 1.123 4.914 4.914 0 00-1.123 4.897c-.034.112-.014.232.044.332l.003.006a.75.75 0 01-.144 1.303l-2.034 1.173a.45.45 0 00.224.194l.428.746a.75.75 0 01-.224 1.037h-.001z" /></Icon>
                    <span className="text-sm font-semibold">{reel.likes.toLocaleString()}</span>
                </button>
                 <button className="flex flex-col items-center">
                    <Icon className="w-8 h-8"><path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-1.5 0V6.375a.375.375 0 00-.375-.375H3.375A.375.375 0 003 6.375v9.25c0 .207.168.375.375.375h17.25a.375.375 0 00.375-.375v-3.026a.75.75 0 011.5 0v3.026c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 15.625v-9.25zM12.75 6a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75z" clipRule="evenodd" /></Icon>
                    <span className="text-sm font-semibold">{reel.comments.toLocaleString()}</span>
                </button>
                 <button className="flex flex-col items-center">
                    <Icon className="w-8 h-8"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></Icon>
                    <span className="text-sm font-semibold">{reel.shares.toLocaleString()}</span>
                </button>
            </div>

        </div>
    );
};

export default Reel;
