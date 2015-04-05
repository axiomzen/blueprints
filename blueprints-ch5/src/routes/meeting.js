module.exports = function(Model) {
  var methods = {};

  methods.create = function(req,res,next) {
    var user = res.locals.user
    Model.Meeting.isUserScheduled(user, function(err,isScheduled) {
      if(err) return next(err)
      if(isScheduled) return res.status(412).send({error: "user is already scheduled"})
      Model.Meeting.pair(user, function(err,result) {
        // we don't really expect this function to fail, if that's the case it should be an internal error
        if(err) return next(err)
        res.send({})
      })
    })
  }

  methods.followUp = function(req,res,next) {
    var meetingId = req.param("meetingId");
    var reviewedUserId = req.param("reviewedUserId");
    var feedback = req.param("feedback");
    // validate feedback
    if(!(feedback in Model.Meeting.outcomes())){
      return res.status(400).send("Feedback not recognized");
    }
    Model.Meeting.didMeetingHappened(meetingId, function(err, itDid) {
      if(err){
        if(err.message == "no meeting found by this id"){
          return res.status(404).send(err.message);
        } else {
          return next(err);
        }
      }
      if(!itDid){
        return res.status(412).send("The meeting didn't happen yet, come back later!");
      }
      Model.Meeting.rate(meetingId, reviewedUserId, feedback, function(err, userName, text) {
        if(err) return next(err);
        res.send("You just rated your meeting with "+userName+" as "+text+". Thanks!");
      });
    });
  }

  return methods;
};
