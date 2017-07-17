const express       = require('express');
const router        = express.Router();
const Models        = require('../../models');

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

router.get('/', (req, res) => {
  Models.Tags.findAll({})
  .catch( (err) => sendError(500, res, err) )
  .then( (tagArr) => {
    let tags = [];
    tagArr.forEach( (tag) => tags.push(tag.dataValues) );
    res.status(200).json({
      tags: tags
    })
  })
});

module.exports = router;
