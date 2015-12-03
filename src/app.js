'use strict';
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var api = require('./routes/api.js');
var teams = require('./routes/team.js');
var products = require('./routes/products.js');
var decisions = require('./routes/decisions.js');

var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', api);
app.use('/teams', teams);
app.use('/products', products);
app.use('/decisions', decisions);

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
