'use strict';
/**
 * definition of session db
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
// var mongoSchema = mongoose.Schema;
// create schema
var session = {
    'created': String,
    'name': String,
    'nbYears': Number,
    'market': String,
    'members': [String]
};
// create model if not exists.

module.exports = mongoose.model('session', session);
