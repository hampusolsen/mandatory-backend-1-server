require('dotenv').config();
const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

exports.io = io.on('connection', require('./socket'));

const PORT = process.env.PORT || 6969;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));