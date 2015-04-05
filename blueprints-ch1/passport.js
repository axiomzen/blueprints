var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;

var config = require('./config')();
console.log(config);
var User = require('mongoose').model('User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

function authFail(done) {
  done(null, false, { message: 'Incorrent email/password combination' });
}

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) return done(err);
    if (!user) {
      return authFail(done);
    }
    if (!user.validPassword(password)) {
      return authFail(done);
    }
    return done(null, user);
  });
}));

function tryRegisteringWith(authProvider, profile, cb, error) {
  var search = {};
  search[authProvider] = profile.id;
  User.findOne(search, function(err, existingUser) {
    if (existingUser) return cb(existingUser, null);
    User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
      if (existingEmailUser) return error('There is already an account using this email address'); 
      var user = new User();
      console.log(profile._json.email);
      user.email = profile._json.email;
      user[authProvider] = profile.id;
      cb(null, user);
    });
  });
}

passport.use(new TwitterStrategy(config.twitter, function(req, accessToken, tokenSecret, profile, done) {
  // Twitter will not provide an email address.  Period.
  // But a person’s twitter username is guaranteed to be unique
  // so we can "fake" a twitter email address as follows:
  profile._json.email = profile.username + "@twitter." + config.domain + ".com";
  console.log(profile._json.email);

  tryRegisteringWith('twitter', profile, function(existingUser, user) {
    if (existingUser) return done(null, existingUser);
    console.log(user);
    console.log(profile);
    user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
    user.profile.name = profile.displayName;
    user.profile.location = profile._json.location;
    user.profile.picture = profile._json.profile_image_url;
    user.save(function(err) {
      done(err, user);
    });
  }, done);
}));

passport.use(new GitHubStrategy(config.github, function(req, accessToken, refreshToken, profile, done) {
  tryRegisteringWith('github', profile, function(existingUser, user) {
    if (existingUser) return done(null, existingUser);
    user.tokens.push({ kind: 'github', accessToken: accessToken });
    user.profile.name = profile.displayName;
    user.profile.picture = profile._json.avatar_url;
    user.profile.location = profile._json.location;
    user.profile.website = profile._json.blog;
    user.save(function(err) {
      done(err, user);
    });
  }, done);
}));

passport.use(new GoogleStrategy(config.google, function(req, accessToken, refreshToken, profile, done) {
  tryRegisteringWith('google', profile, function(existingUser, user) {
    if (existingUser) return done(null, existingUser);
    user.tokens.push({ kind: 'google', accessToken: accessToken });
    user.profile.name = profile.displayName;
    user.profile.gender = profile._json.gender;
    user.profile.picture = profile._json.picture;
    user.save(function(err) {
      done(err, user);
    });
  });
}));

passport.exposeUser = function() {
  return function(req, res, next) {
    res.locals.user = req.user;
    next();
  };
};

module.exports = passport;
