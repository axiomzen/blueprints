var dbCleanup = require('./utils/db')
var app = require('../src/app');
var mailer = app.get('mailer')

describe('Meeting Setup', function() {

  it('just send one.', function(done) {
    this.timeout(10*1000)
    mailer.send(
      "fabianosoriani@gmail.com",
      "Test "+(new Date()).toLocaleString(),
      "BOdy "+Math.random()+"<br>"+Math.random()
    , done)
  })
})
