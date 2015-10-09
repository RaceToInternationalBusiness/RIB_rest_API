var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var appInfo = {
    name: "MarkChamp",
    version: "1.0.0-SNAPSHOT"
  };
  res.send(appInfo);
});

module.exports = router;

