var carRideModel = require('../models/carRideModel.js');
var deviceDataController = require('../controllers/deviceDataController.js');
const deviceDataModel = require('../models/deviceDataModel.js');


/**
 * carRideController.js
 *
 * @description :: Server-side logic for managing carRides.
 */
module.exports = {

    /**
     * carRideController.list()
     */
    list: async function (req, res, next) {
        return carRideModel.find().exec();
    },

    /**
     * carRideController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        carRideModel.findOne({_id: id}, function (err, carRide) {
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
        var carRide = new carRideModel({
          user: req.body.user,
          deviceData: req.body.deviceData,
          date: Date.now()
        });
      
        carRide.save()
          .then(function (carRide) {
            //return res.json(carRide);
            res.redirect('/user/profile');
          })
          .catch(function (err) {
            return res.status(500).json({
              message: 'Error when creating carRide',
              error: err
            });
          });
      },

    /**
     * carRideController.update()
     */
    update: async function (req, res) {
        /*
        var id = req.params.id;

        carRideModel.findOne({_id: id}, function (err, carRide) {
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
        */
            var id = req.params.id;

            carRideModel.findOne({_id: id})
        .then( async function (carRide) {
            if (!carRide) {
                return res.status(404).json({
                    message: 'No such carRide'
                });
            }
            try{
                deviceDataController.createRandomForCarRide(req.session.userId)
                .then(function (randomData){
                    console.log(randomData);
                    // Add the random data to the deviceData field of the car ride
                    carRide.deviceData.push(randomData);

                    carRide.save()
                        .then(function (updatedCarRide) {
                            //return res.json(updatedCarRide);
                            return res.redirect("/user/profile")
                        })
                        .catch(function (err) {
                            console.error('Error when updating carRide:', err); // Log the error
                            return res.status(500).json({
                                message: 'Error when updating carRide.',
                                error: err
                            });
                        });
                    
                })
                .catch(function (err) {
                    console.error('Error when generating random data:', err); // Log the error
                    return res.status(500).json({
                      message: 'Error when generating random data.',
                      error: err
                    });
                  });
            }catch(err){
                console.log("Error", err);
            }
            
        })
        .catch(function (err) {
            console.error('Error when getting carRide:', err); // Log the error
            return res.status(500).json({
                message: 'Error when getting carRide',
                error: err
            });
        });

    },

    /**
     * carRideController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        // Get the carRide document
        carRideModel.findById(id)
        .then((carRide) => {
            if (!carRide) {
            return res.status(404).json({
                message: 'No such carRide',
            });
            }

            // Delete the associated deviceData documents
            var deviceDataIds = carRide.deviceData;
            var deletePromises = deviceDataIds.map((deviceId) => {
                return deviceDataModel.findByIdAndRemove(deviceId)
                  .catch((err) => {
                    console.error('Error when deleting deviceData:', err);
                    throw err; // Rethrow the error to reject the promise
                  });
              });
            Promise.all(deletePromises)
            .then(() => {
                // Delete the carRide document
                carRide.deleteOne()
                .then(() => {
                    return res.redirect("/user/profile");
                })
                .catch((err) => {
                    return res.status(500).json({
                    message: 'Error when deleting the carRide.',
                    error: err,
                    });
                });
            })
            .catch((err) => {
                console.log("Error: ", err)
                return res.status(500).json({
                message: 'Error when deleting associated deviceData.',
                error: err,
                });
            });
        })
        .catch((err) => {
            console.error('Error when getting carRide:', err);
            return res.status(500).json({
            message: 'Error when getting carRide',
            error: err,
            });
        });
    }
};
