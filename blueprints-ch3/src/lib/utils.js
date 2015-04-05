var crypto = require('crypto');

module.exports = {
  randomValueHex: function(len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len);
  },

  // Helper to return 400 error with a custom message
  return400Error: function(res, message) {
    return res.status(400).json({
      error: message
    });
  }
}
