var koa = require('koa'),
    app = koa(),
    bodyParser = require('koa-body-parser'),
    router = require('koa-router'),
    errorHandler = require('./errors'),
    views = require('koa-views'),
    serve = require('koa-static'),
    mount = require('koa-mount');


// Connect to DB
require('./db');

app.use(mount('/public', serve('./public') ));

app.use(views('./views', {default: 'jade'}));

app.use(errorHandler);
app.use(bodyParser());
app.use(router(app));

require('./routes/links')(app);

module.exports = app;
