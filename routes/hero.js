'use strict'

var express = require('express');
var HeroController = require('../controllers/hero');

var router = express.Router();
var md_auth = require('../middleware/auth');

//test paths
router.get('/hero/testing', HeroController.testing);

//user paths
router.post('/hero', md_auth.auth, HeroController.saveHero);
router.delete('/hero/:id', md_auth.auth, HeroController.deleteHero);
router.get('/hero/:id', md_auth.auth,  HeroController.getHero);
router.put('/hero/:id', md_auth.auth,  HeroController.updateHero);
router.get('/heroes/:page?', md_auth.auth, HeroController.getHeroes);
router.get('/heroes/:country/:page?', md_auth.auth, HeroController.getHeroesCountry);

module.exports = router;
