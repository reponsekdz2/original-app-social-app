import { Server } from 'socket.io';

const initializeSocket = (io, sessionMiddleware) => {
  // Allow socket.io to access session information
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on('connection', (socket) => {
    const session = socket.request.session;
    const userId = session?.userId;

    if (!userId) {
      console.log('A user connected without a session.');
      socket.disconnect();
      return;
    }

    console.log(`User ${userId} connected with socket ${socket.id}`);
    socket.join(userId); // Join a room with their own user ID for direct notifications

    // --- WebRTC Signaling ---
    socket.on('call-user', ({ to, offer }) => {
        // Forward the offer to the target user
        socket.to(to).emit('incoming-call', { from: userId, offer });
    });

    socket.on('answer-call', ({ to, answer }) => {
        // Forward the answer back to the original caller
        socket.to(to).emit('call-answered', { from: userId, answer });
    });

    socket.on('ice-candidate', (candidate) => {
        // This is a bit tricky without knowing who the peer is.
        // A better approach would be to include the target user in the event.
        // For simplicity, we'll broadcast it, but in a real app, this should be targeted.
        socket.broadcast.emit('ice-candidate-received', candidate);
    });
    
    socket.on('hang-up', ({ to }) => {
        socket.to(to).emit('call-ended');
    });


    // --- Other Real-time Features ---
    socket.on('typing', ({ conversationId, toUserId }) => {
        socket.to(toUserId).emit('typing', { conversationId });
    });

    socket.on('stop_typing', ({ conversationId, toUserId }) => {
        socket.to(toUserId).emit('stop_typing', { conversationId });
    });
    
    socket.on('join_stream', (streamId) => {
        socket.join(`stream:${streamId}`);
        console.log(`User ${userId} joined stream ${streamId}`);
    });

    socket.on('leave_stream', (streamId) => {
        socket.leave(`stream:${streamId}`);
        console.log(`User ${userId} left stream ${streamId}`);
    });

    socket.on('live_comment', ({ streamId, comment }) => {
        io.to(`stream:${streamId}`).emit('new_live_comment', comment);
    });


    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from socket ${socket.id}`);
    });
  });
};

export default initializeSocket;
