module.exports = function(dbUrl) {
  var mongojs = require('mongojs');
  var db = mongojs(dbUrl);
  var models = {
    User: require('./user')(db),
    Meeting: require('./meeting')(db)
  };
  return models
};