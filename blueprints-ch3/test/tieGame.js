var expect = require('chai').expect,
    request = require('supertest'),
    redis = require('redis'),
    client = redis.createClient(),
    async = require('async');

var app = require('../src/lib/app'),
    p1Key, p2Key, boardId, rows, columns;

describe('Simulate a tie game | ', function() {
  before(function(done){
    client.flushall(function(err, res){
      if (err) return done(err);
      done();
    });
  });

  it('create a game', function(done) {
    request(app).post('/create')
      .send({name: 'express'})
      .expect(200)
      .end(function(err, res) {
        var b = res.body;
        p1Key = b.p1Key;
        boardId = b.boardId;
        rows = b.rows;
        columns = b.columns;
        done();
      });
  });

  it('join a game', function(done) {
    request(app).post('/join')
      .send({name: 'koa'})
      .expect(200)
      .end(function(err, res) {
        p2Key = res.body.p2Key;
        done();
      });
  });

  it('Fill the board! Tie the game!', function(done) {
    var moves = [],
        turn = 1,
        nextMove = 1;

    for(var r = 0; r < rows; r++) {
      for(var c = 1; c <= columns; c++) {
        moves.push(makeMoveThunk(turn, nextMove));
        turn = turn === 1 ? 2 : 1;
        nextMove = ((nextMove + 2) % columns) + 1;
      }
    }

    async.series(moves, function(err, res) {
      var lastResponse = res[rows*columns-1].body;
      console.log(lastResponse);
      expect(lastResponse.winner).to.equal('Game ended in a tie!');
      expect(lastResponse.status).to.equal('Game Over.');
      done();
    });
  });
});


function makeMoveThunk(player, column) {
  return function(done) {
    var token = player === 1 ? p1Key : p2Key;
    request(app).put('/board/' + boardId)
      .set('X-Player-Token', token)
      .send({column: column})
      .end(done);
  };
}
