// In a real application, you would use a STUN/TURN server for NAT traversal.
// For this example, we'll use public STUN servers from Google.
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

import { socketService } from './socketService.ts';

class WebRTCManager {
    peerConnection: RTCPeerConnection | null = null;
    localStream: MediaStream | null = null;
    remoteStream: MediaStream | null = null;
    
    // Callbacks to update UI
    onRemoteStream: ((stream: MediaStream) => void) | null = null;
    onCallEnded: (() => void) | null = null;

    private currentTargetId: string | null = null;
    private isSharingScreen = false;
    private cameraStream: MediaStream | null = null;


    constructor() {
        this.initialize();
    }
    
    initialize() {
       socketService.on('call-answered', async ({ answer }) => {
            if (this.peerConnection && this.peerConnection.signalingState === 'have-local-offer') {
                const remoteDesc = new RTCSessionDescription(answer);
                await this.peerConnection.setRemoteDescription(remoteDesc);
            }
        });
        
        socketService.on('ice-candidate-received', ({ candidate }) => {
            if (this.peerConnection) {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error("Error adding ICE candidate", e));
            }
        });

        socketService.on('call-ended', () => {
            if (this.onCallEnded) this.onCallEnded();
        });

        socketService.on('call-rejected', () => {
            if (this.onCallEnded) this.onCallEnded();
        })
    }

    private async createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(configuration);

        this.localStream?.getTracks().forEach(track => {
            this.peerConnection?.addTrack(track, this.localStream!);
        });

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.currentTargetId) {
                socketService.emit('ice-candidate', { to: this.currentTargetId, candidate: event.candidate });
            }
        };

        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            if (this.onRemoteStream) {
                this.onRemoteStream(this.remoteStream);
            }
        };

        this.peerConnection.onconnectionstatechange = () => {
            if (['disconnected', 'closed', 'failed'].includes(this.peerConnection?.connectionState || '')) {
                 if (this.onCallEnded) this.onCallEnded();
            }
        };
    }

    async getLocalStream(video: boolean, audio: boolean): Promise<MediaStream | null> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
            this.localStream = stream;
            this.cameraStream = stream; // Keep a reference to the camera stream
            return this.localStream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            return null;
        }
    }

    async startCall(toUserId: string, isVideo: boolean) {
        this.currentTargetId = toUserId;
        await this.getLocalStream(isVideo, true);
        await this.createPeerConnection();

        if (this.peerConnection) {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            socketService.emit('call-user', { to: toUserId, offer, type: isVideo ? 'video' : 'audio' });
        }
    }

    async answerCall(offer: RTCSessionDescriptionInit, toUserId: string, isVideo: boolean) {
        this.currentTargetId = toUserId;
        await this.getLocalStream(isVideo, true);
        await this.createPeerConnection();

        if (this.peerConnection) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            socketService.emit('answer-call', { to: toUserId, answer });
        }
    }
    
    rejectCall(toUserId: string) {
        socketService.emit('reject-call', { to: toUserId });
    }

    hangUp(toUserId?: string) {
        if(toUserId) socketService.emit('hang-up', { to: toUserId });
        this.stopStream();
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        this.remoteStream = null;
        this.currentTargetId = null;
        this.isSharingScreen = false;
    }

    stopStream() {
        this.localStream?.getTracks().forEach(track => track.stop());
        this.cameraStream?.getTracks().forEach(track => track.stop());
        this.localStream = null;
        this.cameraStream = null;
    }

    toggleMute(isMuted: boolean) {
        this.localStream?.getAudioTracks().forEach(track => track.enabled = !isMuted);
    }

    toggleVideo(isVideoOff: boolean) {
        this.localStream?.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
    }
    
    async switchCamera() {
        if (!this.cameraStream) return;
        const videoTrack = this.cameraStream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        const newFacingMode = settings.facingMode === 'user' ? 'environment' : 'user';
        
        // Stop current tracks before getting new ones
        this.cameraStream.getTracks().forEach(track => track.stop());

        this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newFacingMode }});
        const newVideoTrack = this.cameraStream.getVideoTracks()[0];
        
        const sender = this.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        sender?.replaceTrack(newVideoTrack);
        this.localStream = this.cameraStream; // update local stream reference
    }

    async startScreenShare() {
        if (this.isSharingScreen) return;
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        const sender = this.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
            await sender.replaceTrack(screenTrack);
            this.isSharingScreen = true;
            this.localStream = screenStream; // Update local stream to the screen
            // When user stops sharing via browser UI
            screenTrack.onended = () => this.stopScreenShare();
        }
    }

    async stopScreenShare() {
        if (!this.isSharingScreen || !this.cameraStream) return;
        const cameraTrack = this.cameraStream.getVideoTracks()[0];
        const sender = this.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
            await sender.replaceTrack(cameraTrack);
            this.isSharingScreen = false;
            this.localStream = this.cameraStream; // Revert local stream back to camera
        }
    }
}

export const webRTCManager = new WebRTCManager();