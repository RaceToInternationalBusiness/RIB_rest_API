'use strict';
/**
 * definition of product db
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
// var mongoSchema = mongoose.Schema;
// create schema
var product = {
    'market': {
        type: Schema.ObjectId,
        ref: 'market'
    },
    'name': String,
    'priceIndex': [{
        'index': Number,
        'price': Number
    }],
    'advertising': [{
        'index': Number,
        'sensibility': Number
    }]
};
// create model if not exists.

module.exports = mongoose.model('product', product);
