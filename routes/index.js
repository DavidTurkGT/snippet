const express           = require('express');
const router            = express.Router();
const ApiRouter         = require('./api');
const path              = require('path');

router.use("/api/", ApiRouter);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/home", (req, res) => {
  res.render("home");
});

module.exports = router;
