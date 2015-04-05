module.exports = function(sendMail, models) {
  var path           = require('path')
  var async          = require('async')
  var templatesDir   = path.resolve(__dirname, 'templates')
  var emailTemplates = require('email-templates')
  var Meeting        = models.Meeting

  function sendForUser (user1, user2, id, date, cb) {
    emailTemplates(templatesDir, function(err,template) {
      if(err) throw err

      template('followup', {
        meetingId: id.toString(),
        user1    : user1,
        user2    : user2,
        date     : date,
        outcomes : Meeting.outcomes()
      }, function(err,html) {
        if(err) throw err
        sendMail(
          user1.email,
          "How was your meeting with "+user2.name+"?",
          html,
          cb
        )
      })
    })
  }

  // call done() when both emails are sent
  return function followUp(meeting, done) {
    done = done || function() {}
    async.parallel([
      function(cb) {
        sendForUser(meeting.user1, meeting.user2, meeting._id, meeting.at, cb)
      },
      function(cb) {
        sendForUser(meeting.user2, meeting.user1, meeting._id, meeting.at, cb)
      },
    ], done)
  }
}