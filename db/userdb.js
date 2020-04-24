const { users, save } = require('./db');

exports.delete = (user) => {
   const idx = users.entries.findIndex(entry => entry.id === user.id);
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
      return users.entries.find(entry => entry.email === options.email);
   } else {
      return users.entries.find(entry => entry.id === options.id)
   }
};

exports.save = (user) => {
   const exists = users.entries.find(entry => entry.email === user.email);
   if (exists) throw { status: 409, message: 'E-mail already in use.' };

   users.entries.push(user);
   save(users);
};