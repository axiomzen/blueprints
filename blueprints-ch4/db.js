/*
 * DB Setup
 *
 */
var mongoose = require('mongoose');

console.log('connecting db...');

mongoose.connect('mongodb://localhost/blueprints-ch4', {
  db: {
    safe: true
  }
}, function(err) {
  if (err) {
    return console.error('Mongoose - connection error:', err);
  }

  console.log('db connected');
});

module.exports = mongoose;
