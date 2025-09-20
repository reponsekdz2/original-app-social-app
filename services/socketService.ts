import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

class SocketService {
    public socket: Socket | null = null;

    connect(userId: string): void {
        if (this.socket) {
            this.socket.disconnect();
        }
        // Fix: Use 'auth' instead of 'query' for passing data on connection, which is the correct way for socket.io-client v3+.
        this.socket = io(SOCKET_URL, {
            auth: { userId }
        });

        // Fix: Add optional chaining to prevent errors if the socket is not yet initialized.
        this.socket?.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        // Fix: Add optional chaining to prevent errors if the socket is not yet initialized.
        this.socket?.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event: string, callback: (data: any) => void): void {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (data: any) => void): void {
        this.socket?.off(event, callback);
    }

    emit(event: string, data: any): void {
        this.socket?.emit(event, data);
    }
}

export const socketService = new SocketService();