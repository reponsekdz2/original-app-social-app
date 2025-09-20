// In-memory mapping of userId to socket object. In a production environment, this should be replaced with a distributed store like Redis.
const userSocketMap = new Map();

/**
 * Retrieves the socket object for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {import('socket.io').Socket | undefined} The socket object or undefined if not found.
 */
export const getSocketFromUserId = (userId) => {
    return userSocketMap.get(String(userId));
}

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        const userId = socket.handshake.auth.userId;
        if (userId) {
            console.log(`User registered: ${userId} with socket ${socket.id}`);
            userSocketMap.set(String(userId), socket);
        }
        
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
        
        socket.on('mark_as_read', ({ conversationId, messageId, toUserId }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('message_read', { conversationId, messageId });
            }
        });

        // --- Live Streaming ---
        socket.on('join_stream', (streamId) => {
            socket.join(`stream_${streamId}`);
            console.log(`Socket ${socket.id} joined stream ${streamId}`);
        });

        socket.on('leave_stream', (streamId) => {
            socket.leave(`stream_${streamId}`);
            console.log(`Socket ${socket.id} left stream ${streamId}`);
        });
        
        socket.on('live_comment', ({ streamId, comment }) => {
            io.to(`stream_${streamId}`).emit('new_live_comment', comment);
        });


        // --- Video Calling & WebRTC Signaling ---
        socket.on('outgoing_call', ({ fromUser, toUserId, callType, offer }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('incoming_call', { fromUser, callType, offer });
            } else {
                socket.emit('call_error', { message: `${fromUser.username} is not online.` });
            }
        });
        
        socket.on('accept_call', ({ toUser, fromUserId }) => {
            const callerSocket = getSocketFromUserId(fromUserId);
            if (callerSocket) {
                callerSocket.emit('call_accepted', { withUser: toUser });
            }
        });
        
        socket.on('decline_call', ({ toUserId }) => {
            const callerSocket = getSocketFromUserId(toUserId);
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

        // WebRTC Signaling Events
        socket.on('webrtc-offer', ({ offer, toUserId }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('webrtc-offer', { offer, fromUserId: userId });
            }
        });
        
        socket.on('webrtc-answer', ({ answer, toUserId }) => {
            const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('webrtc-answer', { answer });
            }
        });

        socket.on('webrtc-ice-candidate', ({ candidate, toUserId }) => {
             const recipientSocket = getSocketFromUserId(toUserId);
            if (recipientSocket) {
                recipientSocket.emit('webrtc-ice-candidate', { candidate });
            }
        });


        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // Find and remove user from the map on disconnect to prevent memory leaks
            for (let [key, value] of userSocketMap.entries()) {
                if (value.id === socket.id) {
                    userSocketMap.delete(key);
                    console.log(`User unregistered: ${key}`);
                    break;
                }
            }
        });
    });
};