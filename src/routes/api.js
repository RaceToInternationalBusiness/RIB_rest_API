'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var appInfo = {
    name: 'MarkChamp',
    version: '1.0.0-SNAPSHOT'
  };
  res.send(appInfo);
})
.use(function(req,res,next){
	res.setHeader('Content-Type', 'text/plain');
	res.send(404, 'Page introuvable !');
});


module.exports = router;
