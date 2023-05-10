var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'email' : String,
	'password' : String,
	'faceImagePath' : String,
	'faceFeaturesPath' : String
});

module.exports = mongoose.model('user', userSchema);
