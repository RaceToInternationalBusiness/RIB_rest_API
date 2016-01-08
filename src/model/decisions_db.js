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
var Schema = mongoose.Schema;
// create schema
var decision = {
    'teamId': {
        type: Schema.ObjectId,
        ref: 'team'
    },
    'decisions': [{
        'year': Number,
        'prime': Number,
        'nbSeller': Number,
        'paymentDelay': String,
        'nbMachine': Number,
        'marketingCost': Number,
        'productDecisions': [{
            'productId': {
                type: Schema.ObjectId,
                ref: 'product'
            },
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
