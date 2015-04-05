
module.exports.restrictedLoggedInUser = function(req, res, next) {
  if (req.user.id != req.params.id) {
    return next("Not found");
  }
  next();
};
