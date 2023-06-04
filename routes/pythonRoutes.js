var express = require('express');
var router = express.Router();
const axios = require('axios'); // axios is used for python integration

router.get('/checkFace', async (req, res) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000');
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server erroraaa' });
    }
  });

  module.exports = router;
  