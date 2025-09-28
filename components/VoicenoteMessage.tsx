import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon.tsx';

interface VoicenoteMessageProps {
  audioUrl: string;
  isCurrentUser: boolean;
}

const VoicenoteMessage: React.FC<VoicenoteMessageProps> = ({ audioUrl, isCurrentUser }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        }
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-2 p-2 rounded-2xl w-52 sm:w-64 ${isCurrentUser ? 'bg-red-500' : 'bg-gray-600'}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata"></audio>
      <button onClick={togglePlayPause} className="text-white flex-shrink-0">
        <Icon className="w-6 h-6">
            {isPlaying 
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            }
        </Icon>
      </button>
      <div ref={progressBarRef} className="flex-1 h-1 bg-white/30 rounded-full relative">
        <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }}></div>
        <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white" style={{ left: `calc(${progress}% - 5px)`}}></div>
      </div>
      <span className="text-xs text-white font-mono w-10 text-right">{formatTime(currentTime)}</span>
    </div>
  );
};

export default VoicenoteMessage;