const express           = require('express');
const validator         = require('express-validator');
const bodyParser        = require('body-parser');
const morgan            = require('morgan');
const router            = require('./routes');
const session           = require('express-session')
const path              = require('path');
const mustacheExpress = require('mustache-express');

const app = express();

app.use(express.static('public'));

app.engine('mustache', mustacheExpress());

app.set('views','./views');
app.set('view engine','mustache');


//Body Parser
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use( validator() );

//Morgan
// app.use( morgan('dev') );

//Sessions
app.use(session({
  secret: 'cornbread',
  resave: false,
  saveUninitialized: false,
}));

app.set('port', (process.env.PORT || 3000 ) );

//Router
app.use(router);

if(require.main === module){
  app.listen( app.get('port'), () => console.log("App running on port",app.get('port')));
}

module.exports = app;
