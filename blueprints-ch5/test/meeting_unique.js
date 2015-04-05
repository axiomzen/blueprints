var dbCleanup = require('./utils/db')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../src/app');
var models = app.get('models')
var moment = require('moment')
var timekeeper = require('timekeeper')

describe('Meeting Setup', function() {
  before(dbCleanup)

  after(function() {
    timekeeper.reset()
  })

  var userRes1, userRes2, userRes3

  it("register user 1", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super1 '+seed,
      'email': 'supertest'+seed+'@example.com',
      // setup everyone at the same point for this test so there is no geo concern
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes1 = res.body
        done(err)
      })
  })

  it('should be no meeting for one user', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      var meeting = meetings[0]
      expect(meeting.user1).to.be.an("object")
      expect(meeting.user2).to.be.an("undefined")
      done(err)
    })
  })

  it("register user 2", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super2 '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes2 = res.body
        done(err)
      })
  })

  it('should be a meeting setup with the 2 users', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      var meeting = meetings[0]
      expect(meeting.user1.email).to.equal(userRes1.email)
      expect(meeting.user2.email).to.equal(userRes2.email)
      done(err)
    })
  })

  it('should try matching an already matched user', function(done) {
    request(app)
      .post('/meeting')
      .send({email:userRes1.email})
      .expect(412, done)
  })

  it('should travel time', function() {
    var nextNextDay = moment().add(2,'d')
    timekeeper.travel(nextNextDay.toDate())
    expect(timekeeper.isKeepingTime())
  })

  it('should be able to schedule user 1', function(done) {
    request(app)
      .post('/meeting')
      .send({email:userRes1.email})
      .expect(200, done)
  })

  it('should be able to schedule user 2', function(done) {
    request(app)
      .post('/meeting')
      .send({email:userRes2.email})
      .expect(200, done)
  })

  it('verify user 1 and 2 were not matched', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(3)
      expect(meetings[1].user2).to.equal(undefined)
      expect(meetings[2].user2).to.equal(undefined)
      done(err)
    })
  })

  it("register user 3", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super3 '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, function(err,res){
        userRes3 = res.body
        done(err)
      })
  })

  it('verify user 3 was matched once he was created', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(3)
      expect(meetings[2].user1.email).to.equal(userRes2.email)
      expect(meetings[2].user2.email).to.equal(userRes3.email)
      done(err)
    })
  })

})
