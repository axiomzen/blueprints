var dbCleanup = require('./utils/db')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../src/app');
var models = app.get('models')

describe('Meeting Setup', function() {
  before(dbCleanup)

  // Santiago
  var userRes1, userRes2

  // Vancouver
  var userRes3

  // Valparaiso
  var userRes4, userRes5

  it('create user 1 in Santiago', function(done) {
    var seed = Math.random()
    var user = {
      'name': 'Santiago '+seed,
      'email': 'supertest'+seed+'@example.com',
      // longitude, latitude
      'location': [-70.641997,-33.46912]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes1 = res.body
        done(err)
      })
  })

  it('create user 4 in Valparaiso', function(done) {
    var seed = Math.random()
    var user = {
      'name': 'Valparaiso '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [-71.642972,-33.021473]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes4 = res.body
        done(err)
      })
  })

  it('check there is no match', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(2)
      done(err)
    })
  })

  it('create user 2 in Santiago', function(done) {
    var seed = Math.random()
    var user = {
      'name': 'Santiago '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [-70.642304,-33.439598]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes2 = res.body
        done(err)
      })
  })

  it('check there was a match between 1 & 2', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(2)
      var meeting = meetings[0]
      expect(meeting.user1.email).to.equal(userRes1.email)
      expect(meeting.user2.email).to.equal(userRes2.email)
      done(err)
    })
  })

  it('create user 3 in Vancouver', function(done) {
    var seed = Math.random()
    var user = {
      'name': 'Vancouver '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [-123.113927,49.261226]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes3 = res.body
        done(err)
      })
  })

  it('check 3 have no match', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(3)
      done(err)
    })
  })

  it('create user 5 in Valparaiso', function(done) {
    var seed = Math.random()
    var user = {
      'name': 'Vancouver '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [-71.62424,-33.048446]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes5 = res.body
        done(err)
      })
  })

  it('check there was a match between 4 & 5', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(3)
      var meeting = meetings[1]
      expect(meeting.user1.email).to.equal(userRes4.email)
      expect(meeting.user2.email).to.equal(userRes5.email)
      done(err)
    })
  })
})
