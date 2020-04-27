const tokens = {};

exports.delete = (token) => {
   for (userId in tokens) {
      if (tokens[userId] === token) delete tokens[userId];
   }
};

exports.save = (token, userId) => {
   tokens[userId] = token;
};

exports.validate = (token, userId) => {
   return tokens[userId] === token;
};