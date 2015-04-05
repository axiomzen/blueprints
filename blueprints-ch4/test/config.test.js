var mongoose = require('mongoose');
// https://github.com/LearnBoost/mongoose/issues/1251#issuecomment-41844298
//mongoose.models = {};
//mongoose.modelSchema = {};

console.log('connecting db...');

mongoose.connect('mongodb://localhost/blueprints-ch4_test', {
  db: {
    safe: true
  }
}, function(err) {
  if (err) {
    return console.error('Mongoose - connection error:', err);
  }

  console.log('db connected');
});

mongoose.set('debug', true);

module.exports = mongoose;
