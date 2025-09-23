
type EventHandler = (payload: any) => void;

class SocketService {
    private events: { [key: string]: EventHandler[] } = {};
    public socket: { on: Function, off: Function, emit: Function } | null = null;

    constructor() {
        // In a real app, you would initialize socket.io-client here.
        // For this mock, we'll just simulate the interface.
        this.socket = {
            on: this.on.bind(this),
            off: this.off.bind(this),
            emit: this.emit.bind(this),
        };
        console.log("Mock Socket Service Initialized");
    }

    on(event: string, handler: EventHandler) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);
    }

    off(event: string, handler: EventHandler) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(h => h !== handler);
        }
    }

    emit(event: string, payload?: any) {
        console.log(`%cSOCKET EMIT: ${event}`, 'color: #f5a623', payload);
        // Here you could add logic to simulate server responses.
    }

    // A method for other parts of the app to trigger events for simulation
    mockReceive(event: string, payload: any) {
        console.log(`%cSOCKET MOCK RECEIVE: ${event}`, 'color: #4a90e2', payload);
        if (this.events[event]) {
            this.events[event].forEach(handler => handler(payload));
        }
    }
}

export const socketService = new SocketService();
