'use strict';
/**
 * definition of a global market db
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
var Schema = mongoose.Schema;
// create schema
var globalMarket = {
    'marketYear': Number,
    'stocks': [{
        'productId': {
            type: Schema.ObjectId,
            ref: 'product'
        },
        'quantity': Number
    }]
};

// create model if not exists.
module.exports = mongoose.model('globalMarket', globalMarket);
