import React, { useState, useEffect } from 'react';
import type { LiveStream } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';

interface LiveStreamsViewProps {
  onViewStream: (stream: LiveStream) => void;
}

const LiveStreamsView: React.FC<LiveStreamsViewProps> = ({ onViewStream }) => {
    const [streams, setStreams] = useState<LiveStream[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStreams = async () => {
            setIsLoading(true);
            try {
                const liveStreams = await api.getLiveStreams();
                setStreams(liveStreams);
            } catch (error) {
                console.error("Failed to fetch live streams:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStreams();
    }, []);

    if (isLoading) {
        return <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
        </div>;
    }
    
    if (streams.length === 0) {
        return <div className="text-center text-gray-500 p-16">
            <Icon className="w-16 h-16 mx-auto mb-4"><path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></Icon>
            <p>No one is live right now.</p>
        </div>;
    }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Live Now</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {streams.map(stream => (
          <div key={stream.id} className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group" onClick={() => onViewStream(stream)}>
            {/* In a real app, this would be a thumbnail or a muted video preview */}
            <img src={stream.user.avatar_url} alt={stream.title} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold">LIVE</div>
            <div className="absolute bottom-2 left-2 text-white">
                <p className="font-bold text-sm">{stream.user.username}</p>
                <p className="text-xs">{stream.title}</p>
            </div>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Icon className="w-12 h-12 text-white"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></Icon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStreamsView;