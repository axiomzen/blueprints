module.exports = function(Model) {
  var methods = {};

  methods.create = function(req,res,next) {
    Model.User.create(req.param('name'), req.param('email'), req.param('location'), function(err, user) {
      if(err) return next(err);

      Model.Meeting.pair(user, function(err, meeting) {
        res.send(user);
      });
    })
  }

  methods.me = function(req,res) {
    res.send(res.locals.user)
  }

  return methods;
};
