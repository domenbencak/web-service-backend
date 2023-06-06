var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var waitOn = require('wait-on');

// vključimo mongoose in ga povežemo z MongoDB
var mongoose = require('mongoose');
var mongoDB = "mongodb://mongodb:27017/RAI-projekt"; // Updated connection URL

// Wait for MongoDB to be ready before connecting
waitOn({
  resources: [mongoDB],
  timeout: 60000, // Maximum wait time in milliseconds
  interval: 1000, // Polling interval in milliseconds
}, function (err) {
  if (err) {
    console.error('Error waiting for MongoDB:', err);
    return;
  }

  // MongoDB is ready, connect to it
  mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
});

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRoutes');
var deviceDataRouter = require('./routes/deviceDataRoutes');
var carRideRouter = require('./routes/carRideRoutes');
var carRideRatingRouter = require('./routes/carRideRatingRoutes');
var pythonRoutes = require('./routes/pythonRoutes');

var app = express();

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
app.use('/python', pythonRoutes);

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

module.exports = app;