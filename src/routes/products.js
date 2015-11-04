/**
 * rest module that provide rest functions to teams table
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
var mongo = require('../model/products_db');

/**
 * read all team
 */
router.get('/', function(req, res) {

    mongo.find({}, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

})
/**
 * post (create) new team
 */
.post('/', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.name = req.body.name;

    db.save(function(err) {
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        if (err) {
            throw new Error(err);
        }
        res.status(200);
        res.send();
    });
})
/**
 * put (update) new information team
 */
.put(function(req,res){
    var response = {};
    // first find out record exists or not
    // if it does then update the record
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            // we got data from Mongo.
            // change it accordingly.
            if(req.body.userEmail !== undefined) {
                // case where email needs to be updated.
                data.userEmail = req.body.userEmail;
            }
            if(req.body.userPassword !== undefined) {
                // case where password needs to be updated
                data.userPassword = req.body.userPassword;
            }
            if()
            // save the data
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                }
                res.json(response);
            })
        }
    });
})

/**
 * get a team by its id
 */
.get('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {

        if (err) {
            throw new Error(err);
        }
        res.json(data);
    });
})
/**
 * delete a team by its id
 */
.delete('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            mongo.remove({
                _id: req.params.id
            }, function(err) {
                if (err) {
                    throw new Error(err);
                }
                res.json(data);
            });
        }
    });
});

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
