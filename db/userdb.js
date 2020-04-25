const { users, save } = require('./db');

exports.delete = (userId) => {
   console.log(users.entries[0].id, userId);
   const idx = users.entries.findIndex(({ id }) => id === userId);
   if (idx < 0) throw { status: 400, message: 'Invalid user id.' };

   users.entries.splice(idx, 1);

   save(users);
};

exports.patch = (user) => {
   const idx = users.entries.findIndex(entry => entry.email === user.email);
   users.entries[idx] = user;

   save(users);
};

exports.retrieve = (options) => {
   if (options.email) {
      return users.entries.find(({ email }) => email === options.email);
   } else if (options.id) {
      return users.entries.find(({ id }) => id === options.id);
   };
};

exports.save = (user) => {
   const exists = users.entries.find(({ email }) => email === user.email);
   if (exists) throw { status: 409, message: 'E-mail already in use.' };

   users.entries.push(user);
   save(users);
};