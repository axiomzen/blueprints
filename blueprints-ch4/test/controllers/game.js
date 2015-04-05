var chai = require('chai'),
    expect = chai.expect;
var Promise = require('bluebird');

var config = require('../config.test.js');

var User = require('../../app/models/user');
var Stat = require('../../app/models/stat');
var Game = require('../../app/controllers/game');

before(function() {
  return Promise.all([
    User.remove().exec(),
    Stat.newGame()
  ]);
});

describe('Game', function() {
  describe('when game starts', function() {
    it('should have no user', function() {
      return Game.state()
        .then(function(state) {
          expect(state.users.length).to.equal(0);
          expect(state.stat.word).to.equal('what');
          expect(state.stat.used.length).to.equal(1);
          expect(state.stat.used[0].word).to.equal('what');
        });
    });
  });

  describe('when leo joins', function() {
    it('should return leo', function() {
      return Game.join('leo')
        .then(function(users) {
          expect(users.join(',')).to.equal('leo');
        });
    });
  });

  describe('when another leo joins', function() {
    it('should be rejected', function() {
      return Game.join('leo')
        .then(function() {
          throw new Error('should return Error');
        })
        .catch(function(err) {
          expect(err.code).to.equal(11000);
          return true;
        });
    });
  });

  describe('when geoffrey joins', function() {
    it('should return leo,geoffrey', function() {
      return Game.join('geoffrey')
        .then(function(users) {
          expect(users.join(',')).to.equal('leo,geoffrey');
        });
    });
  });

  describe('when leo leaves', function() {
    it('should return geoffrey', function() {
      return Game.leave('leo')
        .then(function(users) {
          expect(users.join(',')).to.equal('geoffrey');
        });
    });
  });

  describe('when marc joins', function() {
    it('should return marc', function() {
      return Game.join('marc')
        .then(function(users) {
          expect(users.join(',')).to.equal('geoffrey,marc');
        });
    });
  });

  describe('when send invalid word,', function() {
    it('should be ignored', function() {
      return Game.chain('geoffrey', 'asdf')
        .then(function() {
          throw new Error('should return Error');
        })
        .catch(function(err) {
          expect(err.status).to.equal(400);
          return true;
        });
    });
  });

  describe('when send word can\'t chain the current word', function() {
    it('should be ignored', function() {
      return Game.chain('marc', 'good')
        .then(function() {
          throw new Error('should return Error');
        })
        .catch(function(err) {
          expect(err.status).to.equal(400);
          return true;
        });
    });
  });

  describe('when send valid word', function() {
    it('should be accepted', function() {
      return Game.chain('marc', 'tomorrow')
        .then(function(state) {
          expect(state.used.length).equal(2);
          expect(state.used[1].word).equal('tomorrow');
          expect(state.used[1].user).equal('marc');

          expect(state.word).to.equal('tomorrow');
        });
    });
  });

  describe('when send repeated word', function() {
    it('should be ignored', function() {
      return Game.chain('marc', 'what')
        .then(function() {
          throw new Error('should return Error');
        })
        .catch(function(err) {
          expect(err.status).to.equal(400);
          return true;
        });
    });
  });


  describe('when player1 and player2 send valid word together', function() {
    it('should accpet player1\'s word, and reject player2\'s word', function(done) {
      Game.chain('geoffrey', 'watch')
        .then(function(state) {
          expect(state.used.length).to.equal(3);
          expect(state.used[2].word).to.equal('watch');
          expect(state.used[2].user).to.equal('geoffrey');

          expect(state.word).to.equal('watch');
        });

      Game.chain('marc', 'watch')
        .then(function(state) {
          done(new Error('should return Error'));
        })
        .catch(function(err) {
          expect(err.status).to.equal(400);
          done();
        });

    });
  });

  describe('when player1 and player2 send different valid word together', function() {
    it('should accpet player1\'s word, and reject player2\'s word', function(done) {
      Game.chain('geoffrey', 'hello')
        .then(function(state) {
          expect(state.used.length).to.equal(4);
          expect(state.used[3].word).to.equal('hello');
          expect(state.used[3].user).to.equal('geoffrey');

          expect(state.word).to.equal('hello');
        });

      Game.chain('marc', 'helium')
        .then(function(state) {
          done(new Error('should return Error'));
        })
        .catch(function(err) {
          expect(err.status).to.equal(400);
          done();
        });

    });
  });
});
