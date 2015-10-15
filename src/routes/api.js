'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    var appInfo = {
        name: 'MarkChamp',
        version: '1.0.0-SNAPSHOT'
    };
    res.send(appInfo);
});
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
