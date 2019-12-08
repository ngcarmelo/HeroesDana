'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret-password-to-generate-super-hero-token';

//method name --> auth
exports.auth = function(req, res, next) {
	//Check if we get Authorization headers
	if (!req.headers.authorization) {
		return res.status(403).send({
			message: 'Petition does not have the authorization header'
		});
	}

	//Clean token and delete quotation marks
	var token = req.headers.authorization.replace(/['"]+/g, '');

	try {
		//decode token
		var payload = jwt.decode(token, secret);

		//check if the token has expired
		if (payload.exp <= moment().unix()) {
			return res.status(404).send({
				message: 'Token has expired'
			});
		}

	} catch (ex) {
		return res.status(404).send({
			message: 'Token is not valid'
		});
	}
	//attach identified user to the request
	req.user = payload;

	next();
};