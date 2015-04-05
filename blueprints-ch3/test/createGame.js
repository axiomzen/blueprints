var expect = require('chai').expect,
    request = require('supertest');

var app = require('../src/lib/app'),
    MIN_COLUMNS = app.get('config').MIN_COLUMNS,
    MIN_ROWS = app.get('config').MIN_ROWS;

describe('Create new game | ', function() {
  var boardId;

  it('should return a game object with key for player 1', function(done) {
    request(app).post('/create')
      .send({name: 'express'})
      .expect(200)
      .end(function(err, res) {
        var b = res.body;
        expect(b.boardId).to.be.a('string');
        expect(b.p1Key).to.be.a('string');
        expect(b.p2Key).to.be.undefined;
        expect(b.p1Name).to.be.a('string').and.equal('express');
        expect(b.turn).to.be.a('number').and.equal(1);
        expect(b.rows).to.be.a('number');
        expect(b.columns).to.be.a('number');

        // Make sure the board is a 2D array
        expect(b.board).to.be.an('array');
        for(var i = 0; i < b.board.length; i++){
          expect(b.board[i]).to.be.an('array');
        }

        // Store the boardId for reference
        boardId = b.boardId;
        done();
      });
  });

  it('should be able to fetch the board', function(done) {
    request(app).get("/board/" + boardId)
      .expect(200)
      .end(function(err, res) {
        var b = res.body;
        expect(b.p1Key).to.be.undefined;
        expect(b.p2Key).to.be.undefined;
        expect(b.boardId).to.be.a('string').and.equal(boardId);
        expect(b.turn).to.be.a('number').and.equal(1);
        expect(b.rows).to.be.a('number');
        expect(b.columns).to.be.a('number');
        expect(b.board).to.be.an('array');
        done();
      });
  });

  it('should allow you to customize the size of the board', function(done) {
    request(app).post('/create')
      .send({
        name: 'express',
        columns: 8,
        rows: 16
      })
      .expect(200)
      .end(function(err, res) {
        var b = res.body;
        expect(b.columns).to.equal(8);
        expect(b.rows).to.equal(16);
        expect(b.board).to.have.length(16);
        expect(b.board[0]).to.have.length(8);
        done();
      });
  });

  it('should not accept sizes < ' + MIN_COLUMNS + ' for columns', function(done) {
    request(app).post('/create')
      .send({
        name: 'express',
        columns: 5,
        rows: 16
      })
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).to.equal('Number of columns has to be >= ' + MIN_COLUMNS);
        done();
      });
  });

  it('should not accept sizes < ' + MIN_ROWS + ' rows', function(done) {
    request(app).post('/create')
      .send({
        name: 'express',
        columns: 8,
        rows: -6
      })
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).to.equal('Number of rows has to be >= ' + MIN_ROWS);
        done();
      });
  });

});
