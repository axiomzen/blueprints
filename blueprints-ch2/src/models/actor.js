var mongoose    = require('mongoose');
var generateId  = require('./plugins/generateId');

var actorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: {
      unique: true
    }
  },
  name: {
    type: String,
    required: true
  },
  birth_year: {
    type: Number,
    required: true
  },
  movies: [{
    type : mongoose.Schema.ObjectId,
    ref : 'Movie'
  }]
});

actorSchema.plugin(generateId());

module.exports = mongoose.model('Actor', actorSchema);
