/**
 * rest module that provide rest functions for globalMarket module
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
var mongo = require('../../model/globalMarket_db.js');
// remove all entries for a mongo model

// mongo.remove({}, function(err) {
// console.log('collection removed');
// });
/**
 * read all globalMarket
 */
router.get('/', function(req, res) {
    // Mongo command to fetch all data from collection.
    mongo.find({}, function(err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

})
/**
 * post (put) new globalMarket
 */
.post('/', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.marketYear = req.body.marketYear;

    db.stocks = req.body.stocks;

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
 * put (update) globalMarket info
 */
.put('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            if (req.body.marketYear !== undefined) {
                data.marketYear = req.body.marketYear;
            }
            if (req.body.stocks !== undefined) {
                data.stocks = req.body.stocks;
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
 * get a globalMarket by its id
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
 * delete a globalMarket by its id
 */
.delete('/:id', function(req, res) {
    mongo.findById({'_id': req.params.id}, function(err, data) {
        if (err) {
            res.send(err);
        }
    });
});

module.exports = router;
