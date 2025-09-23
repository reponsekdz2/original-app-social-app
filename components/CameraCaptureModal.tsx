import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon.tsx';

interface CameraCaptureModalProps {
  onClose: () => void;
  onCapture: (imageFile: File) => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const openCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' }, 
            audio: false 
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions.");
      }
    };

    openCamera();

    return () => {
      // Cleanup: stop all tracks to release the camera
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSend = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const imageFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(imageFile);
        });
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4 text-center">
        <Icon className="w-16 h-16 text-red-500 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></Icon>
        <p className="text-xl font-semibold">{error}</p>
        <button onClick={onClose} className="mt-6 bg-red-600 text-white font-semibold py-2 px-6 rounded-md">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured preview" className="max-w-full max-h-full object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 top-0 p-4 flex justify-end">
         <button onClick={onClose} className="p-2 bg-black/50 rounded-full">
            <Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon>
         </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 flex items-center justify-center">
        {capturedImage ? (
          <div className="w-full flex justify-between items-center">
            <button onClick={handleRetake} className="font-semibold text-lg py-2 px-4">
              Retake
            </button>
            <button onClick={handleSend} className="flex items-center gap-2 bg-red-600 py-3 px-6 rounded-full font-bold">
              Send
              <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
            </button>
          </div>
        ) : (
          <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white/30 border-4 border-white flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCaptureModal;