// This map stores the mapping between a userId and their socketId
const userSocketMap = new Map();

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Register user and map their userId to socketId
        socket.on('register', (userId) => {
            if (userId) {
                userSocketMap.set(userId, socket.id);
                console.log(`User registered: ${userId} -> ${socket.id}`);
                console.log('Current user map:', userSocketMap);
            }
        });

        // Handle chat messages
        socket.on('send_message', (data) => {
            const { conversationId, message } = data;
            // This is a basic broadcast to the room/conversation.
            // A more robust system would get all participants and send to their sockets.
            socket.to(conversationId).emit('receive_message', data);
        });
        
        // Handle typing indicators
        socket.on('typing', (conversationId) => {
            socket.to(conversationId).emit('typing', conversationId);
        });

        socket.on('stop_typing', (conversationId) => {
            socket.to(conversationId).emit('stop_typing', conversationId);
        });


        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Find and remove user from the map on disconnect
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User deregistered: ${userId}`);
                    break;
                }
            }
             console.log('Current user map:', userSocketMap);
        });
    });
};

// Helper to get a socket by user ID
export const getSocketByUserId = (io, userId) => {
    const socketId = userSocketMap.get(userId);
    return socketId ? io.sockets.sockets.get(socketId) : null;
}

// Export the map for use in other modules (like sending notifications from API routes)
export { userSocketMap };
