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

    findCarRidesByUserId: async function (req, res){
        try {
            const userId = req.session.userId;

            return carRideModel.find({ user: userId }).exec();
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
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
          date: Date.now(),
          carRideRating: 0
        });

        console.log(req.body.user);
      
        carRide.save()
          .then(function (carRide) {
            // send the id of the carRide back to the device
            res.status(200).json({
                id: carRide._id
            });
          })
          .catch(function (err) {
            return res.status(500).json({
              message: 'Error when creating carRide',
              error: err
            });
          });
      },

      createOnWebsite: function (req, res) {
        var carRide = new carRideModel({
          user: req.session.userId,
          deviceData: req.body.deviceData,
          date: Date.now(),
          carRideRating: 0
        });

        console.log(req.body.user);
      
        carRide.save()
          .then(function (carRide) {
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
                .then(async function (randomData){
                    //console.log(randomData);
                    // Add the random data to the deviceData field of the car ride
                    carRide.deviceData.push(randomData);

                    var combinedRatings = 0;
                    //
                    for(var i = 0; i < carRide.deviceData.length; i++){
                        // gets the rating of each deviceData input
                        await deviceDataController.getRatingById(carRide.deviceData[i]._id)
                        .then(rating => {
                            combinedRatings += rating;
                        })
                        .catch(error => {
                            console.error('Error when retrieving rating:', error);
                        });
                    }

                    var averageRating = (combinedRatings / carRide.deviceData.length).toFixed(3);
                    carRide.carRideRating = averageRating;

                    carRide.save()
                        .then(function (updatedCarRide) {
                            // Everything was correctly added to the carRide so save it in the database
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
                message: 'Error when getting carRide in update function',
                error: err
            });
        });

    },

    updateCarRideMobile: function(req, res){
        console.log("Received data: ", req.body.jsonData);
        console.log("Req.body", req.body);
        
        var id = req.body.carRideId;

        carRideModel.findOne({ _id: id })
        .then(async function (carRide) {
            if (!carRide) {
                console.log("No such carRide");
                return res.status(404).json({
                message: 'No such carRide'
                });
            }

            deviceDataController.create(req, res)
            .then(async function (deviceData){
                carRide.deviceData.push(deviceData);

                var combinedRatings = 0;
                for(var i = 0; i < carRide.deviceData.length; i++){
                    // gets the rating of each deviceData input
                    await deviceDataController.getRatingById(carRide.deviceData[i]._id)
                    .then(rating => {
                        combinedRatings += rating;
                    })
                    .catch(error => {
                        console.error('Error when retrieving rating:', error);
                    });
                }

                var averageRating = (combinedRatings / carRide.deviceData.length).toFixed(3);
                carRide.carRideRating = averageRating;

                carRide.save()
                .then(function (updatedCarRide) {
                    var message = 'Car ride updated successfully';
                    /*wss.clients.forEach(function each(client) {
                    // Check if the client is the intended recipient (you can use any condition here)
                    if (client.id === req.body.clientId) {
                        client.send(message);
                    }
                    });*/

                    res.status(200).json({ message: message });
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
                console.error('Error when creating deviceData for carRide:', err); // Log the error
                return res.status(500).json({
                  message: 'Error when creating deviceData for carRide.',
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
        // Add the new deviceData to the deviceData field of the car ride
        //carRide.deviceData.push(newDeviceData._id);
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
            message: 'Error when getting carRide in remove function',
            error: err,
            });
        });
    },

    retrieveLongLatFromCarRide : async function(req, res){
        var carRideId = req.params.id;
        /*console.log("WSS-clientshere: ", tt);
        tt.forEach(function (client){
            console.log("i");
        })
        console.log(tt.length);*/

        carRideModel.findById(carRideId)
            .populate('deviceData') // Populate the deviceData array field
            .then(function (carRide) {
            if (!carRide) {
                return res.status(404).json({
                message: 'No such carRide'
                });
            }

            // Extract latitude and longitude from deviceData
            var deviceDataArray = carRide.deviceData.map(function (deviceData) {
                return {
                latitude: deviceData.latitude,
                longitude: deviceData.longitude,
                rating: deviceData.rating
                };
            });
            // Render the HTML page and pass the deviceData as a variable
            res.render('carRide/mapShowcase', { deviceData: deviceDataArray });
            })
            .catch(function (err) {
            return res.status(500).json({
                message: 'Error when getting carRide in retrieveLongLatFromCarRide',
                error: err
            });
            });
    },

    retrieveLongLatFromCarRideJSON : function(req, res){
        var carRideId = req.params.id;
        /*console.log("WSS-clientshere: ", tt);
        tt.forEach(function (client){
            console.log("i");
        })
        console.log(tt.length);*/

        carRideModel.findById(carRideId)
            .populate('deviceData') // Populate the deviceData array field
            .then(function (carRide) {
            if (!carRide) {
                return res.status(404).json({
                message: 'No such carRide'
                });
            }

            // Extract latitude and longitude from deviceData
            var deviceDataArray = carRide.deviceData.map(function (deviceData) {
                return {
                latitude: deviceData.latitude,
                longitude: deviceData.longitude,
                rating: deviceData.rating
                };
            });

            // Send the JSON data as a separate response
            //console.log("HEYA");
            //console.log(deviceDataArray); 
            res.json(deviceDataArray);
            })
            .catch(function (err) {
            return res.status(500).json({
                message: 'Error when getting carRide json',
                error: err
            });
            });
    },

    deleteAllCarRides : function(req, res){
        // Delete all car rides from the database
        carRideModel.deleteMany({})
        .then(() => {
        //res.status(200).json({ message: 'All car rides deleted successfully.' });
            console.log("All car rides deleted successfully.");
            res.redirect('/');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    },
};
