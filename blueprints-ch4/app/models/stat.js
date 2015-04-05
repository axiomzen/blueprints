var mongoose = require('mongoose');
var Promise = require('bluebird');
var Helper = require('../utils/helper');

var schema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  used: {
    type: Array
  },
});

schema.statics.newGame = function() {
  return Promise.resolve(Stat.remove().exec())
  .then(function() {
    return Stat.create({
      word: 'what',
      used: [{
        word: 'what',
        user: 'admin'
      }]
    });
  });
};

schema.statics.chain = function(word, user) {
  var first = word.substr(0, 1);

  var fetching = Stat.findOne({}).exec();

  return Promise.resolve(fetching)
  .then(function(stat) {
    var currentWord = stat.word;

    if (currentWord.substr(-1).toLowerCase() !== first.toLowerCase()) {
      throw Helper.build400Error('not match');
    }

    return currentWord;
  })
  .then(function(currentWord) {
    return Stat.findOneAndUpdate({
      word: currentWord,
      'used.word': { $ne: word }
    }, {
      word: word,
      $push: {
        used: { 'word': word, 'user': user }
      }
    }, {
      upsert: false
    })
    .exec();
  })
  .then(function(result) {
    if (!result) {
      throw Helper.build400Error('not found');
    }

    return result;
  });
};


var Stat = mongoose.model('stat', schema);
module.exports = Stat;
