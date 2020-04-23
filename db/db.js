const fs = require('fs');

exports.rooms = {
   data: require('./store/roomdb.json'),
   path: './db/store/roomdb.json',
};

exports.users = {
   data: require('./store/userdb.json'),
   path: './db/store/userdb.json',
};

exports.tokens = {
   data: require('./store/tokendb.json'),
   path: './db/store/tokendb.json',
};

exports.save = (db) => {
   fs.writeFile(db.path, db.data, (error) => {
      if (error) throw {
         error: {
            status: 500,
            message: 'Error writing to database .json-file.',
         }
      };
   });
};