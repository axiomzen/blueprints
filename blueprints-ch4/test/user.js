var User = require('../app/models/user.js');
var db = require('../db');

var onJoinSuccess = function(user) {
  console.log('user', user.name, 'joined game!');
  return user;
};

var onJoinFail = function(err) {
  console.error('user fails to join, err', err);
};

console.log('Before leo send req to join game');

User.join('leo')
.then(onJoinSuccess)
.catch(onJoinFail);

console.log('After leo send req to join game');
