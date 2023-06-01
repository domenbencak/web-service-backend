var express = require('express');
var router = express.Router();

var carRideModel = require('../models/carRideModel');
var userModel = require('../models/userModel');

/* GET home page. */
router.get('/', async function(req, res, next) {

  //get every single carRide from database
  try {
    const carRides = await carRideModel.find().populate('deviceData').exec();

    const carRideArray = await Promise.all(carRides.map(async carRide => {
      const deviceDataArray = carRide.deviceData.map(deviceData => ({
        latitude: deviceData.latitude,
        longitude: deviceData.longitude,
        rating: deviceData.rating
      }));

      // dobim username userja
      console.log(carRide.user);
      const user = await userModel.findById(carRide.user).exec();

      return {
        carRideId: carRide._id,
        carRideUser: user.username,
        deviceData: deviceDataArray
      };
    }));

    res.render('index', { carRides: carRideArray });

    //res.json(carRides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  //res.render('index', { title: 'Express' });
});

module.exports = router;
