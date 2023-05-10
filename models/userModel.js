var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'email' : String,
	'password' : String,
	'faceImagePath' : String,
	'faceFeaturesPath' : String
});

// Mongoose middlewear funkcija ki se executa preden je dokument
// shranjen v mongoose database, hasha password

userSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	});
});

// avtenticira user login oz searcha za userja z username ter nato primerja
// password ce najde userja returna callback oz avtenticiranega userja

userSchema.statics.authenticate = function(username, password){
	return User.findOne({username: username})
	.then(function(user){
		if(!user){
			var err = new Error('User not found.');
			err.status = 401;
			throw err;
		}
		return bcrypt.compare(password, user.password)
		.then(function(result) {
			if (result === true) {
				return user;
			  } else {
				throw new Error('Incorrect password');
			  }
		});
	});
}

var User = mongoose.model('user', userSchema);
module.exports = User;
