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
    list: function (req, res) {
        DevicedataModel.find(function (err, deviceDatas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting deviceData.',
                    error: err
                });
            }

            return res.json(deviceDatas);
        });
    },

    /**
     * deviceDataController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        DevicedataModel.findOne({_id: id}, function (err, deviceData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting deviceData.',
                    error: err
                });
            }

            if (!deviceData) {
                return res.status(404).json({
                    message: 'No such deviceData'
                });
            }

            return res.json(deviceData);
        });
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
    }
};
