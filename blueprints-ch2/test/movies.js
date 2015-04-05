var should  = require('should');
var assert  = require('assert');
var request = require('supertest');

var app     = require('../src/lib/app');
var Movie   = require('../src/models/movie');


describe('Movies', function() {

  // cleanup the collection once to have consistent test results
  before(function(done) {
    Movie.remove({}, function(err,result) {
      done(err);
    });
  });


  describe('POST movie', function(){
    it('should create a movie', function(done){
      var movie = {
        'id': '1',
        'title': 'Hello World',
        'year': 2013,
      };

      request(app)
      .post('/movies')
      .send(movie)
      .expect(201, done);
    });

    it('should not allow you to create duplicate movies', function(done) {
      var movie = {
        'id': '1',
        'title': 'Hello World',
        'year': 2013,
      };

      request(app)
      .post('/movies')
      .send(movie)
      .expect(400, done);
    });

    it('should allow to create a movie without ID', function(done) {
      var movie = {
        'title': 'Hello World2',
        'year': 2013,
      };

      request(app)
      .post('/movies')
      .send(movie)
      .expect(201, function(err,res) {
        res.body.id.should.eql(2)
        done(err);
      });
    });
  });


  describe('GET movie', function() {
    it('should retrieve movie from db', function(done){
      request(app)
      .get('/movies/1')
      .expect(200, done);
    });

    it('should respond not found when no movie exists', function(done){
      request(app)
      .get('/movies/392132')
      .expect(404, done);
    });
  });


  describe('PUT movie', function() {
    it('should edit a movie', function(done) {
      var edit = {
        'year': 2012
      };

      request(app)
      .put('/movies/1')
      .send(edit)
      .expect(200)
      .end(function(err, res) {
        res.body.year.should.eql(2012);
        done();
      });
    });
  });


  describe('POST /movies/:id/actors', function() {
    it('should successfully add an actor to movie', function(done){
      var actor = {
        'id': '2',
        'name': 'AxiomZen',
        'birth_year': '2012',
      };

      request(app)
      .post('/actors')
      .send(actor)
      .expect(201)
      .end(function(err, res) {
        request(app)
        .post('/movies/1/actors')
        .send(actor)
        .expect(201, done);
      })
    });

    it('movie should have array of actors now', function(done){
      request(app)
      .get('/movies/1')
      .expect(200)
      .end(function(err, res) {
        res.body.actors.length.should.eql(1);
        res.body.actors[0].id.should.eql(2);
        done();
      });
    });
  });


  describe('DELETE /movies/:id/actors/:actor_id', function() {
    it('should successfully remove an actor from movie', function(done) {
      request(app)
        .delete('/movies/1/actors/2')
        .expect(204, done);
    });

    it('movie should no longer have that actor id', function(done) {
      request(app)
      .get('/movies/1')
      .expect(200)
      .end(function(err, res) {
        res.body.actors.length.should.eql(0);
        done();
      });
    });
  });


  describe('DELETE movie', function() {
    it('should remove a movie', function(done) {
      request(app)
      .delete('/movies/1')
      .expect(204, done);
    });
  });
});
