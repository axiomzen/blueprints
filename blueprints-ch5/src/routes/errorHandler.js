// see http://expressjs.com/guide.html#error-handling
module.exports = function() {
  var methods = {}

  methods.catchAll = function(err, req, res, next) {
    console.warn("catchAll ERR:", err);
    res.status(500).send({
      error: err.toString ? err.toString() : err
    });
  }

  return methods
};