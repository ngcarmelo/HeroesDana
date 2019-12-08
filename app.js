'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');
//Run Express
var app = express();

//Load routes files
var user_routes = require('./routes/user');
var country_routes = require('./routes/country');
var heroes_routes = require('./routes/hero');

//Middlewares
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());


//Rewrite Routes
app.use('/api', user_routes);
app.use('/api', country_routes);
app.use('/api', heroes_routes);

//Export module
module.exports = app;