// A collection of validation middleware

module.exports = function(app) {
  var MIN_COLUMNS = app.get('config').MIN_COLUMNS,
      MIN_ROWS = app.get('config').MIN_ROWS;

  var _return400Error = require('./utils').return400Error;

  return {
    name: function(req, res, next) {
      if(!req.body.name) {
        return _return400Error(res, 'Must provide name field!');
      }
      next();
    },
    columns: function(req, res, next) {
      if(req.body.columns && req.body.columns < MIN_COLUMNS) {
        return _return400Error(res, 'Number of columns has to be >= ' + MIN_COLUMNS);
      }
      next();
    },
    rows: function(req, res, next) {
      if(req.body.rows && req.body.rows < MIN_ROWS) {
        return _return400Error(res, 'Number of rows has to be >= ' + MIN_ROWS);
      }
      next();
    },
    move: function(req, res, next) {
      if (!req.body.column) {
        return _return400Error(res, 'Move where? Missing column!');
      }
      next();
    },
    token: function(req, res, next) {
      if (!req.headers['x-player-token']) {
        return _return400Error(res, 'Missing X-Player-Token!');
      }
      next();
    }
  };
};
