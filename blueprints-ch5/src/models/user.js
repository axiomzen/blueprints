module.exports = function (db){
  var methods = {}
  var User = db.collection('users');
  methods.collection = User

  methods.create = function(name,email,location,cb) {
    User.insert({
      name: name,
      email: email,
      location: location
    }, cb)
  };

  methods.loadByEmail = function(email,cb) {
    User.findOne({email:email},cb)
  };

  return methods
}