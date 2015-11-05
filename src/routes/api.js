'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var appInfo = {
        name: 'Race to International Business',
        version: '1.0.0',
        environ: process.env.NODE_ENV
    };
    res.send(appInfo);
});

// router.use(function(req, res, next) {
// var err = new Error('Not Found');
// err.status = 404;
// next(err);
// });

module.exports = router;
