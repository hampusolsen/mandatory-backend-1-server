const { tokens, save } = require('./db');

exports.delete = (token) => {
   tokens.data = tokens.data.filter(entry => entry !== token);
   save(tokens);
};

exports.save = (token) => {
   tokens.data.push(token);
   save(tokens);
};

exports.validate = (token) => {
   return tokens.data.includes(token);
};