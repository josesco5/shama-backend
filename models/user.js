var mongoose = require('mongoose');
var Schema = mongoose.Shema;

var userSchema = mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  identityCard: String,
  facebookId: String,
  email: { type: String, required: true },
  password: String,
  gender: String,
  specialty: String,
  career: String,
  role: String,
  enabled: { type: Boolean, default: true },
  comments: String,
  createdAt: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
