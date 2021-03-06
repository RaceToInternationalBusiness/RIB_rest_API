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
var mongo = require('../../model/team_db');
// remove all entries for a mongo model

// mongo.remove({}, function(err) {
// console.log('collection removed');
// });
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
 * post (put) new team
 */
.post('/', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.name = req.body.name;

    db.session = req.body.session;

    db.created = Date.now();

    db.members = req.body.members;

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
 * put (update) team info
 */
.put('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            if (req.body.name  !== undefined) {
                data.name = req.body.name;
            }
            if (req.body.session !== undefined) {
                data.session = req.body.session;
            }
            if (req.body.created !== undefined) {
                data.created = req.body.created;
            }
            if (req.body.membrers !== undefined) {
                data.members = req.body.members;
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
 * adding a members to team
 */
.post('/:id/member', function(req, res) {
    var member = {
        firstname: '',
        lastname: '',
        email: ''
    };
    if (req.body.firstname  !== undefined) {
        member.firstname = req.body.firstname;
    }
    if (req.body.lastname !== undefined) {
        member.lastname = req.body.lastname;
    }
    if (req.body.email !== undefined) {
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
