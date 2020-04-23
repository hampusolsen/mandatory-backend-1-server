require('dotenv').config();
const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT;

io.on('connection', (socket) => {
   socket.send('sup bro!');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));