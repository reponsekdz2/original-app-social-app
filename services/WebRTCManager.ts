import { socketService } from './socketService.ts';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

class WebRTCManager {
  public peerConnection: RTCPeerConnection | null = null;
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;
  private otherUserId: string | null = null;

  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;

  async getLocalStream(video = true, audio = true): Promise<MediaStream> {
    // Stop any existing tracks before getting a new stream
    this.localStream?.getTracks().forEach(track => track.stop());
    
    const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    this.localStream = stream;
    return stream;
  }
  
  createPeerConnection(otherUserId: string, onRemoteStream: (stream: MediaStream) => void): RTCPeerConnection {
    this.otherUserId = otherUserId;
    this.onRemoteStreamCallback = onRemoteStream;
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks to the connection
    this.localStream?.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, this.localStream!);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.otherUserId) {
        socketService.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          toUserId: this.otherUserId,
        });
      }
    };
    
    this.peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        this.remoteStream = remoteStream;
        this.onRemoteStreamCallback?.(remoteStream);
    };

    return this.peerConnection;
  }

  async createOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    if (!this.peerConnection || !this.otherUserId) return;
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    socketService.emit('webrtc-offer', {
      offer,
      toUserId: this.otherUserId,
    });
    return offer;
  }
  
  async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit | undefined> {
     if (!this.peerConnection || !this.otherUserId) return;
     const answer = await this.peerConnection.createAnswer();
     await this.peerConnection.setLocalDescription(answer);

     socketService.emit('webrtc-answer', {
        answer,
        toUserId: this.otherUserId
     });
     return answer;
  }
  
  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection || !candidate) return;
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  }
  
  hangup(): void {
    this.localStream?.getTracks().forEach(track => track.stop());
    if (this.peerConnection) {
        this.peerConnection.ontrack = null;
        this.peerConnection.onicecandidate = null;
        this.peerConnection.close();
    }
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.otherUserId = null;
    this.onRemoteStreamCallback = null;
  }
}

export const webRTCManager = new WebRTCManager();