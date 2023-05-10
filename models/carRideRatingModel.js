var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var carRideRatingSchema = new Schema({
	'carRide' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'carRide'
	},
	'rating' : Number
});

module.exports = mongoose.model('carRideRating', carRideRatingSchema);
