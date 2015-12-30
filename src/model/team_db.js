'use strict';

/**
 * definition of team db
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 &&  mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
// var mongoSchema = mongoose.Schema;
// create schema
var team = {
    'name': String,
    'session': String,
    'created': String,
    'members': [{
        'firstname': String,
        'lastname': String,
        'email': String
    }]
};
// create model if not exists.

module.exports = mongoose.model('team', team);

