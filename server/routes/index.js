const express           = require('express');
const router            = express.Router();
const ApiRouter         = require('./api');

router.use("/api/", ApiRouter);

router.get("/", (req, res) => res.send("Hello there!") );

module.exports = router;
