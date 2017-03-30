var express = require('express'),
router = express.Router();

var controllers = require('../../controllers');

router.use(function(err, req, res, next) {
  res.status(err.code);
  if (err.code && err.code >= 100 && err.code < 600)
    res.status(err.code);
  else
    res.status(500);

  res.render('error', { error: err });
});


router.get('/',controllers.root.index);


module.exports = router;