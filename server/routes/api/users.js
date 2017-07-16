const express =             require('express');
const router  =             express.Router();
const Models  =             require('../../models');
const crypto  =             require('crypto');

//Support Functions
function sendError(status, res, err){
  switch(status){
    case 400:
      res.status(400).json({
        status: 400,
        msg: typeof err === 'string' ? err : err.join("\n")
      })
      break;
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

//Password Security
//Hashing a password
var config = {
    salt: function(length){
    return crypto.randomBytes(Math.ceil(32 * 3 / 4)).toString('base64').slice(0, length);
    },
    iterations: 20000,
    keylen: 512,
    digest: 'sha512'
};

function hashPassword(passwordinput){
    var salt = config.salt(32);
    var iterations = config.iterations;
    var hash = crypto.pbkdf2Sync(passwordinput, salt, iterations, config.keylen, config.digest);
    var hashedPassword = hash.toString('base64');

    return {salt: salt, hash: hashedPassword, iterations: iterations};
};

let config2 = {
  keylen: 512,
  digest: 'sha512'
};

function isPasswordCorrect(user, passwordAttempt) {
  let savedHash = user.passwordHash;
  let savedSalt = user.passwordSalt;
  let savedIterations = user.passwordIterations;

  let hash = crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, config2.keylen, config2.digest);

  var hashedPassword = hash.toString('base64');
  return savedHash === hashedPassword;
}

//Middleware
function validateNewUser(req, res, next) {
  req.checkBody("username", "Username cannot be blank").notEmpty();
  req.checkBody("password", "Password cannot be blank").notEmpty();

  errors = req.validationErrors();

  if(errors){
    let errMsg = [];
    errors.forEach( (err) => errMsg.push(err.msg) );
    sendError(400, res, errMsg);
  }
  else{
    //Check for a unique username
    Models.Users.find({ where: {username: req.body.username} })
    .then( (user) => {
      if(user){
        sendError(400, res, "Username already taken");
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

router.post("/", validateNewUser, (req, res) => {
  //Create a new user
  let hashedPassword = hashPassword(req.body.password);
  let newUser = {
    username: req.body.username,
    salt: hashedPassword.salt,
    iterations: hashedPassword.iterations,
    hash: hashedPassword.hash
  };
  Models.Users.create(newUser)
  .catch( (err) => sendError(500, res, err) )
  .then( (newUser) => {
    res.status(200).json({
      user: {
        username: newUser.username,
        password: {
          salt: newUser.salt,
          iterations: newUser.iterations,
          hash: newUser.hash
        }
      }
    });
  })
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
