/**
 * rest module that provide rest functions to
 */
'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

/**
 * mongodb module
 */
var mongo = require('../model/mongo');

/**
 * read all team
 */
router.get('/teams', function(req, res) {
    var response = {};
    mongo.find({}, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {
                'error': true,
                'message': 'Error fetching data'
            };
        } else {
            response = {
                'error': false,
                'message': data
            };
        }
        res.json(response);
    });
})
/**
 * post (put) new team
 */
.post('/teams', function(req, res) {

    var db = new mongo();
    var response = {};

    db.name = req.body.name;
    console.log(req);

    db.session = req.body.session;
    console.log(req.body.session);
    db.created = Date.now();

    db.members = req.body.members;
    console.log(req.body.members);
    db.save(function(err) {
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        if (err) {
            response = {
                'error': true,
                'message': 'Error adding data'
            };
        } else {
            response = {
                'error': false,
                'message': 'Data added'
            };
        }
        res.json(response);
    });
});

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
