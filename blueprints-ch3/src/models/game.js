var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  p1Key: {
    type: String,
    required: true
  },
  p2Key: {
    type: String,
    required: true
  },
  p1Name: {
    type: String,
    required: true
  },
  p2Name: {
    type: String
  },
  turn: {
    type: Number,
    required: true
  },
  boardId: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  board: {
    type: Array,
    required: true
  },
  rows: {
    type: Number,
    required: true
  },
  columns: {
    type: Number,
    required: true
  },
  status: {
    type: String
  },
  winner: {
    type: String
  }
});

module.exports = mongoose.model('Game', gameSchema);
