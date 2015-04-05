var should = require('should');

describe('The World', function() {
  it('should say hello', function() {
    'Hello, World'.should.equal('Hello, World');
  });
  it('should say hello asynchronously!', function(done) {
    setTimeout(function() {
      'Hello, World'.should.equal('Hello, World');
      done();
    }, 300);
  });
});
