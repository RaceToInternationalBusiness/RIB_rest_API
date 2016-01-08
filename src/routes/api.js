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

module.exports = router;

