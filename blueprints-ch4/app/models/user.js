var mongoose = require('mongoose');
var Promise = require('bluebird');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});

schema.statics.join = function(name) {
  var creating = User.create({
    name: name
  });

  return Promise.resolve(creating);
};

schema.statics.leave = function(name) {
  return this.findOneAndRemove({
    name: name
  }).exec();
};

schema.statics.findAllUsers = function() {
  var fetching = User.find().exec();

  return Promise
    .resolve(fetching)
    .map(function(user) {
      return user.name;
    });
};

var User = mongoose.model('user', schema);
module.exports = User;
