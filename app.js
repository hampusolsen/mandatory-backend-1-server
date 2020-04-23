const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(express.json());
app.use(express.static('public'));

app.use(require('./routes/users/index'));

module.exports = app;