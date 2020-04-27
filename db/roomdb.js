const { rooms, users, save } = require('./db');

exports.appendMessage = (message, roomId) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   if (idx < 0) throw { status: 404, message: 'Invalid room id.' };

   rooms.entries[idx].messages.push(message);

   save(rooms);
};

exports.delete = (roomId) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   if (idx < 0) throw { status: 404, message: 'Room ID not found.' };

   rooms.entries.splice(idx, 1);

   save(rooms);

   users.entries = users.entries.map(user => ({
      ...user,
      rooms: user.rooms.filter(id => id !== roomId),
      owner: user.owner.filter(id => id !== roomId),
   }));

   save(users);
};

exports.demoteAdmin = (roomId, userId) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   if (idx < 0) throw { status: 404, message: 'Invalid room id.' };

   const room = rooms.entries[idx];
   room.admins = room.admins.filter(({ id }) => id !== userId);
   rooms.entries[idx] = room;

   save(rooms);
};

exports.editMessage = (message, roomId) => {
   const roomIdx = rooms.entries.findIndex(({ id }) => id === roomId);
   if (roomIdx < 0) return;

   const room = rooms.entries[roomIdx];
   room.messages.splice(
      room.messages.findIndex(({ id }) => id === message.id),
      1,
      message
   );

   rooms.entries[roomIdx] = room;

   save(rooms);
}

exports.promoteUser = (roomId, userId, ) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   const room = rooms.entries[idx];

   room.admins.push(userId);

   rooms.entries[idx] = room;
   save(rooms);
};

exports.retrieve = (roomId) => {
   return rooms.entries.find(({ id }) => id === roomId);
};

exports.save = (room) => {
   rooms.entries.push(room);
   save(rooms);
};

exports.userJoin = (roomId, { role, userId }) => {
   const roomIdx = rooms.entries.findIndex(({ id }) => id === roomId);
   const room = rooms.entries[roomIdx];
   if (role === 'admin') room.admins.push(userId);

   room.users.push(userId);
   rooms.entries[roomIdx] = room;

   save(rooms);

   const userIdx = users.entries.findIndex(({ id }) => id === userId);
   users.entries[userIdx].rooms.push(roomId);

   save(users);
};

exports.userLeave = (roomId, userId) => {
   const roomIdx = rooms.entries.findIndex(({ id }) => id === roomId);
   const room = rooms.entries[roomIdx];
   if (room.admins.includes(userId)) room.admins = room.admins.filter(id => id !== userId);

   room.users = room.users.filter(id => id !== userId);
   rooms.entries[roomIdx] = room;


   save(rooms);

   const userIdx = users.entries.findIndex(({ id }) => id === userId);
   const user = users.entries[userIdx];

   user.rooms = user.rooms.filter(id => id !== roomId);
   user.owner = user.owner.filter(id => id !== roomId);

   save(users);
};
