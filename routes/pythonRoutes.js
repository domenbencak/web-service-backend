var express = require('express');
var router = express.Router();
const axios = require('axios'); // axios is used for python integration

router.post('/checkFace', async (req, res) => {
    try {
      console.log('Received request for route:', req.originalUrl); // Log the received route

      const response = await axios.post('http://flask:5000/checkFace', req.body);
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server erroraaa' });
    }
  });

  router.post('/createFace', async (req, res) => {
    try {
      console.log('Received request for route:', req.originalUrl); // Log the received route
      const { image, username } = req.body;
  
      // Send the image data to the Python server
      const response = await axios.post('http://flask:5000/createFace', { image, username });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;
  