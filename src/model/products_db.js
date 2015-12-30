'use strict';
/**
 * definition of product db
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
// var mongoSchema = mongoose.Schema;
// create schema
var product = {
    'name': String,
    'price': Number,
    'coefAd': Number,
    'coefMerch': Number,
    'delay': Number
};
// create model if not exists.

module.exports = mongoose.model('product', product);

