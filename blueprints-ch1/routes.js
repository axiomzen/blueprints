var app = module.parent.exports.app;

var userRoutes = require('./controllers/user');
var middleware = require('./controllers/middleware');
var passport = require('./passport');

app.get('/', function(req, res, next) {
  res.render('index');
});
app.get('/html', function(req, res, next) {
  res.render('index.html');
});
app.get('/jade', function(req, res, next) {
  res.render('index.jade');
});

app.get('/users/register', userRoutes.getRegister);
app.post('/users/register', userRoutes.postRegister);
app.get('/users/login', userRoutes.getLogin);
app.post('/users/login', userRoutes.postLogin);
app.get('/users/:id', middleware.restrictedLoggedInUser, userRoutes.getProfile);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
