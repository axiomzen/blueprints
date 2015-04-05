var mongoose = require('mongoose');
var redis = require('redis');
var url = require('url');

exports.connectMongoDB = function() {
  mongoose.connect('mongodb://localhost/games', {
    mongoose: {
      safe: true
    }
  }, function(err) {
    if (err) {
      return console.log('Mongoose - connection error:', err);
    }
  });

  return mongoose;
};


exports.connectRedis = function() {
  var urlRedisToGo = process.env.REDISTOGO_URL;
  var client = {};

  if (urlRedisToGo) {
    console.log('using redistogo');
    rtg = url.parse(urlRedisToGo);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]);
  } else {
    console.log('using local redis');
    // This would use the default redis config: { port 6347, host: 'localhost' }
    client = redis.createClient();
  }

  return client;
};
