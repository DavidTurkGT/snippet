const express       = require('express');
const router        = express.Router();
const models        = require('../../models');

router.get('/', (req, res) => {
  res.send("Return an array of all tags");
});

module.exports = router;
