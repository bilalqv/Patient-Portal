const express = require('express');
const session = require('express-session');
const { SESSION_SECRET, SESSION_MAX_AGE } = require('./config/config');
require('dotenv').config();

const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));

// for parsing application/xwww-
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// using session
app.use(session({
  secret : SESSION_SECRET,
  resave : false,
  saveUninitialized : false,
  cookie : {
    sameSite : 'strict',
    maxAge : SESSION_MAX_AGE,
  }
}));

module.exports = app;