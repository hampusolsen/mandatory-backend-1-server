const { users, save } = require('./db');

exports.save = (user) => {
   const exists = users.entries.find(entry => entry.email === user.email);
   if (exists) throw { status: 409, message: 'E-mail already in use.' };

   users.entries.push(user);
   save(users);
};

exports.retrieve = (email) => {
   return users.data.find(entry => entry.email === email);
}