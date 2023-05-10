var CarrideModel = require('../models/carRideModel.js');

/**
 * carRideController.js
 *
 * @description :: Server-side logic for managing carRides.
 */
module.exports = {

    /**
     * carRideController.list()
     */
    list: function (req, res) {
        CarrideModel.find(function (err, carRides) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting carRide.',
                    error: err
                });
            }

            return res.json(carRides);
        });
    },

    /**
     * carRideController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CarrideModel.findOne({_id: id}, function (err, carRide) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting carRide.',
                    error: err
                });
            }

            if (!carRide) {
                return res.status(404).json({
                    message: 'No such carRide'
                });
            }

            return res.json(carRide);
        });
    },

    /**
     * carRideController.create()
     */
    create: function (req, res) {
        var carRide = new CarrideModel({
			user : req.body.user,
			deviceData : req.body.deviceData
        });

        carRide.save(function (err, carRide) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating carRide',
                    error: err
                });
            }

            return res.status(201).json(carRide);
        });
    },

    /**
     * carRideController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CarrideModel.findOne({_id: id}, function (err, carRide) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting carRide',
                    error: err
                });
            }

            if (!carRide) {
                return res.status(404).json({
                    message: 'No such carRide'
                });
            }

            carRide.user = req.body.user ? req.body.user : carRide.user;
			carRide.deviceData = req.body.deviceData ? req.body.deviceData : carRide.deviceData;
			
            carRide.save(function (err, carRide) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating carRide.',
                        error: err
                    });
                }

                return res.json(carRide);
            });
        });
    },

    /**
     * carRideController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CarrideModel.findByIdAndRemove(id, function (err, carRide) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the carRide.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
