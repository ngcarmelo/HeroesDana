'use strict'

var validator = require('validator');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('../services/jwt');

var controller = {

	testing: function(req, res) {
		return res.status(200).send({
			message: "I'm  testing method"
		});
},

save: function(req, res) {
		//Collect parameters from request
		var params = req.body

		//Validate data
		var validate_name = !validator.isEmpty(params.name);
		var validate_surname = !validator.isEmpty(params.surname);
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		var validate_password = !validator.isEmpty(params.password);

		console.log(validate_name, validate_surname, validate_email, validate_password);

		if (validate_name && validate_surname && validate_email && validate_password) {
			//Create user object
			var user = new User();

			//Assign values to user
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.role = 'ROLE_USER';
			user.image = null;


			//Check if user exist
			User.findOne({
				email: user.email
			}, (err, issetUser) => {
				if (err) {
					return res.status(500).send({
						message: 'Error checking user duplicity'
					});
				}

				if (!issetUser) {
					//if it does not exist, 

					//encrypt the password 			 
					const saltRounds = 10;
					bcrypt.hash(params.password, saltRounds, function(err, hash) {
						// Store hash in your password DB.
						user.password = hash;


						//and save the user
						user.save((err, userStored) => {
							if (err) {
								return res.status(500).send({
									message: 'Error saving user'
								});
							}
							if (!userStored) {
								return res.status(400).send({
									message: 'The user has not been saved'
								});
							}

							//return a response
							// return res.status(500).send({  message: 'User is not registered',	 user });

							return res.status(200).send({
								status: 'success',
								user: userStored
							});
						}); //close save
					}); //close bcrypt



				} else {
					return res.status(200).send({
						message: 'User is already registered'
					});
				}
			}); //close findOne



		} else {
			return res.status(200).send({
				message: 'Validation incorrect, try again',
				params: params
			});

		}
	},

	login: function(req, res) {
		//Collect parameters
		var params = req.body;

		//Validate data
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		var validate_password = !validator.isEmpty(params.password);

		if (!validate_email || !validate_password) {
			return res.status(200).send({
				message: 'The data is incorrect, send them well'
			});
		}

		//Find users that match the email
		User.findOne({
			email: params.email.toLowerCase()
		}, (err, user) => {

			if (err) {
				return res.status(500).send({
					message: 'error when trying to login'
				});
			}

			if (!user) {
				return res.status(404).send({
					message: 'Username does not exist'
				});
			}



			//if you find it

			//check password (email and password match)/bcrypt
			bcrypt.compare(params.password, user.password, (err, check) => {

				//if it is correct
				if (check) {
					//generate jwt token  and return it (later)
					if (params.gettoken) {
						return res.status(200).send({
							token: jwt.createToken(user)
						});

					} else {
						//Clean object
						user.password = undefined;


						//Return data
						return res.status(200).send({
							status: "success",
							user
						});

					}



				} else {
					return res.status(200).send({
						message: 'Credentials are not correct'
					});

				}


			});


		});


	}





}

module.exports = controller;
