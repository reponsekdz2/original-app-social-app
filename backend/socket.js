// This file manages the Socket.IO server-side logic.

const userSockets = new Map(); // Map userId to socketId

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Associate userId with socketId upon connection
    socket.on('register', (userId) => {
        console.log(`Registering user ${userId} with socket ${socket.id}`);
        socket.join(userId); // Join a room with their own userId
        userSockets.set(userId, socket.id);
    });

    socket.on('join_conversation', (conversationId) => {
      console.log(`Socket ${socket.id} joining conversation ${conversationId}`);
      socket.join(conversationId);
    });
    
    socket.on('leave_conversation', (conversationId) => {
      console.log(`Socket ${socket.id} leaving conversation ${conversationId}`);
      socket.leave(conversationId);
    });

    socket.on('typing', (conversationId) => {
        socket.to(conversationId).emit('typing');
    });

    socket.on('stop_typing', (conversationId) => {
        socket.to(conversationId).emit('stop_typing');
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Clean up the userSockets map
      for (let [userId, socketId] of userSockets.entries()) {
          if (socketId === socket.id) {
              userSockets.delete(userId);
              break;
          }
      }
    });
  });
};