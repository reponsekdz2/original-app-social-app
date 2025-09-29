import { Server } from 'socket.io';

const initializeSocket = (io, sessionMiddleware) => {
  // Convert session middleware for socket.io
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    const userId = socket.request.session?.userId;
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their room.`);
    }

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
    
    // --- Messaging ---
    socket.on('send_message', (message) => {
        message.participants.forEach(participant => {
            if (participant.id !== userId) {
                socket.to(participant.id).emit('receive_message', message);
            }
        });
    });

    socket.on('typing', ({ conversationId, toUserId }) => {
        socket.to(toUserId).emit('typing', { conversationId });
    });

    socket.on('stop_typing', ({ conversationId, toUserId }) => {
        socket.to(toUserId).emit('stop_typing', { conversationId });
    });
    
    // --- WebRTC Signaling ---
    socket.on('call-user', ({ to, offer, type }) => {
        socket.to(to).emit('incoming-call', { from: userId, offer, type });
    });

    socket.on('answer-call', ({ to, answer }) => {
        socket.to(to).emit('call-answered', { from: userId, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
        socket.to(to).emit('ice-candidate-received', { from: userId, candidate });
    });

    socket.on('reject-call', ({ to }) => {
        socket.to(to).emit('call-rejected', { from: userId });
    });
    
    socket.on('hang-up', ({ to }) => {
        socket.to(to).emit('call-ended', { from: userId });
    });

    // --- Live Streams ---
    socket.on('join_stream', (streamId) => {
        socket.join(`stream_${streamId}`);
    });
    socket.on('leave_stream', (streamId) => {
        socket.leave(`stream_${streamId}`);
    });
    socket.on('live_comment', ({ streamId, comment }) => {
        io.to(`stream_${streamId}`).emit('new_live_comment', comment);
    });

    // --- Real-time updates ---
    socket.on('like_post', ({ postId, likesCount }) => {
      // This is a basic implementation. A better one would target specific users.
      socket.broadcast.emit('like_update', { postId, likes: likesCount });
    });
    
    socket.on('comment_on_post', ({ postId, comment }) => {
        socket.broadcast.emit('new_comment', { postId, comment });
    });

  });
};

export default initializeSocket;
