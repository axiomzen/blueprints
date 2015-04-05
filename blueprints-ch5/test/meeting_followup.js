var dbCleanup = require('./utils/db')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../src/app');
var models = app.get('models')
var mailer = app.get('mailer')
var moment = require('moment')
var timekeeper = require('timekeeper')

describe('Meeting Followup', function() {
  before(dbCleanup)

  after(function() {
    timekeeper.reset()
  })

  var userRes1, userRes2

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

  it('should test that non-existent meetings cant be reviewed', function(done) {
    var someId = "5428dab6c3f06aaaaad3acaa"
    request(app)
      .get('/followUp/'+someId+"/"+userRes1._id+"/meh")
      .expect(404, done)
  })

  it('should 412 because it still didnt happen', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      request(app)
        .get('/followUp/'+meetings[0]._id+"/"+userRes1._id+"/meh")
        .expect(412, done)
    })
  })

  it('should travel time after the meeting is done', function() {
    var nextNextDay = moment().add(2,'d')
    timekeeper.travel(nextNextDay.toDate())
    expect(timekeeper.isKeepingTime())
  })

  it('should send email', function(done) {
    this.timeout(3500)
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      mailer.followUp(meetings[0])
      setTimeout(done, 3000)
    })
  })

  it('shoundt take a review that makes no sense', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      request(app)
        .get('/followUp/'+meetings[0]._id+"/"+userRes1._id+"/nooooooo")
        .expect(400, done)
    })
  })

  it('user 1 should be able to review', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      request(app)
        .get('/followUp/'+meetings[0]._id+"/"+userRes2._id+"/awesome")
        .expect(200, function(err,res) {
          expect(res.text).to.match(/rated.*was.awesome.*Thanks/)
          done(err)
        })
    })
  })

  it('user 2 should be able to review', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(1)
      request(app)
        .get('/followUp/'+meetings[0]._id+"/"+userRes1._id+"/awful")
        .expect(200, function(err,res) {
          expect(res.text).to.match(/rated.*was.awful.*Thanks/)
          done(err)
        })
    })
  })
})
