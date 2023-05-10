var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var carRideSchema = new Schema({
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'deviceData' : [{
		type: Schema.Types.ObjectId,
	 	ref: 'deviceData'
	}]
});

module.exports = mongoose.model('carRide', carRideSchema);
