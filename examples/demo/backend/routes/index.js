var express = require('express'),
	logger = require('winston'),
	router = express.Router();

router.use(function(err, req, res, next) {
  logger.error(err) || logger.error(JSON.stringify(err))
  next(err);
});

router.use('/',require(__dirname+'/root'));

router.use('/api',require(__dirname+'/api'));

router.use('/oauth2',require(__dirname+'/oauth2'))

router.use('/bower_components',express.static('frontend/bower_components'));

router.use('/public',express.static('frontend/'));

module.exports = router;


