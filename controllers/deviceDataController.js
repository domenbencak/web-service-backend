var DevicedataModel = require('../models/deviceDataModel.js');

/**
 * deviceDataController.js
 *
 * @description :: Server-side logic for managing deviceDatas.
 */
module.exports = {

    /**
     * deviceDataController.list()
     */
    list: async function (req, res) {
        try {
            const deviceDatas = await DevicedataModel.find();
            return res.render('deviceData/list', { deviceDatas });
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting deviceData.',
                error: err
            });
        }
    },



    /**
     * deviceDataController.show()
     */
    show: async function (req, res) {
        try {
            var id = req.params.id;
            const deviceData = await DevicedataModel.findOne({ _id: id });

            if (!deviceData) {
                return res.status(404).json({
                    message: 'No such deviceData'
                });
            }

            return res.json(deviceData);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting deviceData.',
                error: err
            });
        }
    },

    /**
     * deviceDataController.create()
     */
    create: function (req, res) {
        var deviceData = new DevicedataModel({
			accelerometerX : req.body.accelerometerX,
			accelerometerY : req.body.accelerometerY,
			accelerometerZ : req.body.accelerometerZ,
			gyroscopeX : req.body.gyroscopeX,
			gyroscopeY : req.body.gyroscopeY,
			gyroscopeZ : req.body.gyroscopeZ,
			latitude : req.body.latitude,
			longtitude : req.body.longtitude,
			timestamp : req.body.timestamp
        });

        deviceData.save(function (err, deviceData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating deviceData',
                    error: err
                });
            }

            return res.status(201).json(deviceData);
        });
    },


    createRandom: function (req, res) {
        function getRandomAccelerometerValue() {
            var min = -2;
            var max = 2;

            return Math.random() * (max - min) + min;
        }
        function getRandomGyroscopeValue() {
            var min = -2000;
            var max = 2000;

            return Math.random() * (max - min) + min;
        }
        function getRandomLatitude() {
            var min = -90;
            var max = 90;

            return Math.random() * (max - min) + min;
        }
        function getRandomLongitude() {
            var min = -180;
            var max = 180;

            return Math.random() * (max - min) + min;
        }
        var deviceData = new DevicedataModel({
            accelerometerX: getRandomAccelerometerValue(),
            accelerometerY: getRandomAccelerometerValue(),
            accelerometerZ: getRandomAccelerometerValue(),
            gyroscopeX: getRandomGyroscopeValue(),
            gyroscopeY: getRandomGyroscopeValue(),
            gyroscopeZ: getRandomGyroscopeValue(),
            latitude: getRandomLatitude(),
            longitude: getRandomLongitude(),
            timestamp: new Date()
        });

        deviceData
            .save()
            .then(savedData => {
                //return res.status(201).json(savedData);
                return res.redirect('/deviceData');
            })
            .catch(error => {
            return res.status(500).json({
                message: 'Error when creating deviceData',
                error: error
            });
            });
    },




    /**
     * deviceDataController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        DevicedataModel.findOne({_id: id}, function (err, deviceData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting deviceData',
                    error: err
                });
            }

            if (!deviceData) {
                return res.status(404).json({
                    message: 'No such deviceData'
                });
            }

            deviceData.accelerometerX = req.body.accelerometerX ? req.body.accelerometerX : deviceData.accelerometerX;
			deviceData.accelerometerY = req.body.accelerometerY ? req.body.accelerometerY : deviceData.accelerometerY;
			deviceData.accelerometerZ = req.body.accelerometerZ ? req.body.accelerometerZ : deviceData.accelerometerZ;
			deviceData.gyroscopeX = req.body.gyroscopeX ? req.body.gyroscopeX : deviceData.gyroscopeX;
			deviceData.gyroscopeY = req.body.gyroscopeY ? req.body.gyroscopeY : deviceData.gyroscopeY;
			deviceData.gyroscopeZ = req.body.gyroscopeZ ? req.body.gyroscopeZ : deviceData.gyroscopeZ;
			deviceData.latitude = req.body.latitude ? req.body.latitude : deviceData.latitude;
			deviceData.longtitude = req.body.longtitude ? req.body.longtitude : deviceData.longtitude;
			deviceData.timestamp = req.body.timestamp ? req.body.timestamp : deviceData.timestamp;
			
            deviceData.save(function (err, deviceData) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating deviceData.',
                        error: err
                    });
                }

                return res.json(deviceData);
            });
        });
    },

    /**
     * deviceDataController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        DevicedataModel.findByIdAndRemove(id, function (err, deviceData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the deviceData.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function(req, res){
        return res.render('deviceData/publish');
    }
};
