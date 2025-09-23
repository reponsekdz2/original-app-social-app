
import React from 'react';
import type { LiveStream } from '../types.ts';
import Icon from './Icon.tsx';

interface LiveStreamsViewProps {
  streams: LiveStream[];
  onJoinStream: (stream: LiveStream) => void;
}

const LiveStreamsView: React.FC<LiveStreamsViewProps> = ({ streams, onJoinStream }) => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Live Now</h1>
      {streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {streams.map(stream => (
            <div key={stream.id} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer" onClick={() => onJoinStream(stream)}>
              {/* Placeholder for video thumbnail */}
              <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                 <img src={stream.user.avatar_url} alt="streamer avatar" className="w-24 h-24 rounded-full opacity-50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
               <div className="absolute bottom-2 left-2 text-white">
                <p className="font-semibold">{stream.user.username}</p>
                <p className="text-sm text-gray-300">{stream.title}</p>
              </div>
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Icon className="w-16 h-16 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></Icon>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <Icon className="w-20 h-20 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
          <h3 className="text-xl font-semibold">No one is live right now.</h3>
          <p>Check back later to see when your favorite creators go live.</p>
        </div>
      )}
    </div>
  );
};

export default LiveStreamsView;
