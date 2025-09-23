import { io, Socket } from 'socket.io-client';

type EventHandler = (payload: any) => void;

class SocketService {
    public socket: Socket | null = null;

    connect(serverUrl: string): void {
        if (this.socket) {
            return;
        }
        this.socket = io(serverUrl, {
            withCredentials: true,
        });

        this.socket.on('connect', () => {
            console.log(`Socket connected with ID: ${this.socket?.id}`);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event: string, handler: EventHandler): void {
        this.socket?.on(event, handler);
    }

    off(event: string, handler?: EventHandler): void {
        this.socket?.off(event, handler);
    }

    emit(event: string, payload?: any): void {
        this.socket?.emit(event, payload);
    }
}

export const socketService = new SocketService();
