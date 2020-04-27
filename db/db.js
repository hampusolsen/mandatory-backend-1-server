const fs = require('fs');

exports.rooms = {
   entries: require('./store/roomdb.json').entries,
   path: './db/store/roomdb.json',
};

exports.users = {
   entries: require('./store/userdb.json').entries,
   path: './db/store/userdb.json',
};

exports.save = ({ path, entries }) => {
   fs.writeFile(path, JSON.stringify({ entries }), (error) => {
      if (error) throw { status: 500, message: 'Error writing to database.' };
   });
};