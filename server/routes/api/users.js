const express =             require('express');
const router  =             express.Router();

router.get('/', (req, res) => {
  //Returns an array of all users

});

router.post("/", (req, res) => {
  //Create a new user
});

router.get('/:userId', (req, res) => {
  //Find a specific user
});

router.post('/login', (req, res) => {
  //Logs a user in
});

router.get('/whoami', (req, res) => {
  //Returns the user on the session or null
});

module.exports = router;
