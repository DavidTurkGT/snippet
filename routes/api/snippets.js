const express       = require('express');
const router        = express.Router();
const Models        = require("../../models");

router.get("/", (req, res) => {
  res.send("Return an array of all snips");
});

router.post('/', (req, res) => {
  res.send("Create a new code snip");
})

router.get("/:userId", (req, res) => {
  res.send("Return only an array of snips for specified user");
});

module.exports = router;
