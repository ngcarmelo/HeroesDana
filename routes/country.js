'use strict'

var express = require('express');
var CountryController = require('../controllers/country');

var router = express.Router();
var md_auth = require('../middleware/auth');

//test paths
router.get('/testing', CountryController.testing);

//user paths
router.post('/country', md_auth.auth, CountryController.saveCountry);
router.delete('/country/:id', md_auth.auth, CountryController.deleteCountry);
router.get('/country/:id', md_auth.auth, CountryController.getCountry);
router.put('/country/:id', md_auth.auth, CountryController.updateCountry);

module.exports = router;
