'use strict';
/**
 * definition of team db
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
// var mongoSchema = mongoose.Schema;
// create schema
var decision = {
    'teamId': String,
    'decisions': [{
        'year': Number,
        'prime': Number,
        'nbSeller': Number,
        'paymentDelay': Number,
        'nbMachine': Number,
        'marketingCost': Number,
        'productDecisions': [{
            'productName': String,
            'stock': Number,
            'pvttc': Number,
            'pvht': Number,
            'quantity': Number,
            'marketing': Number
        }]
    }]
};

// create model if not exists.

module.exports = mongoose.model('decision', decision);

