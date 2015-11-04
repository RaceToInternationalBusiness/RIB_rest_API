/**
 * definition of team db
 */
var mongoose = require('mongoose');


var mongoStat = mongoose.connection.readyState;

if (mongoStat != 1 &&  mongoStat != 2) {
    mongoose.connect('mongodb://localhost:27017/RIB_DB');
}

// create instance of Schema
//var mongoSchema = mongoose.Schema;
// create schema
var product = {
    'name': String
};
// create model if not exists.

module.exports = mongoose.model('product', product);
