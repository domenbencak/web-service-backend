var CarrideratingModel = require('../models/carRideRatingModel.js');

/**
 * carRideRatingController.js
 *
 * @description :: Server-side logic for managing carRideRatings.
 */
module.exports = {

    /**
     * carRideRatingController.list()
     */
    list: function (req, res) {
        CarrideratingModel.find(function (err, carRideRatings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting carRideRating.',
                    error: err
                });
            }

            return res.json(carRideRatings);
        });
    },

    /**
     * carRideRatingController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CarrideratingModel.findOne({_id: id}, function (err, carRideRating) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting carRideRating.',
                    error: err
                });
            }

            if (!carRideRating) {
                return res.status(404).json({
                    message: 'No such carRideRating'
                });
            }

            return res.json(carRideRating);
        });
    },

    /**
     * carRideRatingController.create()
     */
    create: function (req, res) {
        var carRideRating = new CarrideratingModel({
			carRide : req.body.carRide,
			rating : req.body.rating
        });

        carRideRating.save(function (err, carRideRating) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating carRideRating',
                    error: err
                });
            }
        });
    },

    /**
     * carRideRatingController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CarrideratingModel.findOne({_id: id}, function (err, carRideRating) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting carRideRating',
                    error: err
                });
            }

            if (!carRideRating) {
                return res.status(404).json({
                    message: 'No such carRideRating'
                });
            }

            carRideRating.carRide = req.body.carRide ? req.body.carRide : carRideRating.carRide;
			carRideRating.rating = req.body.rating ? req.body.rating : carRideRating.rating;
			
            carRideRating.save(function (err, carRideRating) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating carRideRating.',
                        error: err
                    });
                }

                return res.json(carRideRating);
            });
        });
    },

    /**
     * carRideRatingController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CarrideratingModel.findByIdAndRemove(id, function (err, carRideRating) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the carRideRating.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
