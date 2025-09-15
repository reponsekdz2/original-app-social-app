import React, { useState, useRef } from 'react';
import type { Message, User } from '../types';
import Icon from './Icon';
import MagicComposePanel from './MagicComposePanel';

interface MessageInputProps {
    onSend: (content: string, type: 'text' | 'image' | 'voice') => void;
    replyingTo: Message | null;
    onCancelReply: () => void;
    participants: User[];
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, replyingTo, onCancelReply, participants }) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showMagicCompose, setShowMagicCompose] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (text.trim()) {
            onSend(text, 'text');
            setText('');
            setShowMagicCompose(false);
        }
    };

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setIsRecording(true);
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];
                mediaRecorderRef.current.ondataavailable = event => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    onSend(audioUrl, 'voice');
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderRef.current.start();
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Microphone access was denied. Please allow microphone access in your browser settings.");
            }
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onSend(reader.result as string, 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSend(e);
        }
    };

    return (
        <div className="relative">
             {showMagicCompose && text.trim() && (
                <MagicComposePanel 
                    originalText={text}
                    onSelectSuggestion={(suggestion) => {
                        setText(suggestion);
                        setShowMagicCompose(false);
                    }}
                    onClose={() => setShowMagicCompose(false)}
                />
            )}
            {replyingTo && (
                <div className="bg-gray-700 p-2 text-sm flex justify-between items-center border-l-4 border-red-500 mx-4 rounded">
                    <div>
                        <p className="font-bold">Replying to {participants.find(p => p.id === replyingTo.senderId)?.username}</p>
                        <p className="text-gray-300 truncate">{replyingTo.type === 'voice' ? 'Voice message' : replyingTo.type === 'image' ? 'Image' : replyingTo.content}</p>
                    </div>
                    <button onClick={onCancelReply}><Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon></button>
                </div>
            )}
            <div className={`p-4 flex items-start space-x-2 transition-colors duration-300 ${isRecording ? 'bg-red-900/50' : ''}`}>
                <div className="flex-1 flex items-center bg-gray-700 rounded-full px-2 py-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-white">
                        <Icon className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 110 16.5 8.25 8.25 0 010-16.5zM8.625 9.375a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125.375a.375.375 0 10-.75 0 .375.375 0 00.75 0zm4.125-.375a.375.375 0 11-.75 0 .375.375 0 01.75 0z" clipRule="evenodd" /></Icon>
                    </button>
                    <form onSubmit={handleSend} className="w-full">
                        <input 
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isRecording ? 'Recording...' : 'Message...'}
                            className="w-full bg-transparent px-2 py-1 focus:outline-none"
                            disabled={isRecording}
                        />
                    </form>
                    {text.trim() === '' && !isRecording && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white">
                            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" /></Icon>
                        </button>
                    )}
                </div>
                {text.trim() ? (
                    <div className="flex items-center">
                         <button onClick={() => setShowMagicCompose(p => !p)} className={`p-2 rounded-full transition-colors ${showMagicCompose ? 'bg-red-500/50 text-white' : 'text-gray-400 hover:text-white'}`} title="Magic Compose">
                            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                        </button>
                        <button onClick={handleSend} className="text-red-500 font-semibold hover:text-red-400 px-2">
                            Send
                        </button>
                    </div>
                ) : isRecording ? (
                    <div className="flex items-center text-red-400 p-2">
                        <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <button onClick={handleStopRecording} className="text-white bg-red-600 rounded-full p-1">
                             <Icon className="w-4 h-4"><path d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></Icon>
                        </button>
                    </div>
                ) : (
                    <button onMouseDown={handleStartRecording} onMouseUp={handleStopRecording} onMouseLeave={handleStopRecording} className="p-2 text-gray-400 hover:text-white">
                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2" /></Icon>
                    </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
        </div>
    );
};

export default MessageInput;