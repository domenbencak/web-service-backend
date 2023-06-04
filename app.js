var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var WebSocket = require('ws');

// vključimo mongoose in ga povežemo z MongoDB
var mongoose = require('mongoose');
var mongoDB = "mongodb://127.0.0.1/RAI-projekt";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

function setUpServer() {
  return new Promise(function (resolve, reject) {
    var server = app.listen(3000, function () {
      console.log('Server listening on port 3000');
      var wss = new WebSocket.Server({ server });

      var connectedClients = [];

      wss.on('connection', function connection(ws) {
        console.log('WebSocket client connected');
        //console.log('Clients: ', wss.clients);
        connectedClients.push(ws);
        //console.log(ws);

        ws.on('message', function incoming(message) {
          console.log('Received message:', message);
          // Handle the received message here
        });

        ws.on('close', function close() {
          console.log('WebSocket client disconnected');
          // Remove the disconnected client from the connectedClients array
          connectedClients = connectedClients.filter(function(client) {
            return client !== ws;
          });
        });
      });

      resolve({ server: server, wss: wss, connectedClients: connectedClients}); // Resolve the promise with the WebSocket server
    });
  });
}

var tt = [];

// Call the function and await it before continuing
var wss, tt = setUpServer()
  .then(function (result) {
    var server = result.server;
    var wss = result.wss;
    var connectedClients = result.connectedClients;

    // Use the WebSocket server as needed
    // Call other code that depends on the server being set up
    var indexRouter = require('./routes/index');
    var userRouter = require('./routes/userRoutes');
    var deviceDataRouter = require('./routes/deviceDataRoutes');
    var carRideRouter = require('./routes/carRideRoutes');
    var carRideRatingRouter = require('./routes/carRideRatingRoutes');

    //web socket logic
    /*var server = app.listen(3000, function() {
      console.log('Server listening on port 3000');
    });

    var wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
      console.log('WebSocket client connected');

      ws.on('message', function incoming(message) {
        console.log('Received message:', message);
        // Handle the received message here
      });

      ws.on('close', function close() {
        console.log('WebSocket client disconnected');
      });
    });*/



    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    /**
     * Vključimo session in connect-mongo.
     * Connect-mongo skrbi, da se session hrani v bazi.
     * Posledično ostanemo prijavljeni, tudi ko spremenimo kodo (restartamo strežnik)
     */
    var session = require('express-session');
    var MongoStore = require('connect-mongo');
    app.use(session({
      secret: 'work hard',
      resave: true,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: mongoDB})
    }));
    //Shranimo sejne spremenljivke v locals
    //Tako lahko do njih dostopamo v vseh view-ih (glej layout.hbs)
    app.use(function (req, res, next) {
      res.locals.session = req.session;
      next();
    });

    app.use('/', indexRouter);
    app.use('/user', userRouter);
    app.use('/deviceData', deviceDataRouter);
    app.use('/carRide', carRideRouter);
    app.use('/carRideRating', carRideRatingRouter);

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(__dirname));


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
    return wss, connectedClients;
  })
  .catch(function (error) {
    console.error('Error setting up server:', error);
  });
/*var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRoutes');
var deviceDataRouter = require('./routes/deviceDataRoutes');
var carRideRouter = require('./routes/carRideRoutes');
var carRideRatingRouter = require('./routes/carRideRatingRoutes');*/

//console.log(tt);
async function getClients() {
  const clients = await wss.clients;
  return clients;
}

module.exports = { app, wss, tt: getClients };