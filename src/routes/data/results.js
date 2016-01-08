/**
 * rest module that provide rest functions to results data
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
var mongo = require('../../model/results_db.js');
// remove all entries for a mongo model

// mongo.remove({}, function(err) {
// console.log('collection removed');
// });
/**
 * read all results
 */
router.get('/results', function(req, res) {

    mongo.find({}, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

});
/**
 * post (put) new results
 */
router.post('/result', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.teamId = req.body.teamId;
    db.year = req.body.year;
    db.productCapacity = req.body.productCapacity;
    db.market = req.body.market;
    db.stock = req.body.stock;
    db.sale = req.body.sale;
    db.turnover = req.body.turnover;
    db.salePrice = req.body.salePrice;
    db.result = req.body.result;

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
 * put (update) results
 */
.put('/result/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        console.log(data);
        if (err) {
            throw new Error(err);
        } else {
            if (req.body.teamId !== undefined) {
                data.teamId = req.body.teamId;
            }
            if (req.body.year !== undefined) {
                data.year = req.body.year;
            }
            if (req.body.productCapacity !== undefined) {
                data.productCapacity = req.body.productCapacity;
            }
            if (req.body.market !== undefined) {
                data.market = req.body.market;
            }
            if (req.body.stock !== undefined) {
                data.stock = req.body.stock;
            }
            if (req.body.sale !== undefined) {
                data.sale = req.body.sale;
            }
            if (req.body.turnover !== undefined) {
                data.turnover = req.body.turnover;
            }
            if (req.body.salePrice !== undefined) {
                data.salePrice = req.body.salePrice;
            }
            if (req.body.result !== undefined) {
                data.result = req.body.result;
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
 * get a results by its id
 */
.get('/result/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        if (err) {
            throw new Error(err);
        }
        res.json(data);
    });
})
/**
 * get a results by team id
 */
.get('/team/:teamId/results',function(req, res, next)  {
    mongo.find({teamId: req.params.teamId},function(err, data) {

        if (err) {
            res.send(err);
        }
        res.json(data);
    });

})
/**
 * delete an results by its id
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

module.exports = router;
