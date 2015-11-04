/**
 * definition of team db
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/RIB_DB');
// create instance of Schema
//var mongoSchema = mongoose.Schema;
// create schema
var team = {
    'name': String,
    'session': String,
    'created': String,
    'Members': []
};
// create model if not exists.

module.exports = mongoose.model('team', team);
