var passport = require('../passport');
var User = require('mongoose').model('User');

module.exports.getLogin = function(req, res, next) {
  res.render('login');
};

module.exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
});

module.exports.getRegister = function(req, res, next) {
  res.render('register');
};

module.exports.postRegister = function(req, res, next) {
  User.register(req.body.email, req.body.password, function(err, user) {
    if (err) return next(err);
    req.login(user, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });  
};

module.exports.getProfile = function(req, res, next) {
  res.render('users/profile', { user: req.user.toJSON() });
};

module.exports.logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};
