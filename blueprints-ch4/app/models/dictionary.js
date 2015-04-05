var fs = require('fs');
var dictionary = JSON.parse(fs.readFileSync(__dirname + '/../../test/fixtures/dictionary.json'));

var Dictionary = {
  isWord: function(word) {
    return !!dictionary[word];
  }
};

module.exports = Dictionary;
