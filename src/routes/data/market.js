/**
 * rest module that provide rest functions to market table
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
var mongo = require('../../model/market_db');

// remove all entries for a mongo model
// mongo.remove({}, function(err) {
// console.log('collection removed');
// });

/**
 * read all products
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
 * post (create) new products
 */
    .post('/', function(req, res) {

        var db = new mongo();

        if (JSON.stringify(req.body) === '{}') {
            throw new Error('Post request has no parameters');
        }
        db.name = req.body.name;
        db.paymentDelay = req.body.paymentDelay;
        db.merchandiser = req.body.merchandiser;

        db.save(function(err) {
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if (err) {
                throw new Error(err);
            }
            res.status(200);
            res.send({_id: db._id});
        });
    })
/**
 * put (update) products info
 */
    .put('/:id', function(req, res) {
        mongo.findById(req.params.id, function(err, data) {

            if (err) {
                throw new Error(err);
            }

            if (req.body.name  !== undefined) {
                data.name = req.body.name;
            }

            if (req.body.merchandiser !== undefined) {
                var updateMerchandiser = function(merchandiser) {
                    if (merchandiser._id !== undefined) {
                        var merchandiserIndex = data.merchandiser.findIndex(function(m) {
                            return String(m._id) === String(merchandiser._id);
                        });
                        if (merchandiserIndex !== -1) {
                            Object.assign(data.merchandiser[merchandiserIndex], merchandiser);

                        }
                    } else {
                        data.merchandiser.push(merchandiser);
                    }
                };
                if (Array.isArray(req.body.merchandiser)) {
                    req.body.merchandiser.forEach(updateMerchandiser);
                } else {
                    updateMerchandiser(req.body.merchandiser);
                }
            }

            data.save(function(err) {
                if (err) {
                    throw new Error(err);
                }
            });

            res.json(data);
        });
    })
/**
 * get a products by its id
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
                },function(err) {
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
