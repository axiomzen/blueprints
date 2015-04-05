var express = require('express'),
    app = express(),
    config = require('../../config'),
    db = require('./db');

app.set('config', config);
db.connectMongoDB();
require('./parser')(app);
require('../routes/games')(app);

module.exports = app;
