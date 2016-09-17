var mongoose = require('mongoose');
var Schema = mongoose.Shema;

var userSchema = mongoose.Schema({
  name: String,
  lastname: String,
  identityCard: String,
  facebookId: String,
  email: String,
  password: String,
  gender: String,
  specialty: String,
  career: String,
  role: String,
  enabled: Boolean,
  comments: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
