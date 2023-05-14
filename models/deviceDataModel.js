var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var deviceDataSchema = new Schema({
	'accelerometerX' : [Number],
	'accelerometerY' : [Number],
	'accelerometerZ' : [Number],
	'gyroscopeX' : [Number],
	'gyroscopeY' : [Number],
	'gyroscopeZ' : [Number],
	'latitude' : Number,
	'longitude' : Number,
	'timestamp' : Date,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'rating' : Number
});

module.exports = mongoose.model('deviceData', deviceDataSchema);
