var dbCleanup = require('./utils/db')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../src/app');


describe('Registration', function() {
  before(dbCleanup)

  it("shoots a valid request", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super'+seed,
      'email': 'supertest'+seed+'@example.com',
    };

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        var userRes = res.body
        expect(userRes._id).to.be.a("string")
        expect(userRes.name).to.equal(user.name)
        expect(userRes.email).to.equal(user.email)
        done(err)
      });
  })
})