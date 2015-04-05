var expect = require('chai').expect,
    request = require('supertest'),
    redis = require('redis'),
    client = redis.createClient();

var app = require('../src/lib/app');

describe('Create and join new game | ', function() {
  before(function(done){
    client.flushall(function(err, res){
      if (err) return done(err);
      done();
    });
  });

  it('should not be able to join a game without a name', function(done) {
    request(app).post('/join')
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).to.equal("Must provide name field!");
        done();
      });
  });

  it('should not be able to join a game if none exists', function(done) {
    request(app).post('/join')
      .send({name: 'koa'})
      .expect(418)
      .end(function(err, res) {
        expect(res.body.error).to.equal("No games to join!");
        done();
      });
  });

  it('should create a game and add it to the queue', function(done) {
    request(app).post('/create')
      .send({name: 'express'})
      .expect(200)
      .end(function(err, res) {
        done();
      });
  });

  it('should join the game on the queue', function(done) {
    request(app).post('/join')
      .send({name: 'koa'})
      .expect(200)
      .end(function(err, res) {
        var b = res.body;
        expect(b.boardId).to.be.a('string');
        expect(b.p1Key).to.be.undefined;
        expect(b.p1Name).to.be.a('string').and.equal('express');
        expect(b.p2Key).to.be.a('string');
        expect(b.p2Name).to.be.a('string').and.equal('koa');
        expect(b.turn).to.be.a('number').and.equal(1);
        expect(b.rows).to.be.a('number');
        expect(b.columns).to.be.a('number');
        done();
      });
  });
});
