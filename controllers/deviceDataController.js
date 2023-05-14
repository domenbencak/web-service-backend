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
            const deviceDatas = await DevicedataModel.find().populate('user');
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
  // Extract the data from the request body
  let {
    accelerometerX,
    accelerometerY,
    accelerometerZ,
    gyroscopeX,
    gyroscopeY,
    gyroscopeZ,
    latitude,
    longitude,
    timestamp,
    user,
    rating
  } = req.body;

  // Cast values to correct types
  accelerometerX = Array.isArray(accelerometerX) ? accelerometerX : [];
  accelerometerY = Array.isArray(accelerometerY) ? accelerometerY : [];
  accelerometerZ = Array.isArray(accelerometerZ) ? accelerometerZ : [];
  gyroscopeX = Array.isArray(gyroscopeX) ? gyroscopeX : [];
  gyroscopeY = Array.isArray(gyroscopeY) ? gyroscopeY : [];
  gyroscopeZ = Array.isArray(gyroscopeZ) ? gyroscopeZ : [];
  latitude = Number(latitude);
  longitude = Number(longitude);
  timestamp = new Date(timestamp);
  rating = Number(rating);

  // Validate data types
  const errors = [];
  if (!Array.isArray(accelerometerX)) {
    errors.push('accelerometerX should be an array');
  }
  if (!Array.isArray(accelerometerY)) {
    errors.push('accelerometerY should be an array');
  }
  if (!Array.isArray(accelerometerZ)) {
    errors.push('accelerometerZ should be an array');
  }
  if (!Array.isArray(gyroscopeX)) {
    errors.push('gyroscopeX should be an array');
  }
  if (!Array.isArray(gyroscopeY)) {
    errors.push('gyroscopeY should be an array');
  }
  if (!Array.isArray(gyroscopeZ)) {
    errors.push('gyroscopeZ should be an array');
  }
  if (isNaN(latitude)) {
    errors.push('latitude should be a number');
  }
  if (isNaN(longitude)) {
    errors.push('longitude should be a number');
  }
  if (isNaN(timestamp.getTime())) {
    errors.push('timestamp should be a valid date');
  }
  if (typeof user !== 'string') {
    errors.push('user should be a string');
  }
  if (isNaN(rating)) {
    errors.push('rating should be a number');
  }

  // Check if there are any validation errors
  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Invalid data types in the request body',
      errors: errors
    });
  }

  // Create a new instance of the DeviceDataModel
  const deviceData = new DeviceDataModel({
    accelerometerX,
    accelerometerY,
    accelerometerZ,
    gyroscopeX,
    gyroscopeY,
    gyroscopeZ,
    latitude,
    longitude,
    timestamp,
    user,
    rating
  });

  // Save the deviceData object to the database
  deviceData.save(function(err, savedData) {
    if (err) {
      console.error('Error when creating deviceData:', err);
      return res.status(500).json({
        message: 'Error when creating deviceData',
        error: err
      });
    }

    console.log('DeviceData created:', savedData);
    res.send('DeviceData created successfully');
  });
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
    }
};
