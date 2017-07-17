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
    case 401:
      res.status(401).json({
        status: 401,
        msg: 'Invalid username/password'
      })
      break;
    case 404:
      res.status(404).json({
        status: 404,
        msg: "No matching item found"
      })
      break;
    case 500:
    console.log("The response: ", res);
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
  let savedHash = user.hash;
  let savedSalt = user.salt;
  let savedIterations = user.iterations;

  let hash = crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, config2.keylen, config2.digest);

  var hashedPassword = hash.toString('base64');
  return savedHash === hashedPassword;
}

//Middleware
function validateRequest(req, res, next) {
  req.checkBody("username", "Username cannot be blank").notEmpty();
  req.checkBody("password", "Password cannot be blank").notEmpty();

  errors = req.validationErrors();

  if(errors){
    let errMsg = [];
    errors.forEach( (err) => errMsg.push(err.msg) );
    sendError(400, res, errMsg);
  }
  else{
    next();
  }
};

function validateUniqueUser (req, res, next) {
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


router.get('/', (req, res) => {
  //Returns an array of all users
  Models.Users.findAll({})
  .catch( (err) => sendError(500, res, err) )
  .then( (users) => {
    for(let i = 0; i < users.length; i++){
      users[i] = users[i].dataValues;
    }
    res.status(200).json({users: users});
  });
});

router.post("/", validateRequest, validateUniqueUser, (req, res) => {
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

router.get('/whoami', (req, res) => {
  //Returns the user on the session or null
  if(!req.session.userId){
    sendError(404, res);
  }
  else{
    Models.Users.find({
      where: { id: req.session.userId }
    })
    .catch( (err) => sendError(500, res, err) )
    .then( (user) => {
      res.status(200).json({user: user.dataValues})
    })
  }
});

router.get('/:userId', (req, res) => {
  //Find a specific user
  Models.Users.find({ where: {id: req.params.userId } })
  .catch( (err) => sendError(500, err, res) )
  .then( (user) => {
    if(!user) sendError(404, res);
    else res.status(200).json({ user: user.dataValues });
  });
});

router.post('/login', validateRequest, (req, res) => {
  //Find the user in the database
  Models.Users.find({
    where: {username: req.body.username}
  })
  .catch( (err) => sendError(500, res, err) )
  .then( (user) => {
    if(!user){
      sendError(401, res);
    }
    else{
      if( isPasswordCorrect(user, req.body.password) ){
        req.session.userId = user.id;
        res.status(200).send("Logged in!");
      }
      else{
        sendError(401, res);
      }
    }
  })
});

router.post('/logout', (req, res) => {
  //Logs a user out
  res.send("Log out a user");
});



module.exports = router;
