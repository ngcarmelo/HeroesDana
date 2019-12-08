'use strict'

var validator = require('validator');
var moment = require('moment');
var Hero = require('../models/hero');
var Country = require('../models/country');

var controller = {

	testing: function(req, res) {
		res.status(200).send({
			message: 'Hello from the hero controller'
		});
	},

	saveHero: function(req, res) {
		//Postman: post, remember to add the auth token in the headers: --> authentication : value_token		
		var params = req.body;

		var validate_name = !validator.isEmpty(params.name);
		var validate_surname = !validator.isEmpty(params.surname);
		var validate_superpower = !validator.isEmpty(params.superpower);
		var validate_country = !validator.isEmpty(params.country);

		if (validate_name && validate_surname && validate_superpower && validate_country) {
			var hero = new Hero();
			hero.name = params.name;
			hero.surname = params.surname;
			hero.superpower = params.superpower;
			hero.image = null;

			var countryHero = params.country;

			Country.findOne({
				name: countryHero
			}, (err, issetCountry) => {
				if (err) return res.status(500).send({
					message: 'Error finding country'
				});

				if (!issetCountry) return res.status(404).send({

					message: 'The country does not exist, create it first'
				});

				if (issetCountry) {
					hero.country = issetCountry._id;
					console.log(hero.country);
				}

				//Check if user exist
				Hero.findOne({
					name: hero.name
				}, (err, issetHero) => {
					if (err) {
						return res.status(500).send({
							message: 'Error checking hero'
						});
					}

					if (!issetHero) {

						hero.save((err, heroStored) => {
							if (err) return res.status(500).send({
								message: 'Error saving hero'
							});
							if (!heroStored) return res.status(404).send({
								message: 'The hero has NOT been saved'
							});

							return res.status(200).send({
								hero: heroStored
							});
						});

					} else {
						return res.status(500).send({
							message: 'Error checking hero duplicity'
						});

					}

				});
			});

		} else {
			return res.status(200).send({
				message: 'Validation incorrect, try again',
				params: params
			});
		}

	},

	deleteHero: function(req, res) {

		var heroId = req.params.id;

		Hero.find({
			'_id': heroId
		}).remove((err, deleted) => {

			if (err) return res.status(500).send({
				message: 'Error deleting country'
			});

			return res.status(200).send({
				message: 'Deleted Hero'
			});
		});
	},

	getHero: function(req, res) {
		//Postam(get) and authorization token
		//we go through the url the id of a publication and voila,
		var heroId = req.params.id;

		Hero.find({
			_id: heroId
		}).populate('country').exec((err, hero) => {
			if (err) return res.status(500).send({
				message: 'Error returning hero'
			});
			if (!hero) return res.status(404).send({
				message: 'No hero'
			});
			return res.status(200).send({
				hero
			});

		});


	},

	getHeroes: function(req, res) {

		var page = 1;

		if (req.params.page) {
			page = req.params.page;
		}

		var options = {
			sort: {
				date: -1
			},
			populate: 'country',
			limit: 4,
			page: page
		};


		Hero.paginate({}, options, (err, heroes) => {
			if (err) return res.status(500).send({
				message: 'Error returning heroes'
			});
			if (!heroes) return res.status(404).send({
				message: 'No heroes'
			});

			return res.status(200).send({
				status: 'success',
				heroes: heroes.docs,
				totalDocs: heroes.totalDocs,
				totalPages: heroes.totalPages

			});

		});

	},

	getHeroesCountry: function(req, res) {
		var country = req.params.country;
		var page = 1;

		if (req.params.page) {
			page = req.params.page;
		}

		var options = {
			sort: {
				date: -1
			},
			populate: 'country',
			limit: 4,
			page: page
		};

		Country.findOne({
			name: country
		}, (err, issetCountry) => {
			if (err) return res.status(500).send({
				message: 'Error finding country'
			});
			if (!issetCountry) return res.status(404).send({
				message: 'The country does not exist, create it first'
			});
			if (issetCountry) {
				country = issetCountry._id;

			}

			Hero.paginate({
				country: country
			}, options, (err, heroes) => {
				if (err) return res.status(500).send({
					message: 'Error returning heroes'
				});
				if (!heroes) return res.status(404).send({
					message: 'No heroes'
				});
				return res.status(200).send({
					status: 'success',
					heroes: heroes.docs,
					totalDocs: heroes.totalDocs,
					totalPages: heroes.totalPages
				});
			});

		});
	},

	updateHero: function(req, res) {
		var heroId = req.params.id;
		var update = req.body;

		var validate_name = !validator.isEmpty(update.name);
		var validate_surname = !validator.isEmpty(update.surname);
		var validate_superpower = !validator.isEmpty(update.superpower);
		var validate_country = !validator.isEmpty(update.country);


		var countryHero = update.country;

		if (validate_name && validate_surname && validate_superpower && validate_country) {
			Country.findOne({
				name: countryHero
			}, (err, issetCountry) => {
				if (err) return res.status(500).send({
					message: 'Error finding country'
				});
				if (!issetCountry) return res.status(404).send({
					message: 'The country does not exist, create it first'
				});
				if (issetCountry) {
					update.country = issetCountry._id;
				}

				Hero.findOne({
						name: update.name.toLowerCase()
					},
					(err, issetHero) => {
						if (err) {
							return res.status(500).send({
								message: 'Error checking hero'
							});
						}
						if (!issetHero) {
							Hero.findByIdAndUpdate(heroId, update, {
								new: true
							}, (err, heroUpdated) => {
								if (err) return res.status(500).send({
									message: 'Error in the request'
								});
								if (!heroUpdated) return res.status(404).send({
									message: 'The hero could not be updated'
								});
								return res.status(200).send({
									hero: heroUpdated
								});
							});
						}

					});
			});

		} else {
			return res.status(200).send({
				message: 'Validation incorrect, try again'
			});
		}
	}
}

module.exports = controller;