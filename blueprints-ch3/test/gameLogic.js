var expect = require('chai').expect;

var connect4 = require('../src/lib/connect4');

describe('Connect 4 Game Logic | ', function() {
  describe('#Create a board ', function() {
    var board = connect4.initializeBoard();

    it('should return game boards of the defaults length when too small', function(done) {
      var board2 = connect4.initializeBoard(3,3),
          board3 = connect4.initializeBoard(5),
          board4 = connect4.initializeBoard(3,10),
          board5 = connect4.initializeBoard(10,3);

      // Make sure the board is a 2D array
      expect(board2).to.be.an('array');
      expect(board2.length).to.equal(board.length);
      expect(board2[0].length).to.equal(board[0].length);
      for(var i = 0; i < board2.length; i++){
        expect(board2[i]).to.be.an('array');
      }

      // Make sure the board is a 2D array
      expect(board3).to.be.an('array');
      expect(board3.length).to.equal(board.length);
      expect(board3[0].length).to.equal(board[0].length);
      for(var i = 0; i < board3.length; i++){
        expect(board3[i]).to.be.an('array');
      }
      // Board initialized with 3 rows, but should default to 6
      expect(board4).to.be.an('array');
      expect(board4.length).to.equal(board.length);
      for(var i = 0; i < board4.length; i++){
        expect(board4[i]).to.be.an('array');
      }
      // Board initialized with 3 columns, but should default to 7
      expect(board5).to.be.an('array');
      expect(board5[0].length).to.equal(board[0].length);
      for(var i = 0; i < board5.length; i++){
        expect(board5[i]).to.be.an('array');
      }

      done();

    });

    it('should only allow pieces to be placed #row amount of times', function(done) {
      board = connect4.initializeBoard();
      for (var i = 0; i < board.length; i++) {
        board = connect4.makeMove(1, 1, board);
      }
      // Column should be full
      expect(connect4.makeMove(1, 1, board)).to.be.an('boolean').and.equal(false);
      // Out of bounds
      expect(connect4.makeMove(1, 0, board)).to.be.an('boolean').and.equal(false);
      expect(connect4.makeMove(1, board[0].length+1, board)).to.be.an('boolean').and.equal(false);

      done();

    });

    it('should return victory if there are 4 in a row', function(done) {
      // Vertical Win
      board = connect4.initializeBoard();
      for (var i = 0; i < 3; i++) {
        board = connect4.makeMove(1, 1, board);
        expect(connect4.checkForVictory(1, 1, board)).to.equal(false);
      }
      board = connect4.makeMove(1, 1, board);
      expect(connect4.checkForVictory(1, 1, board)).to.equal(true);

      // Horizontal Win
      board = connect4.initializeBoard();
      for (var i = 1; i < 4; i++) {
        board = connect4.makeMove(1, i, board);
        expect(connect4.checkForVictory(1, 1, board)).to.equal(false);
      }
      board = connect4.makeMove(1, 4, board);
      expect(connect4.checkForVictory(1, 4, board)).to.equal(true);

      // Diagnol Win
      board = connect4.initializeBoard();
      for (var i = 1; i < 4; i++) {
        for (var j = 1; j <= i; j++){
          if (j===i){
            board = connect4.makeMove(1, i, board);
          } else {
            board = connect4.makeMove(2, i, board);
          }
          expect(connect4.checkForVictory(1, 1, board)).to.equal(false);
        }
      }
      for (var i = 0; i < 3; i++) {
        board = connect4.makeMove(2, 4, board);
        expect(connect4.checkForVictory(2, 4, board)).to.equal(false);
      }
      board = connect4.makeMove(1, 4, board);
      expect(connect4.checkForVictory(1, 4, board)).to.equal(true);

      done();

    });
  });
});
