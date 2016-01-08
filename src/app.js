'use strict';
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var api = require('./routes/api.js');

var app = express();

var cors = require('cors');
var corsWhiteList = process.env.CORS_ORIGIN.split(',');
console.log('CORS enable : ');
console.log(corsWhiteList);

var corsOptions = {
    origin: function(origin, callback) {
        var originIsWhitelisted = corsWhiteList.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

/**
 * game data
 */
var market = require('./routes/data/market');
var teams = require('./routes/data/team.js');
var products = require('./routes/data/products.js');
var decisions = require('./routes/data/decisions.js');
var authentification = require('./routes/data/authentification.js');
var sessions = require('./routes/data/sessions.js');
var results = require('./routes/data/results.js');
var globalMarket = require('./routes/data/globalMarket.js');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', cors(corsOptions), api);

app.use('/', cors(corsOptions), market);
app.use('/', cors(corsOptions), products);
app.use('/teams', cors(corsOptions), teams);
app.use('/decisions', cors(corsOptions), decisions);
app.use('/authentification', cors(corsOptions), authentification);
app.use('/sessions', cors(corsOptions), sessions);
app.use('/', cors(corsOptions), results);
app.use('/globalMarket', cors(corsOptions), globalMarket);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            status: err.status || 500,
            error: err.stack.toString()
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        status: err.status || 500
    });
});

module.exports = app;

