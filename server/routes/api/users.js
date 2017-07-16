const express =             require('express');
const router  =             express.Router();
const Models  =             require('../../models');

//Support Functions
function sendError(status, res, err){
  switch(status){
    case 404:
      res.status(404).json({
        status: 404,
        msg: "No matching item found"
      })
    case 500:
      res.status(500).json({
        status: 500,
        error: err,
        msg: "Internal server error"
      });
    break;
    default:
      res.status(500).json({
        status: 500,
        error: err,
        msg: "Unrecognized error"
      });
    break;
  }
};

//Middleware
function validateNewUser(req, res, next) {
  req.checkBody("username", "Username cannot be blank").notEmpty();
  req.checkBody("password", "Password cannot be blank").notEmpty();

  errors = req.validationErrors();

  if(errors){

  }
  else{
    //Check for a unique username
    Models.Users.find({ where: {username: req.body.username} })
    .then( (user) => {
      if(user){

      }
      else{
        next();
      }
    })
  }
};

router.get('/', (req, res) => {
  //Returns an array of all users
  Models.Users.findAll({})
  .catch( (err) => sendError(500, res, err) )
  .then( (users) => {
    res.status(200).json({users: users});
  });
});

router.post("/", (req, res) => {
  //Create a new user
  res.send("Create the new user");
});

router.get('/:userId', (req, res) => {
  //Find a specific user
  Models.Users.find({ where: {id: req.params.userId } })
  .catch( (err) => sendError(500, err, res) )
  .then( (user) => {
    if(!user) sendError(404, res);
    else res.status(200).json({ user: user });
  });
});

router.post('/login', (req, res) => {
  //Logs a user in
  res.send("Log in a user");
});

router.post('/logout', (req, res) => {
  //Logs a user out
  res.send("Log out a user");
});

router.get('/whoami', (req, res) => {
  //Returns the user on the session or null
  res.send("Returns the session");
});

module.exports = router;
