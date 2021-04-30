var express = require('express');
var router = express.Router();
const languages = require('../languages/languages');
const result = require('../util/app_result');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(result.reponseSuccess(null, languages.translation('hello')))
});

module.exports = router;
