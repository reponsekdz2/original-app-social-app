
const userSocketMap = new Map(); // Map<userId, socketId>

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on('register', (userId) => {
            console.log(`Registering user ${userId} with socket ${socket.id}`);
            userSocketMap.set(userId, socket.id);
            // Let other services know who is online if needed
            io.emit('user_online', userId);
        });

        socket.on('send_message', ({ conversationId, message }) => {
            // This is a simplified version. A real app would look up all participants
            // in the conversation and send the message to each of their sockets.
            console.log(`Message received for convo ${conversationId}`);
            socket.broadcast.emit('receive_message', { conversationId, message });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Find and remove user from map
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    io.emit('user_offline', userId);
                    break;
                }
            }
        });
    });
};
