var dbCleanup = require('./utils/db')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../src/app');


describe('Filter', function() {

  var email = 'supertest'+Math.random()+'@example.com'

  it('fail to access a route without sending email', function(done) {
    request(app)
      .get('/me')
      .send({})
      .expect(400,done)
  })

  it("shoots a valid request", function(done){
    var user = {
      'name': 'Super'+Math.random(),
      'email': email,
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

  it('fail to access a route with a non-registered email', function(done) {
    request(app)
      .get('/me')
      .send({email:'yadayada@example.com'})
      .expect(400,done)
  })

  it('succeesfuly loaded the user and got response', function(done) {
    request(app)
      .get('/me')
      .send({email:email})
      .expect(200,done)
  })
})