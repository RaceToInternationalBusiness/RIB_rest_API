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
var mongo = require('../../model/authentification_db.js');
// remove all entries for a mongo model

// mongo.remove({}, function(err) {
// console.log('collection removed');
// });
/**
 * read all authentification !! remove it or comment it
 */
router.get('/', function(req, res) {

    mongo.find({}, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

});
/**
 * post (put) new authentification
 */
router.post('/', function(req, res) {

    var db = new mongo();

    if (JSON.stringify(req.body) === '{}') {
        throw new Error('Post request has no parameters');
    }
    db.login = req.body.login;
    db.password = req.body.password;
    db.isAdmin = req.body.isAdmin;

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
 * put (update) authentification
 */
.put('/:id', function(req, res) {
    mongo.findById(req.params.id, function(err, data) {
        console.log(data);
        if (err) {
            throw new Error(err);
        } else {
            if (req.body.login  !== 'undefined') {
                data.name = req.body.login;
            }
            if (req.body.password !== 'undefined') {
                data.session = req.body.password;
            }
            if (req.body.isAdmin !== 'undefined') {
                data.isAdmin = req.body.isAdmin;
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
 * get a authentification by its id
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
})
/**
 * Authentification function that check the login/password
 */
.post('/authentificate', function(req, res) {
    if (req.body.login !== '' && req.body.password !== '') {
        mongo.find({login: req.body.login},function(err, data) {
            var reponse = {};
            if (err) {
                throw new Error(err);
            } else if (data.length !== 0) {
                if (data[0].password === req.body.password) {
                    reponse.authenticated = true;
                    reponse.isAdmin = data[0].isAdmin;
                    res.json(reponse);
                } else {
                    reponse.authenticated = false;
                    reponse.isAdmin = false;
                    res.json(reponse);
                }
            } else {
                reponse.authenticated = false;
                reponse.isAdmin = false;
                res.json(reponse);
            }
        });
    }
});

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
