var express = require('express'),
router = express.Router();

router.use(function(err, req, res, next) {
  res.status(err.code);
  if (err.code && err.code >= 100 && err.code < 600)
    res.status(err.code).send(err.message);
  else
    res.status(500).send(err.message);
});

module.exports = router;