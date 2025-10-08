
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon.tsx';
// Fix: Add .ts extension to types import
import type { Message, User } from '../types.ts';
import EmojiStickerPanel from './EmojiStickerPanel.tsx';
import { socketService } from '../services/socketService.ts';
import CameraCaptureModal from './CameraCaptureModal.tsx';

interface MessageInputProps {
  onSend: (content: string | File, type: Message['type'], replyToMessageId?: string) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  conversationId: string;
  otherUser: User | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, replyingTo, onCancelReply, conversationId, otherUser }) => {
  const [text, setText] = useState('');
  const [isEmojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setEmojiPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
    if (!socketService.socket || !otherUser) return;
    const payload = { conversationId, toUserId: otherUser.id };

    if (!typingTimeoutRef.current) {
        socketService.emit('typing', payload);
    }
    
    if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
        socketService.emit('stop_typing', payload);
        typingTimeoutRef.current = null;
    }, 2000);
  };


  const handleSendText = () => {
    if (text.trim()) {
      onSend(text, 'text', replyingTo?.id);
      setText('');
      onCancelReply();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if(otherUser) socketService.emit('stop_typing', { conversationId, toUserId: otherUser.id });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      onSend(file, fileType, replyingTo?.id);
      onCancelReply();
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const handleStartRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], `voicenote-${Date.now()}.webm`, { type: 'audio/webm' });
            onSend(audioFile, 'voicenote', replyingTo?.id);
            onCancelReply();
            stream.getTracks().forEach(track => track.stop()); // Release microphone
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    } catch (err) {
        console.error("Error starting recording:", err);
        alert("Could not access microphone.");
    }
  };

  const handleStopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
          setRecordingTime(0);
      }
  };


  const handleSelectEmoji = (emoji: string) => setText(prev => prev + emoji);
  
  const handleSelectSticker = (stickerUrl: string) => {
    onSend(stickerUrl, 'sticker', replyingTo?.id);
    onCancelReply();
    setEmojiPanelOpen(false);
  };
  
  const handleCaptureSend = (imageFile: File) => {
    onSend(imageFile, 'image', replyingTo?.id);
    onCancelReply();
    setCameraOpen(false);
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {replyingTo && (
        <div className="bg-gray-100 rounded-t-lg p-2 px-4 text-sm border-b-2 border-blue-500">
            <div className="flex justify-between items-center">
                <p className="text-gray-600">Replying to <span className="font-semibold">{replyingTo.senderId}</span></p>
                <button onClick={onCancelReply} className="p-1"><Icon className="w-4 h-4 text-gray-500"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
            </div>
            <p className="text-gray-500 truncate bg-black/5 p-1 rounded-md mt-1">{replyingTo.content}</p>
        </div>
      )}
      <div className="relative">
        {isEmojiPanelOpen && (
          <div className="absolute bottom-full mb-2">
              <EmojiStickerPanel onSelectEmoji={handleSelectEmoji} onSelectSticker={handleSelectSticker} />
          </div>
        )}
        <div className={`flex items-center gap-2 bg-gray-100 border border-gray-300 ${replyingTo ? 'rounded-b-full' : 'rounded-full'} px-2 py-1.5`}>
            {isRecording ? (
                <div className="flex items-center w-full px-2">
                    <button onClick={handleStopRecording} className="p-1.5 text-blue-600"><Icon className="w-6 h-6" fill="currentColor"><path d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></Icon></button>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mx-3"></div>
                    <span className="font-mono text-sm text-gray-600">{formatRecordingTime(recordingTime)}</span>
                </div>
            ) : (
                <>
                    <button onClick={() => setEmojiPanelOpen(p => !p)} className="p-1.5 rounded-full hover:bg-gray-200">
                        <Icon className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon>
                    </button>
                    <input type="text" placeholder="Write a message..." value={text} onChange={handleTyping} onKeyPress={(e) => e.key === 'Enter' && handleSendText()} className="w-full bg-transparent text-sm focus:outline-none" />
                    {text ? (
                        <button onClick={handleSendText} className="p-1.5 rounded-full hover:bg-gray-200 text-blue-600">
                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCameraOpen(true)} className="p-1.5 rounded-full hover:bg-gray-200">
                                <Icon className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></Icon>
                            </button>
                            <button onClick={handleStartRecording} className="p-1.5 rounded-full hover:bg-gray-200">
                                <Icon className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 6v-1.5m0-10.5v-1.5a6 6 0 00-6 6v1.5" /></Icon>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-full hover:bg-gray-200">
                                <Icon className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.735L16.5 14.61m0 0l-1.875-1.875M16.5 14.61V9.75m1.125 9.75a8.966 8.966 0 01-1.583 5.054 8.966 8.966 0 01-11.874 0 8.966 8.966 0 01-1.583-5.054m15.04 0a8.966 8.966 0 00-1.583-5.054 8.966 8.966 0 00-11.874 0 8.966 8.966 0 00-1.583 5.054" /></Icon>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
      {isCameraOpen && <CameraCaptureModal onClose={() => setCameraOpen(false)} onCapture={handleCaptureSend} />}
    </div>
  );
};

export default MessageInput;