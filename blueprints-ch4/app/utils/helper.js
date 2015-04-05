exports.build400Error = function(message) {
  var error = new Error(message);
  error.status = 400;
  return error;
};

