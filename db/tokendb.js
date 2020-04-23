const { tokens, save } = require('./db');

exports.delete = (token) => {
   tokens.entries = tokens.entries.filter(entry => entry !== token);
   save(tokens);
};

exports.save = (token) => {
   tokens.entries.push(token);
   save(tokens);
};

exports.validate = (token) => {
   return tokens.entries.includes(token);
};