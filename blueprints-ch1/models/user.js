var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  twitter: String,
  google: String,
  github: String,
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  // If the user changed its password, we need to rehash
  this.password = User.encryptPassword(this.password);
  next();
});

userSchema.methods = {
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.password);
  }
};

userSchema.statics = {
  makeSalt: function() {
    return bcrypt.genSaltSync(10);
  },
  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    return bcrypt.hashSync(password, User.makeSalt());
  },
  register: function(email, password, cb) {
    var user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      cb(err, user);
    });
  }
};

var User = mongoose.model('User', userSchema);

User.schema.path('email').validate(function(email) {
  return validator.isEmail(email);
});

User.schema.path('password').validate(function(password) {
  return validator.isLength(password, 6);
});

module.exports = User;
