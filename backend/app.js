const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const {
  connect,
  connection,
} = require('mongoose');
const personsRouter = require('./routes/persons');
const personRouter = require('./routes/person');

console.log('Starting mongodb connection');
connect('mongodb://Marcio:test1234@mongodb:27017/test')
  .then(() => {
    console.log('Mongodb connected');
  });

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Just for completeness, return a 503 error in case MongoDB is not yet available.
 * This can happen if MongoDB is not yet connected, or if the service is down. A request
 * might hang without handling this scenario.
 */
app.use('/', (req, res, next) => {
  if (connection.readyState !== 1) {
    next(createError.ServiceUnavailable('MongoDB not connected'));
  } else {
    next();
  }
});

app.use('/persons', personsRouter);
app.use('/person', personRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound('Route not found'));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send(err.message || 'Something went wrong');
});

module.exports = app;
