var Actor = require('../models/actor');
var Movie = require('../models/movie');

module.exports = {

  getAll: function(req, res, next) {
    Actor.find(function(err, actors) {
      if (err) return res.status(400).json(err);

      res.status(200).json(actors);
    });
  },


  createOne: function(req, res, next) {
    Actor.create(req.body, function(err, actor) {
      if (err) return res.status(400).json(err);

      res.status(201).json(actor);
    });
  },


  getOne: function(req, res, next) {
    Actor.findOne({ id: req.params.id })
    .populate('movies')
    .exec(function(err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      res.status(200).json(actor);
    });
  },


  updateOne: function(req, res, next) {
    Actor.findOneAndUpdate({ id: req.params.id }, req.body, function(err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      res.status(200).json(actor);
    });
  },


  deleteOne: function(req, res, next) {
    Actor.findOneAndRemove({ id: req.params.id }, function(err) {
      if (err) return res.status(400).json(err);

      res.status(204).json();
    });
  },


  addMovie: function(req, res, next) {
    Actor.findOne({ id: req.params.id }, function(err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      Movie.findOne({ id: req.body.id }, function(err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();

        actor.movies.push(movie);
        actor.save(function(err) {
          if (err) return res.status(500).json(err);

          res.status(201).json(actor);
        });
      })
    });
  },


  deleteMovie: function(req, res, next) {
    Actor.findOne({ id: req.params.id }, function(err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      // HACK TO CHANGE
      actor.movies = [];
      actor.save(function(err) {
        if (err) return res.status(400).json(err);

        res.status(204).json(actor);
      })
    });
  }

};
