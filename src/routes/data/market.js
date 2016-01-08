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
router
.get('/markets', function(req, res, next) {

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
.post('/market', function(req, res, next) {

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
});
/**
 * put (update) products info
 */
router.route('/market/:id')
.put(function(req, res, next) {
    mongo.findById(req.params.id, function(err, data) {

        if (err) {
            throw new Error(err);
        }

        if (req.body.name  !== undefined) {
            data.name = req.body.name;
        }

        var update = function(scope, element) {
            if (element._id !== undefined) {
                var elementIndex = data[scope].findIndex(function(e) {
                    return String(e._id) === String(element._id);
                });
                if (elementIndex !== -1) {
                    Object.assign(data[scope][elementIndex], element);

                }
            } else {
                data[scope].push(element);
            }
        };

        if (req.body.merchandiser !== undefined) {
            var updateMerchandiser = function(merchandiser) {
                update('merchandiser', merchandiser);
            };
            if (Array.isArray(req.body.merchandiser)) {
                req.body.merchandiser.forEach(updateMerchandiser);
            } else {
                updateMerchandiser(req.body.merchandiser);
            }
        }

        if (req.body.paymentDelay !== undefined) {
            var updatePaymentDelay = function(paymentDelay) {
                update('paymentDelay', paymentDelay);
            };
            if (Array.isArray(req.body.paymentDelay)) {
                req.body.paymentDelay.forEach(updatePaymentDelay);
            } else {
                updatePaymentDelay(req.body.paymentDelay);
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
.get(function(req, res, next) {
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
.delete(function(req, res, next) {
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

module.exports = router;

