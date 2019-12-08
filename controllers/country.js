'use strict'

var validator = require('validator');
var moment = require('moment');
var Country = require('../models/country');

var controller = {

	testing: function(req, res) {
		res.status(200).send({
			message: 'Hello from the publication controller'
		});

	},

	saveCountry: function(req, res) {
		//Postman: post, remember to add the auth token in the headers: --> authentication : value_token		
		var params = req.body;

		var validate_name = !validator.isEmpty(params.name);
		var validate_continent = !validator.isEmpty(params.continent);

		if (validate_name || validate_continent) {

			var country = new Country();
			country.name = params.name;
			country.continent = params.continent;

			//Check if user exist
			Country.findOne({
				name: country.name
			}, (err, issetCountry) => {
				if (err) {
					return res.status(500).send({
						message: 'Error checking country'
					});
				}

				if (!issetCountry) {
					country.save((err, countryStored) => {
						if (err) return res.status(500).send({
							message: 'Error saving country'
						});
						if (!countryStored) return res.status(404).send({
							message: 'The country has NOT been saved'
						});

						return res.status(200).send({
							country: countryStored
						});
					});

				} else {
					return res.status(500).send({
						message: 'Error checking country duplicity'
					});

				}

			}); //close save

		} else {
			return res.status(200).send({
				message: 'Validation incorrect, try again',
				params: params
			});

		}

	},

	deleteCountry: function(req, res) {
		var countryId = req.params.id;

		Country.find({
			'_id': countryId
		}).remove((err, deleted) => {

			if (err) return res.status(500).send({
				message: 'Error deleting country'
			});

			return res.status(200).send({
				message: 'Deleted country'
			});
		});
	},

	getCountry: function(req, res) {
		var countryId = req.params.id;

		Country.findById(countryId, (err, country) => {
			if (err) return res.status(500).send({
				message: 'Error returning country'
			});
			if (!country) return res.status(404).send({
				message: 'No country'
			});

			return res.status(200).send({
				country
			});

		});
	},

	updateCountry: function(req, res) {
		var countryId = req.params.id;
		var update = req.body;

		var validate_name = !validator.isEmpty(update.name);
		var validate_continent = !validator.isEmpty(update.continent);

		if (validate_name && validate_continent) {
			Country.findOne({
					name: update.name.toLowerCase()
				},
				(err, issetCountry) => {
					if (err) {
						return res.status(500).send({
							message: 'Error checking country'
						});
					}

					if (!issetCountry) {
						Country.findByIdAndUpdate(countryId, update, {
							new: true
						}, (err, countryUpdated) => {
							if (err) return res.status(500).send({
								message: 'Error in the request'
							});

							if (!countryUpdated) return res.status(404).send({
								message: 'The country could not be updated'
							});

							return res.status(200).send({
								country: countryUpdated
							});
						});
					}

				});

		} else {
			return res.status(200).send({
				message: 'Validation incorrect, try again'
			});

		}
	}

}

module.exports = controller;