const express =             require('express');
const router  =             express.Router();

router.get('/', (req, res) => {
  //Returns an array of all users
  res.send("Returns an array of all users");
});

router.post("/", (req, res) => {
  //Create a new user
  res.send("Create a new user");
});

router.get('/:userId', (req, res) => {
  //Find a specific user
  res.send("Find a specific user");
});

router.post('/login', (req, res) => {
  //Logs a user in
  res.send("Log in a user");
});

router.get('/whoami', (req, res) => {
  //Returns the user on the session or null
  res.send("Returns the session");
});

module.exports = router;
