
// Import the server configuration file
var config = require('./config');

/* Get morgan for developer options*/
var morgan = require('morgan');

/* Import the ExpressJS framework for Middleware/routing */
var express = require('express');

/* Inclide CORS for cross domain hit.*/
var cors = require('cors');

/* Import the File System module for enabling File I/O operations */
var fs = require('fs');

/* Import Mongoose for enabling communication with MongoDB and
       management of data handling tasks */
var mongoose = require('mongoose');

/* Import Body Parser module for enabling data from POST requests
       to be extracted and parsed */
var bodyParser = require('body-parser');

/* Import path module to provide utilities for working with file
      and directory paths */
var path = require('path');

/** To create session for a User */
var session = require('express-session');

/* Define Mongoose connection to project's MongoDB database */
var connection = mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection Error:'));
db.once('open', function () {
    console.log('DB connected...');
    appInit();
})

var whiteListURL = ['http://localhost:8100', 'htttps://www.wob.com'];


function appInit() {
    /* Handle for storing the ExpressJS object */
    var app = express();

    /* Use ExpressJS Router class to create modular route handlers */
    var apiRouter = express.Router();

    /* CORS options to allow requests from whiteListed URL's */
    var corsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: whiteListURL[0],
        preflightContinue: false
    }

    // Allow appRouter to use CORS.
    apiRouter.use(cors(corsOptions));

   
   /* Manage size limits for POST/PUT requests */
   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    /* Grab any external routers and keep it in sync with server.js file. */
    var userRoute = require('./routes/userRoutes')(apiRouter);

    /* Mount the specified Middleware function based on matching path
       ALL Http requests will be sent to /api followed by whatever the
       requested endpoint is
    */
    app.use('/api', apiRouter);
    app.use('/user', userRoute);
     /** Tracking User Sessions */
     app.use(session({
        secret: 'work hard',
        resave: true,
        saveUninitialized: false
      }));
    apiRouter.options("*", cors(corsOptions));

    app.use(morgan('dev'));

    app.get('*', function (req, res) {
        res.send('Home');
    });

   

    /* Open a UNIX socket, listen for connections to the specified port */
    app.listen(config.port, function () {
        console.log('Server running on ' + config.port);
    });
}