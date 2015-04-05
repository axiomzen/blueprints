var model = require('../models/links');
var utils = require('../utils');

module.exports = function(app) {
  app.get('/links', function *(next) {
    var links = yield model.find({}).sort({upvotes: 'desc'}).exec();
    if( this.accepts('text/html') ){
      yield this.render('index', {
        links: links,
        status: this.query.status
      });
    } else {
      this.body = links;
    }
  });

  app.post('/links', function *(next) {
    this.assert(typeof this.request.body.title === 'string', 400, 'title is required');
    this.assert(this.request.body.title.length > 0, 400, 'title is required');
    this.assert(utils.isValidURL(this.request.body.URL), 400, 'URL is invalid');

    // If the above assertion fails, the following code won't be executed.
    var link = yield model.create({
      title: this.request.body.title,
      URL: this.request.body.URL
    });
    if( this.accepts('text/html') ){
      this.redirect('/links?status=success');
    } else {
      this.body = link;
    }
  });

  app.delete('/links/:id', function *(next) {
    try {
      var link = yield model.remove({ _id: this.params.id }).exec();
    } catch (err) {
      if (err.name === 'CastError') {
        this.throw(400, 'invalid link id');
      }
    }
    this.body = link;
  });

  app.put('/links/:id/upvote', function *(next) {
    var link;
    try {
      link = yield model.upvote(this.params.id);
    } catch (err) {
      if (err.name === 'CastError') {
        this.throw(400, 'invalid link id');
      }
    }

    // Check that a link document is returned
    this.assert(link, 400, 'link not found');

    this.body = link;
  });

  app.put('/links/:id', function *(next) {
    this.assert((this.request.body.title || '').length > 0, 400, 'title is required');

    var link;
    try {
      link = yield model.findById(this.params.id).exec();
    } catch (err) {
      if (err.name === 'CastError') {
        this.throw(400, 'invalid link id');
      }
    }

    // Check that a link document is returned
    this.assert(link, 400, 'link not found');

    link.title = this.request.body.title;
    link = yield link.saveThunk()[0];
    this.body = link;
  });

};
