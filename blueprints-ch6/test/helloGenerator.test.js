// Testing generator function
require('co-mocha');
var expect = require('chai').expect;
var helloGenerator = require('../src/helloGenerator');

describe('Hello Generator', function() {
  it('should yield to the function and return hello', function *() {
    var ans = yield helloGenerator();
    expect(ans).to.equal('hello generator');
  });
});
