const express       = require('express');
const router        = express.Router();
const Models        = require("../../models");

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
function validateSnipPost (req, res, next) {
  req.checkBody("title", "Title cannot be empty").notEmpty();
  req.checkBody("code", "Code block cannot be empty").notEmpty();

  let errors = req.validationErrors();

  if(errors){
    let errMsg = [];
    errors.forEach( (err) => errMsg.push(err.msg) );
    sendError(400, res, errMsg);
  }
  else{
    next();
  }
}

router.get("/", (req, res) => {
  Models.Snippets.findAll({})
  .catch( (err) => sendError(500, res, err) )
  .then( (snipArr) => {
    let snips = [];
    snipArr.forEach( (snip) => snips.push(snip.dataValues) );
    res.status(200).json({
      snippets: snips
    })
  })
});

router.post('/', validateSnipPost, (req, res) => {
  res.send("Under construction");
})

router.get("/:userId", (req, res) => {
  Models.Snippets.findAll({
    where: {
      userId: req.params.userId
    }
  })
  .catch( (err) => sendError(500, res, err) )
  .then( (snipArr) => {
    let snips = [];
    snipArr.forEach( (snip) => snips.push(snip.dataValues) );
    res.status(200).json({
      snippets: snips
    })
  })
});

module.exports = router;
