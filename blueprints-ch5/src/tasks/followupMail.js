module.exports = function(M,mailer) {
  return function() {
    // console.log("running task..", new Date)
    M.Meeting.needMailing(function(err,meetings) {
      if(err) return console.warn("needMailing", err)
      if(!meetings || meetings.length < 1) return
      meetings.forEach(function(meeting) {
        mailer.followUp(meeting, function(err) {
          if(err) return console.warn("needMailing followup failed "+meeting._id.toString(), err)
          M.Meeting.markAsMailed(meeting._id)
        })
      })
      M.Meeting.markAsMailed(meetings)
    })
  };
}