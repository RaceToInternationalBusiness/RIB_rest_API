'use strict';
/**
 * definition of results db
 */
var mongoose = require('mongoose');

var mongoStat = mongoose.connection.readyState;

if (mongoStat !== 1 && mongoStat !== 2) {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// create instance of Schema
var Schema = mongoose.Schema;
// create schema
var results = {
    'teamId': {
        type: Schema.ObjectId,
        ref: 'team'
    },
    'year': Number,
    'productCapacity': Number,
    'marketShare': String,
    'stock': Number,
    'sale': {
        'proposition': Number,
        'potential': Number,
        'real': Number
    },
    'turnover': Number, // without taxes
    'salePrice': Number, // without taxes
    'result': {
        'commercial': Number,
        'exercice': Number
    }

};
// create model if not exists.

module.exports = mongoose.model('results', results);
