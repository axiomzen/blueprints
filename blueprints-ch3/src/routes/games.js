var Utils = require('../lib/utils');
var connect4 = require('../lib/connect4');
var Game = require('../models/game');
var db = require('../lib/db');
var client = db.connectRedis();

module.exports = function(app) {
  // Initialize Validation middleware with app to use config.js
  var Validate = require('../lib/validators')(app);
  var _return400Error = Utils.return400Error;

  app.post('/create', [Validate.name, Validate.columns, Validate.rows], function(req, res) {

    var newGame = {
      p1Key: Utils.randomValueHex(25),
      p2Key: Utils.randomValueHex(25),
      boardId: Utils.randomValueHex(6),
      p1Name: req.body.name,
      board: connect4.initializeBoard(req.body.rows, req.body.columns),
      rows: req.body.rows || app.get('config').MIN_ROWS,
      columns: req.body.columns || app.get('config').MIN_COLUMNS,
      turn: 1,
      status: 'Game in progress'
    };

    Game.create(newGame, function(err, game) {
      if (err) return res.status(400).json(err);

      client.lpush('games', game.boardId);
      game.p2Key = undefined;
      return res.status(201).json(game);
    });
  });

  app.post('/join', Validate.name, function(req, res) {
    client.rpop('games', function(err, boardId) {
      if (err) return res.status(418).json(err);

      if (!boardId) {
        return _return400Error(res, 'No games to join!');
      }

      Game.findOne({ boardId: boardId }, function (err, game){
        if (err) return res.status(400).json(err);

        game.p2Name = req.body.name;
        game.save(function(err, game) {
          if (err) return res.status(500).json(err);
          game.p1Key = undefined;
          res.status(200).json(game);
        });
      });
    });
  });

  app.get('/board/:id', function(req, res) {
    Game.findOne({boardId: req.params.id}, function(err, game) {
      if (err) return res.status(400).json(err);

      res.status(200).json(_sanitizeReturn(game));
    });
  });

  app.put('/board/:id', [Validate.move, Validate.token], function(req, res) {

    Game.findOne({boardId: req.params.id }, function(err, game) {
      if (!game) {
        return _return400Error(res, 'Cannot find board!');
      }

      if(game.status !== 'Game in progress') {
        return _return400Error(res, 'Game Over. Cannot move anymore!');
      }

      if(req.headers['x-player-token'] !== game.p1Key && req.headers['x-player-token'] !== game.p2Key) {
        return _return400Error(res, 'Wrong X-Player-Token!');
      }

      var currentPlayer = (game.turn % 2) === 0 ? 2 : 1;
      var currentPlayerKey = game['p' + currentPlayer + 'Key'];
      if(currentPlayerKey !== req.headers['x-player-token']){
        return _return400Error(res, 'It is not your turn!');
      }

      // Make a move, which returns a new board; returns false if the move is invalid
      var newBoard = connect4.makeMove(currentPlayer, req.body.column, game.board);
      if(newBoard){
        game.board = newBoard;
        game.markModified('board');
      } else {
        return _return400Error(res, 'Bad move.');
      }

      // Check if you just won
      var win = connect4.checkForVictory(currentPlayer, req.body.column, newBoard);
      if(win) {
        game.winner = game['p'+ currentPlayer + 'Name'];
        game.status = 'Game Over.';
      } else if(game.turn >= game.columns*game.rows) {
        game.winner = 'Game ended in a tie!';
        game.status = 'Game Over.';
      }

      // Increment turns
      game.turn++;

      game.save(function(err, game){
        if (err) return res.status(500).json(err);
        return res.status(200).json(_sanitizeReturn(game));
      });
    });
  });
}

// Given a game object, return the game object without tokens
function _sanitizeReturn(game) {
  return {
    boardId: game.boardId,
    board: game.board,
    rows: game.rows,
    columns: game.columns,
    turn: game.turn,
    status: game.status,
    winner: game.winner,
    p1Name: game.p1Name,
    p2Name: game.p2Name
  };
}
