/**
 * New node file
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
// var mongoSchema = mongoose.Schema;
// create schema
var paymentDelay = {
    'delay': String,
    'index': Number
};
// create model if not exists.

module.exports = mongoose.model('paymentDelay', paymentDelay);
