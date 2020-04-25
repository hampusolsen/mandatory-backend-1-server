const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', require('./routes/users/index'));
app.use('/rooms', require('./routes/rooms/index'));

module.exports = app;