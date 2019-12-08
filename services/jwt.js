'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user){
	//user data to identify and generate token
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30,'days').unix

	};
	return jwt.encode(payload, 'secret-password-to-generate-super-hero-token');
}