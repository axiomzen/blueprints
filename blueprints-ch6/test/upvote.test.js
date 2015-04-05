require('co-mocha');
var expect = require('chai').expect,
    request = require('supertest'),
    thunk = require('thunkify'),
    corequest = require('co-supertest');

// For Koa.js, we need to call .callback() to return an object we can
// pass to supertest in the same way we would for Express
var app = require('../src/app').callback(),
    Links = require('../src/models/links'),
    linkIDs = [];

describe('Submit a link', function() {

  before(function(done) {
    Links.remove({}, function(err) {
      done();
    });
  });

  it('should successfully submit a link', function (done) {
    request(app).post('/links')
      .send({title: 'google', URL: 'http://google.com'})
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should successfully submit another link', function (done) {
    request(app).post('/links')
      .send({title: 'Axiom Zen', URL: 'http://axiomzen.co'})
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should successfully submit a third link', function (done) {
    request(app).post('/links')
      .send({title: 'Hacker News', URL: 'http://news.ycombinator.com'})
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should list all links', function (done) {
    request(app).get('/links')
      .expect(200)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        var body = res.body;
        expect(body).to.have.length(3);

        // Store Link ids for next test
        for(var i = 0; i < body.length; i++) {
          linkIDs.push(body[i]._id);
        }
        done();
      });
  });

  it('should upvote all links in parallel', function *() {
    var res = yield linkIDs.map(function(id) {
      return corequest(app).put('/links/' + id + '/upvote')
        .set('Accept', 'application/json')
        .end();
    });

    // Assert that all Links have been upvoted
    for(var i = 0; i < res.length; i++) {
      expect(res[i].body.upvotes).to.equal(1);
    }

  });
});
