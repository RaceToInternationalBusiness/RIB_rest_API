/**
 * rest module that provide rest functions to mechandiser rates
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
var mongo = require('../../model/indices/merchandiser.js');
// remove all entries for a mongo model

// mongo.remove({}, function(err) {
// console.log('collection removed');
// });
/**
 * read all merchandiser rate
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
 * post (put) new nbMerchandiser with index
 */
.post('/', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.delay = req.body.nbMerchandiser;
    db.index = req.body.index;

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
 * put (update) delay index
 */
.put('/:id', function(req, res) {
    mongo.find({nbMerchandiser: req.body.nbMerchandiser}, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {

            if (req.body.index !== 'undefined') {
                data.index = req.body.index;
            }

            data.save(function(err) {
                if (err) {
                    throw new Error(err);
                }
            });
        }
        res.json(data);
    });
})

/**
 * get an delay and index by its id
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
 * delete an authentification by its id
 */
.delete('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            mongo.remove({
                name: req.params.id
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
