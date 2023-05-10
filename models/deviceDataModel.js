var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var deviceDataSchema = new Schema({
	'accelerometerX' : Number,
	'accelerometerY' : Number,
	'accelerometerZ' : Number,
	'gyroscopeX' : Number,
	'gyroscopeY' : Number,
	'gyroscopeZ' : Number,
	'latitude' : Number,
	'longitude' : Number,
	'timestamp' : Date
});

module.exports = mongoose.model('deviceData', deviceDataSchema);
