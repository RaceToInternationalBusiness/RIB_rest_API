/**
 * rest module that provide rest functions for decisions module
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
var mongo = require('../../model/decisions_db');
// remove all entries for a mongo model

// mongo.remove({}, function(err) {
// console.log('collection removed');
// });
/**
 * read all decisions
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
 * post (put) new decisions
 */
.post('/', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.teamId = req.body.teamId;

    db.decisions = req.body.decisions;

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
 * put (update) decisions info
 */
.put('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            if (req.body.teamId !== 'undefined') {
                data.teamId = req.body.decisions;
            }
            if (req.body.decisions !== 'undefined') {
                data.decisions = req.body.decisions;
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
 * adding a decision to decisions
 */
.post('/:id/decision', function(req, res) {
    var member = {
        firstname: '',
        lastname: '',
        email: ''
    };
    if (req.body.firstname  !== 'undefined') {
        member.firstname = req.body.firstname;
    }
    if (req.body.lastname !== 'undefined') {
        member.lastname = req.body.lastname;
    }
    if (req.body.email !== 'undefined') {
        member.email = req.body.email;
    }
    mongo.findOneAndUpdate(req.params.id,
            {$push: {members: member}},
            {safe: true, upsert: true},
            function(err, model) {
                console.log(err);
                res.json(model);
            });
})
/**
 * get a decision by its id
 */
.get('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {

        if (err) {
            throw new Error(err);
        }
        res.json(data.decisions);
    });
})
/**
 * get a decisions by its id
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
 * delete a by its id
 */
.delete('/:id', function(req, res) {
    mongo.findById({'_id': req.params.id}, function(err, data) {
        if (err) {
            res.send(err);
        }
    });
});

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
