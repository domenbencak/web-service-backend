const session = require('express-session');
var DevicedataModel = require('../models/deviceDataModel.js');

const mongoose = require('mongoose');
const moment = require('moment');

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
          const deviceDatas = await DevicedataModel.find().populate('user');
          const reversedDeviceDatas = deviceDatas.reverse();
          return res.render('deviceData/list', { deviceDatas: reversedDeviceDatas });
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
            const deviceData = await DevicedataModel.findOne({ _id: id }).populate('user');

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
        return new Promise((resolve, reject) => {
            /*var deviceData = new DevicedataModel({
            accelerometerX: req.body.accelerometerX,
            accelerometerY: req.body.accelerometerY,
            accelerometerZ: req.body.accelerometerZ,
            gyroscopeX: req.body.gyroscopeX,
            gyroscopeY: req.body.gyroscopeY,
            gyroscopeZ: req.body.gyroscopeZ,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            timestamp: req.body.timestamp,
            user: req.session.userId,
            rating: req.body.rating
        });*/

        console.log("In deviceData: ", req.body);

        if (req.body.latitude == 0.0 && req.body.longitude == 0.0) {
            console.log("No location data");
        } else {

        var deviceData = new DevicedataModel({
            accelerometerX: req.body.accelerometerX,
            accelerometerY: req.body.accelerometerY,
            accelerometerZ: req.body.accelerometerZ,
            gyroscopeX: req.body.gyroscopeX,
            gyroscopeY: req.body.gyroscopeY,
            gyroscopeZ: req.body.gyroscopeZ,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            timestamp: Date.now(),
            user: req.body.user,
            rating: req.body.rating,
            carRideId: req.body.carRideId 
        });

        deviceData
            .save()
            .then(savedData => {
                //console.log("rating: ", req.body.rating,"user_id: ", req.body.user);
                resolve(deviceData);
            })
            .catch(error => {
                console.log(error);
            });
        }
        })
    
    },



    createRandom: function (req, res) {
        function getRandomValues(min, max, count) {
            if(count == 1) {
                return Math.random() * (max - min) + min;
            }
            var values = [];
            for (var i = 0; i < count; i++) {
                var value = Math.random() * (max - min) + min;
                values.push(value);
            }
            return values;
        }

        var accelerometerXValues = getRandomValues(-16, 16, 100);
        var accelerometerYValues = getRandomValues(-16, 16, 100);
        var accelerometerZValues = getRandomValues(-16, 16, 100);
        var gyroscopeXValues = getRandomValues(-50, 50, 100);
        var gyroscopeYValues = getRandomValues(-50, 50, 100);
        var gyroscopeZValues = getRandomValues(-50, 50, 100);

        var deviceData = new DevicedataModel({
            accelerometerX: accelerometerXValues,
            accelerometerY: accelerometerYValues,
            accelerometerZ: accelerometerZValues,
            gyroscopeX: gyroscopeXValues,
            gyroscopeY: gyroscopeYValues,
            gyroscopeZ: gyroscopeZValues,
            latitude: getRandomValues(-90, 90, 1),
            longitude: getRandomValues(-180, 180,1),
            timestamp: new Date(),
            user: req.session.userId,
            rating: Math.random(0, 100)
        });

        deviceData
            .save()
            .then(savedData => {
                return res.redirect('/deviceData');
            })
            .catch(error => {
                return res.status(500).json({
                    message: 'Error when creating deviceData',
                    error: error
                });
            });
    },

    // Made a new function for testing purposes
    // Because it need to return a object the other function just redirects the user
    createRandomForCarRide: function (user) {
        return new Promise((resolve, reject) => {
            function getRandomValues(min, max, count) {
                if(count == 1) {
                    return Math.random() * (max - min) + min;
                }
                var values = [];
                for (var i = 0; i < count; i++) {
                    var value = Math.random() * (max - min) + min;
                    values.push(value);
                }
                return values;
            }
    
            var accelerometerXValues = getRandomValues(-16, 16, 100);
            var accelerometerYValues = getRandomValues(-16, 16, 100);
            var accelerometerZValues = getRandomValues(-16, 16, 100);
            var gyroscopeXValues = getRandomValues(-50, 50, 100);
            var gyroscopeYValues = getRandomValues(-50, 50, 100);
            var gyroscopeZValues = getRandomValues(-50, 50, 100);
    
            var deviceData = new DevicedataModel({
                accelerometerX: accelerometerXValues,
                accelerometerY: accelerometerYValues,
                accelerometerZ: accelerometerZValues,
                gyroscopeX: gyroscopeXValues,
                gyroscopeY: gyroscopeYValues,
                gyroscopeZ: gyroscopeZValues,
                latitude: getRandomValues(-90, 90, 1),
                longitude: getRandomValues(-180, 180,1),
                timestamp: new Date(),
                user: user,
                rating: (Math.random(0, 100)).toFixed(4)
            });
    
            deviceData
                .save()
                .then(savedData => {
                    console.log("Returning deviceData");
                    //console.log(deviceData);
                    resolve(deviceData);
                })
                .catch(error => {
                    return 0;
                });
        })
    },


    /**
     * deviceDataController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        DevicedataModel.findOne({ _id: id }, function (err, deviceData) {
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

            deviceData.accelerometerX = req.body.accelerometerX || deviceData.accelerometerX;
            deviceData.accelerometerY = req.body.accelerometerY || deviceData.accelerometerY;
            deviceData.accelerometerZ = req.body.accelerometerZ || deviceData.accelerometerZ;
            deviceData.gyroscopeX = req.body.gyroscopeX || deviceData.gyroscopeX;
            deviceData.gyroscopeY = req.body.gyroscopeY || deviceData.gyroscopeY;
            deviceData.gyroscopeZ = req.body.gyroscopeZ || deviceData.gyroscopeZ;
            deviceData.latitude = req.body.latitude || deviceData.latitude;
            deviceData.longitude = req.body.longitude || deviceData.longitude;
            deviceData.timestamp = req.body.timestamp || deviceData.timestamp;

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

    publish: function (req, res) {
        return res.render('deviceData/publish');
    },

    getRatingById: function(deviceDataId) {
        return new Promise((resolve, reject) => {
            DevicedataModel.findById(deviceDataId)
              .then(deviceData => {
                if (!deviceData) {
                  reject(new Error('No deviceData found'));
                } else {
                  resolve(deviceData.rating);
                }
              })
              .catch(error => {
                reject(error);
              });
          });
    }
};
