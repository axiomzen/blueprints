var Promise = require('bluebird');

var helper = require('../utils/helper');
var Dictionary = require('../models/dictionary');
var User = require('../models/user');
var Stat = require('../models/stat');

var Game = {
  state: function() {
    return Promise.props({
      users: User.findAllUsers(),
      stat:  Stat.findOne({}).exec()
    });
  },

  join: function(user) {
    return User.join(user)
      .then(User.findAllUsers);
  },

  leave: function(user) {
    return User.leave(user)
      .then(User.findAllUsers);
  },

  chain: function(user, word) {
    if (!Dictionary.isWord(word)) {
      return Promise.reject(helper.build400Error('invalid word'));
    }

    return Stat.chain(word, user);
  },

  reset: function() {
    return Stat.newGame();
  }

};


module.exports = Game;
