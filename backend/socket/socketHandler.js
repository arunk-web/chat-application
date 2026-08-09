const Message = require('../models/Message');

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('user_join', (username) => {
      onlineUsers.set(socket.id, username);
      io.emit('online_users', Array.from(onlineUsers.values()));
    });

    socket.on('send_message', async (data) => {
      try {
        const { username, text, tempId } = data;

        if (!username || !text) {
          socket.emit('error_message', 'Username and text are required');
          return;
        }

        const newMessage = new Message({ username, text });
        await newMessage.save();

        io.emit('receive_message', { ...newMessage.toObject(), tempId });
      } catch (error) {
        console.error('Error handling send_message:', error.message);
        socket.emit('error_message', 'Failed to send message');
      }
    });

    socket.on('typing', (username) => {
      socket.broadcast.emit('user_typing', username);
    });

    socket.on('stop_typing', (username) => {
      socket.broadcast.emit('user_stop_typing', username);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      onlineUsers.delete(socket.id);
      io.emit('online_users', Array.from(onlineUsers.values()));
    });
  });
};

module.exports = socketHandler;