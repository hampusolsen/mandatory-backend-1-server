const express = require('express');
const app = express();

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
})

app.use(require('cookie-parser')());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', require('./routes/users/index'));
app.use('/rooms', require('./routes/rooms/index'));

module.exports = app;