var dbCleanup = require('./utils/db')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../src/app');
var models = app.get('models')
var mailer = app.get('mailer')
var moment = require('moment')
var timekeeper = require('timekeeper')
var tasks = require('../src/tasks')(models,mailer)

describe('Mailing Task', function() {
  before(dbCleanup)

  after(function() {
    timekeeper.reset()
  })

  it("register user 1", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, done)
  })

  it("register user 2", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, done)
  })

  it("register user 3", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, done)
  })

  it("register user 4", function(done){
    var seed = Math.random()
    var user = {
      'name': 'Super '+seed,
      'email': 'supertest'+seed+'@example.com',
      'location': [50.0,50.0]
    }

    request(app)
      .post('/user')
      .send(user)
      .expect(200, done)
  })

  it('should travel time after the meeting is done', function() {
    var nextNextDay = moment().add(2,'d')
    timekeeper.travel(nextNextDay.toDate())
    expect(timekeeper.isKeepingTime())
  })

  it('task should send email', function(done) {
    this.timeout(3500)
    tasks.followupMail()
    setTimeout(done, 3000)
  })

  it('verify emails were sent', function(done) {
    models.Meeting.all(function(err,meetings) {
      expect(meetings).to.have.length(2)
      expect(meetings[0].mailed).to.be.a("date")
      expect(meetings[1].mailed).to.be.a("date")
      done(err)
    })
  })
})
