'use strict'

var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var HeroSchema = Schema({
	name: String,
	surname: String,
	superpower: String,
	image: String,
	country: {
		type: Schema.ObjectId,
		ref: 'Country'
	}

});

//Load Pagination
HeroSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Hero', HeroSchema);