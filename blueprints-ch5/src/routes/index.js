module.exports = function(Models) {

  var router = require('express').Router();
  var bodyParser = require('body-parser');
  var user = require('./user')(Models);
  var filter = require('./filter')(Models);
  var meeting = require('./meeting')(Models);
  var errorHandler = require('./errorHandler')();

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));

  router.post("/user", user.create);
  router.post("/meeting", [filter.loadUser], meeting.create);
  router.get("/me", [filter.loadUser], user.me);
  router.get("/followup/:meetingId/:reviewedUserId/:feedback", meeting.followUp);

  // always the last method
  router.use(errorHandler.catchAll);

  return router;
};