const { users, save } = require('./db');

exports.save = (user) => {
   users.data.push(user);
   save(users);
};

exports.retrieve = (email) => {
   return users.data.find(entry => entry.email === email);
}