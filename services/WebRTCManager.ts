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

    constructor() {
        this.initialize();
    }
    
    initialize() {
       socketService.on('call-answered', async ({ answer }) => {
            if (this.peerConnection) {
                const remoteDesc = new RTCSessionDescription(answer);
                await this.peerConnection.setRemoteDescription(remoteDesc);
            }
        });
        
        socketService.on('ice-candidate-received', (candidate) => {
            if (this.peerConnection) {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        socketService.on('call-ended', () => {
            if (this.onCallEnded) {
                this.onCallEnded();
            }
        });
    }

    private async createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(configuration);

        // Add local tracks to the peer connection
        this.localStream?.getTracks().forEach(track => {
            this.peerConnection?.addTrack(track, this.localStream!);
        });

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketService.emit('ice-candidate', event.candidate);
            }
        };

        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            if (this.onRemoteStream) {
                this.onRemoteStream(this.remoteStream);
            }
        };

        this.peerConnection.onconnectionstatechange = () => {
            if (this.peerConnection?.connectionState === 'disconnected' || this.peerConnection?.connectionState === 'closed' || this.peerConnection?.connectionState === 'failed') {
                 if (this.onCallEnded) {
                    this.onCallEnded();
                }
            }
        };
    }

    async getLocalStream(video: boolean, audio: boolean): Promise<MediaStream | null> {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
            return this.localStream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            return null;
        }
    }

    async startCall(toUserId: string, isVideo: boolean): Promise<{ offer: RTCSessionDescriptionInit } | null> {
        await this.getLocalStream(isVideo, true);
        await this.createPeerConnection();

        if (this.peerConnection) {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            socketService.emit('call-user', { to: toUserId, offer });

            return { offer };
        }
        return null;
    }

    async answerCall(offer: RTCSessionDescriptionInit, toUserId: string, isVideo: boolean) {
        await this.getLocalStream(isVideo, true);
        await this.createPeerConnection();

        if (this.peerConnection) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            socketService.emit('answer-call', { to: toUserId, answer });
        }
    }

    hangUp(toUserId?: string) {
        if(toUserId) {
            socketService.emit('hang-up', { to: toUserId });
        }
        this.stopStream();
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        this.remoteStream = null;
    }

    stopStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
    }

    toggleMute(isMuted: boolean) {
        if(this.localStream) {
            this.localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
        }
    }

    toggleVideo(isVideoOff: boolean) {
        if(this.localStream) {
            this.localStream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
        }
    }
}

export const webRTCManager = new WebRTCManager();
