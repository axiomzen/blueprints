var socketIO = require('socket.io');
var Game = require('./app/controllers/game');

module.exports = function(server) {

  var io = socketIO(server, {
    transports: ['websocket']
  });


  io.use(function(socket, next) {
    var handshakeData = socket.request;
    console.log('socket handshaing', handshakeData._query.username);
    socket.user = handshakeData._query.username;

    Game.join(socket.user)
    .then(function(users) {
      console.log('game joined successfully', socket.user);
      socket.broadcast.emit('join', users);
      next();
    })
    .catch(function(err) {
      console.log('game joined fail', socket.user);
      next(err);
    });
  });

  io.sockets.on('connection', function(socket) {
    console.log('client connected via socket', socket.user);

    socket.on('disconnect', function() {
      console.log('socket user', socket.user, 'leave');
      Game.leave(socket.user)
      .then(function(users) {
        socket.broadcast.emit('leave', users);
      });
    });

    socket.on('chain', function(word, responseFunc) {
      console.log('socket chain', word);
      Game.chain(socket.user, word)
      .then(function(stat) {
        console.log('successful to chain', stat);
        if (responseFunc) {
          responseFunc(null, stat);
        }
        console.log('broadcasting from', socket.user, stat);
        socket.broadcast.emit('stat', stat);
      })
      .catch(function(err) {
        console.log('fail to chain', err);
        if (responseFunc) {
          responseFunc(err);
        }
      });
    });

    socket.on('game', function(query, responseFunc) {
      console.log('socket stat', socket.user);
      Game.state()
      .then(function(game) {
        console.log('socket stat end', game);
        if (responseFunc) {
          responseFunc(game);
        }
      });
    });

    socket.on('error', function(err) {
      console.error('error', err);
    });
  });

};
