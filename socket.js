const Room = require('./db/roomdb');
const uuid = require('uuid').v4;
const SocketIO = require('./server');
const onlineUsers = {};

module.exports = (socket) => {
   const { io } = SocketIO;

   socket.on('disconnect', () => {
      delete onlineUsers[socket.id];
      io.emit('user_status', { online: false, userId: onlineUsers[socket.id] });
   });

   socket.on('edit_message', ({ message, roomId }) => {
      Room.editMessage(message, roomId);

      socket.to(roomId).emit('edited_message', message);
   });

   socket.on('join_rooms', ({ roomIds, userId }) => {
      onlineUsers[socket.id] = userId;

      socket.join(roomIds);
      io.emit('user_status', { online: true, userId });
   });

   socket.on('new_message', ({ message, roomId }) => {
      Room.appendMessage({ ...message, id: uuid() }, roomId);
      socket.to(roomId).send(message);
   });

   socket.on('typing', ({ roomId, user }) => {
      socket.to(roomId).emit('user_typing', user);
   });
};