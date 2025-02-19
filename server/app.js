var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/jokeDB';

mongoose.connect(mongoDB, {});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to the database');
});

mongoose.connection.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jokesRouter = require('./routes/jokes'); // Joke-related API routes

var app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/jokes', jokesRouter); // Use jokes routes

// Error handling
app.use(function (req, res, next) {
  res.status(404).json({ message: "Route not found" });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
