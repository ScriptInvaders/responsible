require('./server-helpers');
var browserify   = require('browserify-middleware');
var express      = require('express');
var Reactify     = require('reactify');
var Path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var morgan       = require('morgan');
var db           = require(__dirname + '/../lib/db');

var routes       = express.Router();

// no browserify, utilize webpack
routes.get('/app-bundle.js',
  browserify(__dirname + '/../client/app.js', {
    transform: [Reactify],
  })
);

//Example test route for test
routes.get('/api/tags-example', function (req, res) {
  res.send(['node', 'express', 'browserify', 'react', 'react-dom']);
});

//Static assets
var assetFolder = Path.resolve(__dirname, '../client/public');
routes.use(express.static(assetFolder));

if (process.env.NODE_ENV !== 'test') {
  // Dev or production mode

  var app = express();

  //HTTP request logger middleware

  app.use(require('morgan')('dev'));

  //parse request body as JSON
  app.use(require('body-parser').json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //for cookies
  app.use(cookieParser());

  //Mounting router mount
  app.use('/', routes);

  var message = require('./apis/message-api');
  var rides = require('./apis/rides-api');
  var user = require('./apis/user-api');

  routes.use('/message', message);
  routes.use('/rides', rides);
  routes.use('/user', user);

  // sign-up, sign-in, sign-out routes. check Oauth for specifics:
  // app.post('/login', Oauth.authenticate('local-login', {
  //   successRedirect : '/trip', // redirect to the secure profile section
  //   failureRedirect : '/signup', // redirect back to the signup page if there is an error
  //   failureFlash : true // allow flash messages
  // }))

  //Catch-all Route (needs to go last so it doesn't interfere with other routes)
  routes.get('/*', function (req, res) {
    console.log('this is a catch-all route!');
    res.sendFile(assetFolder + '/index.html');
  });

  // Start the server!
  var port = process.env.PORT || 1337;
  app.listen(port);

  console.log('Listening on port', port);
} else {
  //for test, export:
  var user = require('./apis/user-api');
  var rides = require('./apis/rides-api');
  var message = require('./apis/message-api');

  routes.use('/user', user);
  routes.use('/rides', rides);
  routes.use('/messages', message);

  module.exports = routes;
};

