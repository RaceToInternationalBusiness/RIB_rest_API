/**
 * rest module that provide rest functions to products table
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
var mongo = require('../../model/products_db');

// remove all entries for a mongo model
// mongo.remove({}, function(err) {
// console.log('collection removed');
// });

/**
 * read all products
 */
router.get('/market/:marketId/products', function(req, res, next) {

    mongo.find({market: req.params.marketId}, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

});
/**
 * post (create) new products
 */
router.post('/market/:marketId/product', function(req, res, next) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        return next(new Error('Post request has no parameters'));
    }
    db.market = req.params.marketId;
    db.name = req.body.name;
    db.price = req.body.price;
    db.coefAd = req.body.coefAd;
    db.coefMerch = req.body.coefMerch;
    db.delay = req.body.delay;

    db.save(function(err) {
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        if (err) {
            return next(err);
        }
        res.status(200);
        res.send({_id: db._id});
    });
});
/**
 * put (update) products info
 */
router.route('/market/:marketId/product/:productId')
.put(function(req, res, next) {
    mongo.findOne({_id: req.params.productId, market: req.params.marketId}, function(err, data) {

        if (err) {
            return next(err);
        }
        if (data === null) {
            var notFound = new Error('Product not Found');
            notFound.status = 404;
            return next(notFound);
        }
        if (req.body.name  !== 'undefined') {
            data.name = req.body.name;
        }
        if (req.body.price !== 'undefined') {
            data.price = req.body.price;
        }
        if (req.body.coefAd !== 'undefined') {
            data.coefAd = req.body.coefAd;
        }
        if (req.body.coefMerch !== 'undefined') {
            data.coefMerch = req.body.coefMerch;
        }
        if (req.body.delay !== 'undefined') {
            data.delay = req.body.delay;
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
.get(function(req, res, next) {
    mongo.findOne({_id: req.params.productId, market: req.params.marketId}, function(err, data) {
        if (err) {
            return next(err);
        }
        if (data === null) {
            var notFound = new Error('Product not Found');
            notFound.status = 404;
            return next(notFound);
        }
        res.json(data);
    });
})
/**
 * delete a product by its id
 */
.delete(function(req, res, next) {
    mongo.findOne({_id: req.params.productId, market: req.params.marketId}, function(err, data) {
        if (err) {
            return next(err);
        }
        if (data === null) {
            var notFound = new Error('Product not Found');
            notFound.status = 404;
            return next(notFound);
        }
        mongo.remove({
            _id: req.params.id
        },function(err) {
            if (err) {
                throw new Error(err);
            }
            res.json(data);
        });

    });
});

module.exports = router;

