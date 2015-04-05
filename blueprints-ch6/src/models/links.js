var mongoose = require('mongoose');
var thunk = require('thunkify');

var schema = new mongoose.Schema({
  title: { type: String, require: true },
  URL: { type: String, require: true },
  upvotes: { type: Number, require: true, 'default': 0 },
  timestamp: { type: Date, require: true, 'default': Date.now },
});

schema.statics.upvote = function *(linkId) {
  return yield this.findByIdAndUpdate(linkId, {
    $inc: {
      upvotes: 1
    }
  }).exec();
};

var Links = mongoose.model('links', schema);

// Thunkify save method
Links.prototype.saveThunk = thunk(Links.prototype.save);

module.exports = Links;
