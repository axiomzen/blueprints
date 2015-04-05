$(function() {
  var game = new Game({
    $viewLogin: $('.view-login'),
    $viewGame: $('.view-game'),
    $username: $('.username'),
    $chain: $('.chain'),
    $word: $('.word'),
    $bywho: $('.bywho'),
    $users: $('.users')
  });
});

var Game = function(views) {
  this.views = views;

  this.init();
};

Game.prototype = {
  init: function() {
    var me = this;

    this.views.$username.focus();

    this.views.$viewLogin.submit(function() {
      var username = me.views.$username.val();
      me.join(username);
      return false;
    });

    this.views.$viewGame.submit(function() {
      var chain = me.views.$chain.val();
      me.chain(chain);
      me.views.$chain.val('');
      return false;
    });
  },

  join: function(username) {
    var socket = io.connect('/?username=' + username, {
      transports: ['websocket'],
    });

    this.socket = socket;

    var me = this;
    this.socket.on('connect', function() {
      console.log('connect');
      me.socket.emit('game', null, function(game) {
        console.log('stat', game);
        me.updateStat(game.stat);
        me.updateUsers(game.users);
      });

      me.showGameView();
    });

    this.socket.on('join', function(users) {
      me.updateUsers(users);
    });

    this.socket.on('leave', function(users) {
      me.updateUsers(users);
    });

    this.socket.on('stat', function(stat) {
      me.updateStat(stat);
    });
  },

  showGameView: function() {
    this.views.$viewLogin.hide();
    this.views.$viewGame.show();
    this.views.$chain.focus();
  },


  updateStat: function(stat) {
    this.views.$word.html(stat.word);

    this.views.$chain.attr('placeholder', stat.word.substr(-1));
    var score = _.reduce(stat.used, function(memo, used) {
      memo[used.user] = memo[used.user] || 0;
      memo[used.user] += Math.max(0, used.word.length - 2);
      return memo;
    }, {});

    var rank = _.sortBy(_.pairs(score), function(s) {
      return -s[1];
    });

    var topn = _.first(rank, 6);
    this.views.$bywho.html('current word updated by: ' + stat.used.pop().user + '\n' + JSON.stringify(topn));
  },

  updateUsers: function(users) {
    this.views.$users.html(users.map(function(user) {
      return '<li>' + user + '</li>';
    }).join(''));
  },

  chain: function(word) {
    if (!word) {
      return alert('Please input a word');
    }

    var me = this;
    this.socket.emit('chain', word, function(data) {
      console.log('chain', data);
      if (!data || data.status !== 200) {
        return alert('Your word "' + word + '" can\'t chain with current word.');
      }

      me.updateStat(data.resp);
    });
  }
};

