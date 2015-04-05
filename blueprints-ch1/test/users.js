var should = require('should'),
    request = require('supertest'),
    app = require('../server').app,
    User = require('mongoose').model('User');

describe('Users', function() {
  before(function(done) {
    User.remove({}, done);
  });
  describe('registration', function() {
    it('should register valid user', function(done) {
      request(app)
        .post('/users/register')
        .send({
          email: "test@example.com",
          password: "hello world"
        })
        .expect(302)
        .end(function(err, res) {
          res.text.should.containEql("Redirecting to /");
          done(err);
        });
    });
    it('should display a register form', function(done) {
      request(app)
        .get('/users/register')
        .expect(200)
        .end(function(err, res) {
          res.text.should.containEql("Email")
          res.text.should.containEql("input type=\"text\"")
          res.text.should.containEql("Password")
          res.text.should.containEql("input type=\"password\"")
          res.text.should.containEql("input type=\"submit\"")
          done(err);
        });
    });
  });
  describe('login', function() {
    it('should login with the registered user', function(done) {
      request(app)
        .post('/users/login')
        .send({
          email: "test@example.com",
          password: "hello world"
        })
        .expect(302)
        .end(function(err, res) {
          res.text.should.containEql("Redirecting to /");
          done(err);
        });
    });
    it('should fail to login with bad user', function(done) {
      request(app)
        .post('/users/login')
        .send({
          email: "test@example.com",
          password: "hello_world"
        })
        .expect(302)
        .end(function(err, res) {
          res.text.should.containEql("Redirecting to /");
          done(err);
        });
    });
  });
});

