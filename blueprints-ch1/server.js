
var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');
var passport = require('./passport');
var config = require('./config')();

mongoose.connect(config.db_url, function(err) {
  if (err) throw err;
});

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(require('cookie-parser')('my dirty little secret'));
app.use(session({
  secret: "hello world",
  store: new MongoStore({
    url: config.sessionDb
  })
}));
app.use(require('body-parser')());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.exposeUser());

app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');

app.listen(process.env.PORT || 3000, function() {
  console.log('Express listening on port 3000');
});

module.exports.app = app;
var routes = require('./routes');

