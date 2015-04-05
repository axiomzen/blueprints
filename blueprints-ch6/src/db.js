var db = require('mongoose');
var config = require('./config');

db.connect(config.db['mongo_url'], {
  db: {
    safe: true
  }
}, function(err) {
  if (err) {
    return console.error('Mongoose - connection error:', err);
  }

  console.log('db connected');
});

db.set('debug', true);

module.exports = db;

