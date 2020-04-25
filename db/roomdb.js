const { rooms, save } = require('./db');

exports.append = (roomId, { role, userId }) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   const room = rooms.entries[idx];
   if (role === 'admin') room.admins.push(userId);

   room.users.push(userId);

   rooms.entries[idx] = room;
   save(rooms);
};

exports.delete = (roomId) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   rooms.entries.splice(idx, 1);

   save(rooms);
};

exports.leave = (roomId, userId) => {
   const idx = rooms.entries.findIndex(({ id }) => id === roomId);
   const room = rooms.entries[idx];
   if (room.admins.includes(userId)) {
      room.admins = room.admins.filter(id => id !== userId);
   };

   room.users = room.users.filter(id => id !== userId);

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
