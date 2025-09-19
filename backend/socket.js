// In-memory mapping of userId to socket object. In a production environment, this should be replaced with a distributed store like Redis.
const userSocketMap = new Map();

/**
 * Retrieves the socket object for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {import('socket.io').Socket | undefined} The socket object or undefined if not found.
 */
export const getSocketFromUserId = (userId) => {
    return userSocketMap.get(userId);
}

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('register', (userId) => {
            if (userId) {
                console.log(`User registered: ${userId} with socket ${socket.id}`);
                userSocketMap.set(userId, socket);
            }
        });
        
        // --- Messaging ---
        socket.on('typing', ({ conversationId, toUserId }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('typing', { conversationId });
            }
        });

        socket.on('stop_typing', ({ conversationId, toUserId }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('stop_typing', { conversationId });
            }
        });

        // --- Calling ---
        socket.on('outgoing_call', ({ fromUser, toUserId }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('incoming_call', { fromUser });
            } else {
                // Let the caller know the user is not online
                socket.emit('call_error', { message: `${fromUser.username} is not online.` });
            }
        });
        
        socket.on('accept_call', ({ toUser, fromUserId }) => {
            const callerSocket = getSocketFromUserId(fromUserId);
            if (callerSocket) {
                callerSocket.emit('call_accepted', { withUser: toUser });
            }
        });
        
        socket.on('decline_call', ({ fromUserId }) => {
            const callerSocket = getSocketFromUserId(fromUserId);
            if (callerSocket) {
                callerSocket.emit('call_declined');
            }
        });

        socket.on('end_call', ({ toUserId }) => {
            const otherUserSocket = getSocketFromUserId(toUserId);
            if (otherUserSocket) {
                otherUserSocket.emit('call_ended');
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // Find and remove user from the map on disconnect to prevent memory leaks
            for (let [userId, userSocket] of userSocketMap.entries()) {
                if (userSocket.id === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User unregistered: ${userId}`);
                    break;
                }
            }
        });
    });
};
