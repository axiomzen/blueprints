// Generator function example
var sleep = require('co-sleep');

module.exports = function *() {
  yield sleep(1000);
  return 'hello generator';
}
